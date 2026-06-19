import { getTopHeadlines } from "@/lib/newsApi"
import { CategoryFilter } from "@/components/ui/CategoryFilter"
import { ArticleGrid } from "@/components/ArticleGrid"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const category = (resolvedParams.category as string) || "general"
  const country = "us" // Hardcoded to USA
  
  let articles: any[] = []
  let error: string | null = null

  try {
    const data = await getTopHeadlines(country, category)
    articles = data.articles || []
  } catch (err: any) {
    error = err.message || "Failed to fetch headlines."
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">


      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 border-b border-ink/20">
          <CategoryFilter />
        </div>

        {error ? (
          <div className="p-6 bg-accent text-background font-mono font-bold uppercase">
            Error: {error}
          </div>
        ) : (
          <ArticleGrid articles={articles} />
        )}
      </main>
    </div>
  );
}
