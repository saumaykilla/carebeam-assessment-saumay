"use client"

import React, { useState } from "react"
import { GradeResults } from "@/components/ui/GradeResults"
import { gradeHeadline, type LLMScores } from "@/lib/actions/gradeHeadline"
import type { NewsArticle } from "@/lib/newsApi"
import { cn } from "@/lib/utils"

export const ArticleCard = ({ article }: { article: NewsArticle }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<LLMScores | null>(null)

  const handleGrade = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await gradeHeadline(article.title)
      setAnalysis(result)
    } catch (err: any) {
      setError(err.message || "Failed to grade headline")
    } finally {
      setLoading(false)
    }
  }

  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  const isGraded = analysis !== null

  return (
    <article className="flex flex-col pb-12 border-b border-ink/20">
      <div className="flex-1 mb-6">
        <h2 className="font-sans font-bold text-4xl leading-tight tracking-tight mb-4 text-ink">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            {article.title}
          </a>
        </h2>
        
        <div className="font-mono text-xs uppercase tracking-widest text-ink/60 mt-4 mb-6">
          SOURCE: {article.source.name} | DATE: {date}
        </div>
      </div>

      {!isGraded ? (
        <>
          {error && <div className="text-accent font-mono mb-4 text-sm">{error}</div>}
          <button 
            className={cn(
              "w-full h-12 font-sans font-bold uppercase text-lg transition-colors",
              loading ? "bg-accent text-background cursor-not-allowed" : "bg-ink text-background hover:bg-ink/80"
            )}
            onClick={handleGrade} 
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Grade Headline"}
          </button>
        </>
      ) : (
        <GradeResults analysis={analysis} />
      )}
    </article>
  )
}
