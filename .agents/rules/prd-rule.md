---
trigger: always_on
---

# PRD Rule

## Core Principle

Every feature begins with a written plan. Before a single line of code is written, a PRD (Product Requirements Document) must exist as a markdown file in the `/prd` folder at the project root. Planning is not optional — it is the first step of every feature.

---

## 1. File Location

```
/prd/                          ← always at project root, committed to version control
  [feature-name].md            ← one file per feature
  [feature-name]-v2.md         ← revised plan if scope changes significantly
```

Naming convention: `kebab-case`, descriptive, no dates in the filename.

```
/prd/
  user-authentication.md
  product-search-filters.md
  checkout-flow.md
  notification-preferences.md
```

---

## 2. When to Create a PRD

A PRD must be created before starting work on:

- Any new feature or user-facing flow
- Any refactor that changes component boundaries or data contracts
- Any integration with a new API, service, or third-party tool
- Any work that touches more than **3 files** or is estimated to take more than **2 hours**

For small bug fixes or one-line changes, a PRD is not required.

---

## 3. PRD Structure

Every PRD must follow this structure exactly:

```markdown
# [Feature Name]

## Status

[Draft | In Review | Approved | In Progress | Complete | Deprecated]

## Overview

[2–4 sentences. What is this feature, why does it exist, and what problem does it solve?]

## Goals

[Bullet list of what success looks like — measurable where possible]

## Non-Goals

[Bullet list of what this feature explicitly does NOT do — prevents scope creep]

## User Stories

[As a [user type], I want to [action] so that [outcome]]

## Functional Requirements

[Numbered list of specific behaviors the feature must have]

## UI & UX Requirements

[Describe screens, flows, states — reference wireframes or designs if available]

## Component Plan

[List of components to create, modify, or delete — and which layer they belong to]

## Data & API Requirements

[Endpoints consumed, request/response shapes, state management needs]

## Edge Cases & Error States

[What can go wrong, and how should each case be handled]

## Open Questions

[Unresolved decisions that must be answered before or during implementation]

## Out of Scope (Future Considerations)

[Things that came up but are deliberately deferred to a later iteration]
```

---

## 4. PRD Example

```markdown
# Product Search Filters

## Status

Approved

## Overview

Users currently have no way to narrow search results by category, price range,
or availability. This feature adds a filter panel to the search results page
so users can find relevant products faster.

## Goals

- Users can filter by category, price range, and in-stock status
- Filter state persists across page refreshes via URL query params
- Applying filters updates results without a full page reload

## Non-Goals

- Saved filter presets (deferred to v2)
- Sorting (separate feature, separate PRD)
- Filters on the homepage or category pages

## User Stories

- As a shopper, I want to filter by price range so I only see products I can afford
- As a shopper, I want to filter by category so I don't scroll through irrelevant items
- As a shopper, I want my filters to persist if I refresh the page

## Functional Requirements

1. Filter panel renders on the left on desktop, as a bottom drawer on mobile
2. Price filter uses a dual-handle range slider with min/max inputs
3. Category filter renders as a checkbox list, multi-select
4. In-stock toggle hides out-of-stock items when enabled
5. Active filters are reflected in the URL as query params (`?category=shoes&minPrice=20`)
6. Clearing all filters resets URL and results to unfiltered state
7. Filter changes trigger a debounced API call (300ms), not immediate

## UI & UX Requirements

- Desktop: persistent left sidebar, 240px wide, sticky on scroll
- Mobile: "Filters" button in search toolbar opens a full-height bottom drawer
- Active filter count shown on the "Filters" button badge
- Each active filter shows as a dismissible chip above results
- Empty state shown if filters return zero results with a "Clear filters" CTA

## Component Plan

| Component         | Action | Layer   | Path                            |
| ----------------- | ------ | ------- | ------------------------------- |
| FilterPanel       | Create | Feature | components/FilterPanel/         |
| PriceRangeSlider  | Create | UI      | components/ui/PriceRangeSlider/ |
| FilterChip        | Create | UI      | components/ui/FilterChip/       |
| CheckboxGroup     | Create | UI      | components/ui/CheckboxGroup/    |
| useSearchFilters  | Create | Hook    | hooks/useSearchFilters.ts       |
| SearchResultsPage | Modify | Page    | pages/search.tsx                |

## Data & API Requirements

- `GET /api/products?category=&minPrice=&maxPrice=&inStock=` — existing endpoint, already supports filter params
- Filter state managed in `useSearchFilters` hook, synced to URL via `next/router`
- No new backend work required

## Edge Cases & Error States

- API returns error → show inline error banner, keep current results visible
- All filters active but zero results → show empty state, not an error
- URL params are malformed (e.g. `minPrice=abc`) → silently ignore and reset to defaults
- User applies filters then navigates back → filters restored from URL

## Open Questions

- Should category filter show product counts next to each option? (needs design input)
- Mobile: should the drawer auto-close after applying filters or require a manual close?

## Out of Scope (Future Considerations)

- Saved filter presets
- Sort by relevance / price / rating
- Filters on category landing pages
```

---

## 5. Status Lifecycle

Every PRD moves through these statuses in order:

```
Draft → In Review → Approved → In Progress → Complete
                                           ↘ Deprecated (if abandoned)
```

- **Draft** — being written, not ready for implementation
- **In Review** — complete enough to share, awaiting feedback
- **Approved** — sign-off received, implementation can begin
- **In Progress** — actively being built; update Component Plan as work progresses
- **Complete** — shipped; do not delete the file, it becomes a record
- **Deprecated** — abandoned or superseded; note the reason and link to replacement if any

The agent must update the `## Status` field in the PRD whenever the status changes.

---

## 6. Agent Workflow

```
1. Receive feature request
2. Create /prd/[feature-name].md with Status: Draft
3. Fill all sections — leave none blank (use "TBD" only for Open Questions)
4. Set Status: Approved before writing any code
5. Update Component Plan in the PRD as implementation progresses
6. Set Status: Complete once the feature is shipped
7. Update memory.md to log the PRD creation and status changes
```

The agent must never begin implementation while a PRD is in **Draft** or **In Review** status.

---

## 7. Enforcement

- If a feature is requested without a PRD, the agent creates the PRD first and confirms before writing code.
- PRD files are never deleted — deprecated features get `Status: Deprecated` and a deprecation note.
- If scope changes significantly mid-implementation, the PRD is updated (or a `-v2.md` is created) before work continues.
- Every PRD is cross-referenced in `memory.md` under the relevant feature entry.
