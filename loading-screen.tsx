"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

const loadingMessages = [
  "Scanning thousands of websites for hidden opportunities...",
  "Analyzing domain authority and spam scores...",
  "Finding low-competition gems in your niche...",
  "Discovering untapped lead sources...",
]

export function LoadingScreen() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          {/* Animated spinner */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>

          {/* Main message */}
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Searching the web...</h2>
          <p className="text-lg text-muted-foreground mb-2">Hang tight while we scan thousands of sites.</p>

          {/* Rotating micro-messages */}
          <div className="h-12 flex items-center justify-center">
            <p key={currentMessageIndex} className="text-sm text-muted-foreground animate-fade-in px-4">
              {loadingMessages[currentMessageIndex]}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
