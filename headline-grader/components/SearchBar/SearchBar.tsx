"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export const SearchBar = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full border border-ink/20 focus-within:border-accent group">
      <div className="flex items-center px-4 bg-background border-r border-ink/20 group-focus-within:border-accent transition-colors">
        <Search className="w-5 h-5 text-ink/60" />
      </div>
      <input
        type="text"
        placeholder="SEARCH HEADLINES OR TOPICS..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 min-h-[48px] h-12 bg-background px-4 font-sans text-sm uppercase outline-none placeholder:text-ink/40"
      />
      <button 
        type="submit" 
        className="px-6 min-h-[48px] h-12 bg-ink text-background font-sans uppercase font-bold text-sm hover:bg-accent transition-colors border-l border-ink/20 group-focus-within:border-accent"
      >
        Search
      </button>
    </form>
  )
}
