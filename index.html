"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchFormData } from "@/app/page"

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void
  initialData?: SearchFormData | null
}

export function SearchForm({ onSubmit, initialData }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    niche: initialData?.niche || "",
    max_traffic: initialData?.max_traffic || 50000,
    max_da: initialData?.max_da || 40,
    max_dr: initialData?.max_dr || 40,
    min_spam_score: initialData?.min_spam_score || 3,
    keywords: initialData?.keywords || "",
    amount: initialData?.amount || 50,
  })

  const [errors, setErrors] = useState<Partial<SearchFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<SearchFormData> = {}

    if (!formData.niche.trim()) {
      newErrors.niche = "Niche is required"
    }

    if (!formData.max_traffic || formData.max_traffic <= 0) {
      newErrors.max_traffic = "Maximum traffic must be a positive number"
    }

    if (!formData.max_da || formData.max_da <= 0 || formData.max_da > 100) {
      newErrors.max_da = "Maximum DA must be between 1 and 100"
    }

    if (!formData.max_dr || formData.max_dr <= 0 || formData.max_dr > 100) {
      newErrors.max_dr = "Maximum DR must be between 1 and 100"
    }

    if (formData.min_spam_score < 0 || formData.min_spam_score > 100) {
      newErrors.min_spam_score = "Minimum spam score must be between 0 and 100"
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Search Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="niche">Niche *</Label>
              <Input
                id="niche"
                name="niche"
                type="text"
                value={formData.niche}
                onChange={(e) => handleInputChange("niche", e.target.value)}
                placeholder="e.g., fashion, tech, health"
                required
                disabled={isSubmitting}
              />
              {errors.niche && <p className="text-sm text-destructive mt-1">{errors.niche}</p>}
            </div>

            <div>
              <Label htmlFor="max_traffic">Maximum Traffic *</Label>
              <Input
                id="max_traffic"
                name="max_traffic"
                type="number"
                value={formData.max_traffic}
                onChange={(e) => handleInputChange("max_traffic", Number.parseInt(e.target.value) || 0)}
                placeholder="50000"
                required
                disabled={isSubmitting}
              />
              {errors.max_traffic && <p className="text-sm text-destructive mt-1">{errors.max_traffic}</p>}
            </div>

            <div>
              <Label htmlFor="max_da">Maximum DA *</Label>
              <Input
                id="max_da"
                name="max_da"
                type="number"
                min="1"
                max="100"
                value={formData.max_da}
                onChange={(e) => handleInputChange("max_da", Number.parseInt(e.target.value) || 0)}
                placeholder="40"
                required
                disabled={isSubmitting}
              />
              {errors.max_da && <p className="text-sm text-destructive mt-1">{errors.max_da}</p>}
            </div>

            <div>
              <Label htmlFor="max_dr">Maximum DR *</Label>
              <Input
                id="max_dr"
                name="max_dr"
                type="number"
                min="1"
                max="100"
                value={formData.max_dr}
                onChange={(e) => handleInputChange("max_dr", Number.parseInt(e.target.value) || 0)}
                placeholder="40"
                required
                disabled={isSubmitting}
              />
              {errors.max_dr && <p className="text-sm text-destructive mt-1">{errors.max_dr}</p>}
            </div>

            <div>
              <Label htmlFor="min_spam_score">Minimum Spam Score *</Label>
              <Input
                id="min_spam_score"
                name="min_spam_score"
                type="number"
                min="0"
                max="100"
                value={formData.min_spam_score}
                onChange={(e) => handleInputChange("min_spam_score", Number.parseInt(e.target.value) || 0)}
                placeholder="3"
                required
                disabled={isSubmitting}
              />
              {errors.min_spam_score && <p className="text-sm text-destructive mt-1">{errors.min_spam_score}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="keywords">Keywords (optional)</Label>
              <Input
                id="keywords"
                name="keywords"
                type="text"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="Enter relevant keywords"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", Number.parseInt(e.target.value) || 0)}
                placeholder="50"
                required
                disabled={isSubmitting}
              />
              {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? "Searching..." : "Search"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
