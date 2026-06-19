import { searchArticles } from "@/lib/newsApi"
import { SearchBar } from "@/components/SearchBar"
import { ArticleGrid } from "@/components/ArticleGrid"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const query = (resolvedParams.q as string) || ""
  
  let articles: any[] = []
  let error: string | null = null

  if (query.trim()) {
    try {
      const data = await searchArticles(query)
      articles = data.articles || []
    } catch (err: any) {
      error = err.message || "Failed to search headlines."
    }
  }

  return (
    <div className="flex flex-col min-h-screen">


      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-sans text-3xl font-bold uppercase">
            {query ? `Search Results for: "${query}"` : "Enter a search query"}
          </h2>
        </div>

        {error ? (
          <div className="p-6 bg-accent text-ink brutalist-border font-mono font-bold uppercase">
            Error: {error}
          </div>
        ) : query ? (
          <ArticleGrid articles={articles} />
        ) : null}
      </main>
    </div>
  )
}
