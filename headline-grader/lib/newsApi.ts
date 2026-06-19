export interface NewsArticle {
  title: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  description?: string;
  urlToImage?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  code?: string;
  message?: string;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export async function getTopHeadlines(country: string = "us", category: string = "general"): Promise<NewsApiResponse> {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not defined in environment variables.");
  }
  
  const url = new URL(`${BASE_URL}/top-headlines`);
  url.searchParams.append("country", country);
  if (category && category !== "general") {
    url.searchParams.append("category", category);
  }
  url.searchParams.append("apiKey", NEWS_API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Cache for 1 hour
  const data = await res.json();
  
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch top headlines");
  }
  
  return data;
}

export async function searchArticles(query: string): Promise<NewsApiResponse> {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not defined in environment variables.");
  }
  
  const url = new URL(`${BASE_URL}/everything`);
  url.searchParams.append("q", query);
  url.searchParams.append("sortBy", "publishedAt");
  url.searchParams.append("language", "en");
  url.searchParams.append("apiKey", NEWS_API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); 
  const data = await res.json();
  
  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch articles");
  }
  
  return data;
}
