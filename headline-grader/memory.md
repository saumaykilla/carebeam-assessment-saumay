# Project Memory

## Last Updated
2026-06-19T19:11:00Z

## Project Overview
News Headline Grader: A web application that fetches top headlines using `news-api.org` and evaluates them using a hybrid grading engine (rule-based signals + Google Gemini LLM) to score political bias, clickbait, and emotional manipulation. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS. The design follows an "Editorial Brutalism" aesthetic.

## Architecture Decisions
- Architecture: Next.js App Router with Server Actions to securely execute Gemini and News API requests.
- Data Storage: On-the-fly calculation. No database.
- LLM Provider: Google Gemini.
- Styling: Tailwind CSS configured for Editorial Brutalism (sharp corners, no shadows, off-white background #f4f4f0, black text #111111, neon orange accent #ff4500). Fonts: Oswald (Headings) and JetBrains Mono (Data).
- Routing: Homepage displays top headlines with category/country filters. Searching redirects to a separate Search Results page without filters.

## Component Registry
| Component | Layer | Path | Purpose |
| --- | --- | --- | --- |
| DashboardPage | Page | app/page.tsx | Displays top headlines with category filters |
| SearchResultsPage | Page | app/search/page.tsx | Displays articles matching a user's search query |
| SearchBar | Feature | components/SearchBar/ | Input field to trigger search redirect |
| CategoryFilter | UI | components/ui/CategoryFilter/ | Buttons to filter top headlines by category |
| ArticleGrid | Feature | components/ArticleGrid/ | Grid layout to render multiple ArticleCards |
| ArticleCard | Feature | components/ArticleCard/ | Displays headline, source, and grade CTA |
| GradeResults | UI | components/ui/GradeResults/ | Displays Bias, Clickbait, Manipulation progress bars |
| Button | Atom | components/atoms/Button.tsx | Primary action trigger |

## Hooks & Utils Registry
| Name | Type | Path | Job |
| --- | --- | --- | --- |
| gradeHeadline | Action | lib/actions/gradeHeadline.ts | Server action to execute rule-based and LLM grading |

## In-Progress Work
- Phase 1: Setup & Foundation (Next.js App Router initialized)

## Known Issues & TODOs
- Needs environment variables configured for Gemini and News API.
- Tailwind config needs to be updated with Editorial Brutalism fonts and colors.

## Recent Operations Log
| Timestamp | File | Change |
| --- | --- | --- |
| 2026-06-19T19:11:00Z | memory.md | Created initial project memory file |
