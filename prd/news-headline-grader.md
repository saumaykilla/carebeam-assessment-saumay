# News Headline Grader

## Status

Approved

## Overview

A web application that fetches top headlines (and allows searching) using `news-api.org`. It features a hybrid grading engine (rule-based signals + Google Gemini LLM) to score headlines across three metrics: political bias, clickbait, and emotional manipulation. It provides an analytical lens on the news, helping to evaluate the objectivity and framing of headlines.

## Goals

- Users can view top current headlines on load.
- Users can search for specific topics to fetch relevant articles.
- Users can trigger a hybrid AI grading system (Rule-based + Gemini LLM) on any article.
- The grading system outputs a 0-10 score and a 1-sentence reasoning for Bias, Clickbait, and Manipulation.

## Non-Goals

- No database storage or persistent history; grading is strictly calculated on-the-fly and lost when the session ends.
- No user authentication system.
- No sorting or complex filtering (other than basic search).

## User Stories

- As a researcher, I want to see the latest top news headlines so I can analyze current reporting trends.
- As a researcher, I want to search for specific topics so I can grade headlines about a particular event.
- As a researcher, I want to click a button to instantly grade an article's headline for bias and clickbait so I can evaluate the source's framing.

## Functional Requirements

1. Fetch top headlines from news-api.org on initial load, the default conutry is united states and the application support uk and india aditionally. (You can add more countries later.)
2. Search bar to fetch articles matching a query from news-api.org.
3. "Grade Headline" button on each article.
4. Server Action to execute rule-based regex/dictionary checks on the headline.
5. Server Action to execute Google Gemini prompt for AI grading.
6. Combine rule-based and AI scores into final 0-10 metrics.
7. Return and display grades and reasoning on the frontend.
8. Handle News API rate limits with a user-friendly error message.
9. Handle Gemini API timeouts/errors with a fallback message.
10. we have category filter to filter the headlines on the homepage. (general, business, entertainment, health, science, sports, technology)
11. The filters are only on the top headlines and not when search query is returning results.
12. Searching would redirect the user to the search results page.

## UI & UX Requirements

- **Search Header**: A clean, prominent search input at the top of the page.
- **Article Card**: Each news item will be displayed as a card showing the headline, source, published date, and a "Grade Headline" button.
- **Loading State**: Clicking "Grade" changes the button state to a loading spinner ("AI is analyzing...").
- **Results View**: Post-grading, the card expands to show progress bars/meters (0-10 scale) for Bias, Clickbait, and Manipulation, alongside the short 1-sentence reasoning.
- **Empty States**: Show "No articles found" if search yields nothing.
- _Note: UI generation will be strictly handled via Stitch-MCP per project protocol._

## Component Plan

| Component     | Action | Layer       | Path                         |
| ------------- | ------ | ----------- | ---------------------------- |
| DashboardPage | Create | Page        | app/page.tsx                 |
| SearchBar     | Create | Feature     | components/SearchBar/        |
| ArticleGrid   | Create | Feature     | components/ArticleGrid/      |
| ArticleCard   | Create | Feature     | components/ArticleCard/      |
| GradeResults  | Create | UI          | components/ui/GradeResults/  |
| Button        | Create | Atom        | components/atoms/Button.tsx  |
| useNews       | Create | Hook        | hooks/useNews.ts             |
| gradeHeadline | Create | Util/Action | lib/actions/gradeHeadline.ts |

## Data & API Requirements

- `news-api.org` integration (Top Headlines & Everything endpoints).
- `Google Gemini` API integration via `@google/genai` or standard fetch.
- All API calls orchestrated securely from Next.js backend (Server Components/Actions) to protect API keys.

## Edge Cases & Error States

- **API Rate Limits**: The free tier of `news-api.org` has strict rate limits. Display friendly warning.
- **LLM Failures**: If Gemini API times out or returns malformed data, catch it gracefully and display a fallback message like "AI grading temporarily unavailable".
- **Empty Results**: Show a clear "No articles found" empty state.

## Open Questions

- None.

## Out of Scope (Future Considerations)

- History and database storage of previously graded articles.
- User accounts.

## Decision Log

- **Architecture**: Chosen Next.js App Router with Server Actions. (Alternatives: Pages router API routes, or Client-heavy proxy). Chosen for modern ecosystem alignment and simple frontend-backend boundaries.
- **Data Storage**: Chosen strictly on-the-fly calculation. No database. Chosen to reduce scope and complexity per user request.
- **LLM Provider**: Chosen Google Gemini.
