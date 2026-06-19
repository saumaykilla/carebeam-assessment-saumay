import { getTopHeadlines } from "@/lib/newsApi"
import { CategoryFilter } from "@/components/ui/CategoryFilter"
import { ArticleGrid } from "@/components/ArticleGrid"
import { SearchBar } from "@/components/SearchBar"
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
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-background border-b border-ink/20 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <Link href="/" className="font-sans text-3xl font-bold uppercase tracking-tight text-accent whitespace-nowrap">
          Headline Grader
        </Link>
        <div className="flex-1 w-full max-w-2xl mx-4">
          <SearchBar />
        </div>
      </header>

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
      
      <footer className="border-t border-ink/20 py-8 text-center font-sans uppercase text-ink/50 text-sm flex justify-center gap-8">
        <span>Headline Grader 2026</span>
        <Link href="#" className="hover:text-ink">Privacy</Link>
        <Link href="#" className="hover:text-ink">API Docs</Link>
      </footer>
    </div>
  );
}
