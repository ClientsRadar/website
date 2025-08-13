"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  onTryAgain: () => void
  message?: string // Added optional message prop for custom error messages
}

export function ErrorMessage({ onTryAgain, message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {message ? "Search Error" : "No results found"}
          </h2>

          <p className="text-muted-foreground mb-6">
            {message || "Please try again with different search parameters."}
          </p>

          <Button onClick={onTryAgain} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
