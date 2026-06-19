"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
]

export const CategoryFilter = () => {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "general"
  const currentCountry = searchParams.get("country") || "us"

  return (
    <div className="flex flex-wrap gap-4 pb-4">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat
        
        // Preserve other search params like 'country'
        const params = new URLSearchParams(searchParams.toString())
        params.set('category', cat)
        
        return (
          <Link
            key={cat}
            href={`/?${params.toString()}`}
            className={cn(
              "px-3 py-1 text-sm font-sans uppercase font-bold transition-colors",
              isActive 
                ? "bg-ink text-background" 
                : "text-ink/60 hover:text-ink"
            )}
          >
            {cat}
          </Link>
        )
      })}
    </div>
  )
}
