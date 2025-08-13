"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Copy } from "lucide-react"
import type { SearchResult } from "@/app/page"

interface ResultsTableProps {
  results: SearchResult[]
  onNewSearch: () => void
}

export function ResultsTable({ results, onNewSearch }: ResultsTableProps) {
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set())

  const copyToClipboard = async (url: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
      }

      setCopiedUrls((prev) => new Set(prev).add(url))
      setTimeout(() => {
        setCopiedUrls((prev) => {
          const newSet = new Set(prev)
          newSet.delete(url)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Search Results</h2>
          <p className="text-muted-foreground">Showing {results.length} results</p>
        </div>
        <Button onClick={onNewSearch} variant="outline">
          New Search
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Match</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-24">Copy</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Traffic</TableHead>
                  <TableHead className="text-right">DA</TableHead>
                  <TableHead className="text-right">DR</TableHead>
                  <TableHead className="text-right">Spam Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell>
                      {result.match && (
                        <div className="flex justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-xs">
                      <div className="truncate" title={result.url}>
                        {result.url}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.url)} className="h-8">
                        {copiedUrls.has(result.url) ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy URL
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{result.country}</TableCell>
                    <TableCell className="text-right">{formatNumber(result.traffic)}</TableCell>
                    <TableCell className="text-right">{result.da}</TableCell>
                    <TableCell className="text-right">{result.dr}</TableCell>
                    <TableCell className="text-right">{result.spam_score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm break-all">{result.url}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {result.match && <Check className="h-5 w-5 text-green-600" />}
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.url)}>
                    {copiedUrls.has(result.url) ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Country:</span>
                  <div className="font-medium">{result.country}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Traffic:</span>
                  <div className="font-medium">{formatNumber(result.traffic)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">DA:</span>
                  <div className="font-medium">{result.da}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">DR:</span>
                  <div className="font-medium">{result.dr}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Spam Score:</span>
                  <div className="font-medium">{result.spam_score}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
