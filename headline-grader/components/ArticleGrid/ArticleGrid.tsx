import React from "react"
import { ArticleCard } from "@/components/ArticleCard"
import type { NewsArticle } from "@/lib/newsApi"

export const ArticleGrid = ({ articles }: { articles: NewsArticle[] }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="w-full p-12 brutalist-border flex flex-col items-center justify-center text-center">
        <h3 className="font-sans text-2xl uppercase font-bold mb-2">No Articles Found</h3>
        <p className="font-mono text-ink/70">Try adjusting your search query or category filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
      {articles.map((article, idx) => (
        <ArticleCard key={article.url + idx} article={article} />
      ))}
    </div>
  )
}
