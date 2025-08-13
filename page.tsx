"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchForm } from "@/components/search-form"
import { LoadingScreen } from "@/components/loading-screen"
import { ResultsTable } from "@/components/results-table"
import { ErrorMessage } from "@/components/error-message"

export interface SearchFormData {
  niche: string
  max_traffic: number
  max_da: number
  max_dr: number
  min_spam_score: number
  keywords: string
  amount: number
}

export interface SearchResult {
  url: string
  country: string
  traffic: number
  da: number
  dr: number
  spam_score: number
  match: boolean
}

type AppState = "form" | "loading" | "results" | "error" | "rate-limited" | "confirm"

export default function ClientsRadar() {
  const [state, setState] = useState<AppState>("form")
  const [results, setResults] = useState<SearchResult[]>([])
  const [formData, setFormData] = useState<SearchFormData | null>(null)
  const [pendingFormData, setPendingFormData] = useState<SearchFormData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number>(0)
  const [lastRequestTime, setLastRequestTime] = useState<number>(0)
  const [hasEverMadeRequest, setHasEverMadeRequest] = useState<boolean>(false)

  useEffect(() => {
    const savedCooldown = localStorage.getItem("rateLimitCooldown")
    const savedTime = localStorage.getItem("rateLimitStartTime")
    const savedLastRequest = localStorage.getItem("lastRequestTime")
    const savedHasRequested = localStorage.getItem("hasEverMadeRequest")

    if (savedHasRequested) {
      setHasEverMadeRequest(true)
    }

    if (savedLastRequest) {
      setLastRequestTime(Number.parseInt(savedLastRequest))
    }

    if (savedCooldown && savedTime) {
      const elapsed = Math.floor((Date.now() - Number.parseInt(savedTime)) / 1000)
      const remaining = Number.parseInt(savedCooldown) - elapsed

      if (remaining > 0) {
        setRateLimitCooldown(remaining)
        setState("rate-limited")
      } else {
        localStorage.removeItem("rateLimitCooldown")
        localStorage.removeItem("rateLimitStartTime")
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (rateLimitCooldown > 0) {
      interval = setInterval(() => {
        setRateLimitCooldown((prev) => {
          if (prev <= 1) {
            setState("form")
            localStorage.removeItem("rateLimitCooldown")
            localStorage.removeItem("rateLimitStartTime")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [rateLimitCooldown])

  const handleSearch = async (data: SearchFormData) => {
    if (!hasEverMadeRequest) {
      setPendingFormData(data)
      setState("confirm")
      return
    }

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    const minRequestInterval = 3600000 // 1 hour minimum between requests

    if (timeSinceLastRequest < minRequestInterval && lastRequestTime > 0) {
      const remainingMinutes = Math.ceil((minRequestInterval - timeSinceLastRequest) / 60000)
      setErrorMessage(`Please wait ${remainingMinutes} minutes before making another request to avoid rate limiting.`)
      setState("error")
      return
    }

    if (rateLimitCooldown > 0) {
      setState("rate-limited")
      return
    }

    await performSearch(data)
  }

  const handleConfirmSearch = async () => {
    if (!pendingFormData) return

    setHasEverMadeRequest(true)
    localStorage.setItem("hasEverMadeRequest", "true")

    await performSearch(pendingFormData)
    setPendingFormData(null)
  }

  const handleCancelSearch = () => {
    setPendingFormData(null)
    setState("form")
  }

  const performSearch = async (data: SearchFormData) => {
    setState("loading")
    setFormData(data)
    const now = Date.now()
    setLastRequestTime(now)
    localStorage.setItem("lastRequestTime", now.toString())

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout

      console.log("Making request to webhook with data:", data)

      const response = await fetch("https://hook.us2.make.com/1715gyjveo6zawga8ucnc8f45228v3p2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Response status:", response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorText = await response.text()
          if (errorText) {
            console.error("Error response body:", errorText)

            const isRateLimit =
              errorText.toLowerCase().includes("too many requests") ||
              errorText.toLowerCase().includes("rate limit") ||
              errorText.toLowerCase().includes("scenario") ||
              response.status === 429

            if (isRateLimit) {
              const cooldownSeconds = 86400 // 24 hours
              setRateLimitCooldown(cooldownSeconds)
              localStorage.setItem("rateLimitCooldown", cooldownSeconds.toString())
              localStorage.setItem("rateLimitStartTime", Date.now().toString())
              setState("rate-limited")
              return
            }

            errorMessage = errorText
          }
        } catch (e) {
          console.error("Could not read error response body:", e)
        }

        setErrorMessage(errorMessage)
        throw new Error(errorMessage)
      }

      const responseText = await response.text()
      console.log("Raw response text:", responseText)

      let cleanedJson = responseText.trim()

      // Check if response is wrapped in markdown code blocks
      if (cleanedJson.startsWith("```json") && cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        console.log("Cleaned JSON after removing markdown:", cleanedJson)
      } else if (cleanedJson.startsWith("```") && cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "")
        console.log("Cleaned JSON after removing generic markdown:", cleanedJson)
      }

      let results: SearchResult[]
      try {
        results = JSON.parse(cleanedJson)
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError)
        console.error("Attempted to parse:", cleanedJson)
        throw new Error(
          `Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`,
        )
      }

      console.log("Received results:", results)

      if (!Array.isArray(results)) {
        throw new Error("Server response is not an array of results")
      }

      if (results.length === 0) {
        setErrorMessage("No results found for your search criteria. Try adjusting your parameters.")
        setState("error")
      } else {
        setResults(results)
        setState("results")
      }
    } catch (error) {
      console.error("Search failed:", error)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setErrorMessage("Request timed out after 2 minutes. The search may be taking longer than expected.")
        } else if (error.message.includes("CORS")) {
          setErrorMessage("Connection error: The service may not be available from this domain.")
        } else if (error.message.includes("Failed to fetch")) {
          setErrorMessage("Network error: Please check your internet connection and try again.")
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }

      setState("error")
    }
  }

  const handleNewSearch = () => {
    setState("form")
    setResults([])
    setErrorMessage("")
  }

  const handleTryAgain = () => {
    setState("form")
    setErrorMessage("")
  }

  const ConfirmationDialog = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Important: Rate Limiting Notice</h2>
        <div className="text-left space-y-3 text-blue-700">
          <p>
            ⚠️ <strong>This API has very strict rate limits</strong>
          </p>
          <p>
            • Only <strong>1 request per hour</strong> is allowed
          </p>
          <p>
            • Exceeding limits triggers a <strong>24-hour cooldown</strong>
          </p>
          <p>• Make sure your search parameters are exactly what you need</p>
          <p>• Double-check your niche, traffic limits, and other settings</p>
        </div>
        <div className="mt-6 space-x-4">
          <button
            onClick={handleConfirmSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            I Understand - Proceed with Search
          </button>
          <button
            onClick={handleCancelSearch}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel - Review Settings
          </button>
        </div>
      </div>
    </div>
  )

  const RateLimitMessage = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-800 mb-2">24-Hour Rate Limit Active</h2>
        <p className="text-red-700 mb-4">
          The API rate limit has been exceeded. You must wait 24 hours before making another request.
        </p>
        <div className="text-2xl font-mono text-red-800">
          {Math.floor(rateLimitCooldown / 3600)}h {Math.floor((rateLimitCooldown % 3600) / 60)}m{" "}
          {rateLimitCooldown % 60}s
        </div>
        <p className="text-sm text-red-600 mt-2">Time remaining until next search allowed</p>
        <p className="text-xs text-red-500 mt-4">
          This cooldown persists across page refreshes and browser sessions to prevent further rate limiting.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        {state === "form" && <SearchForm onSubmit={handleSearch} initialData={formData} />}

        {state === "confirm" && <ConfirmationDialog />}

        {state === "loading" && <LoadingScreen />}

        {state === "results" && <ResultsTable results={results} onNewSearch={handleNewSearch} />}

        {state === "error" && <ErrorMessage onTryAgain={handleTryAgain} message={errorMessage} />}

        {state === "rate-limited" && <RateLimitMessage />}
      </div>
    </div>
  )
}
