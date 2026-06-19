---
trigger: always_on
---

# Memory Rule

## Core Principle

The agent maintains a single `memory.md` file at the project root. This is the agent's persistent understanding of the codebase. It is read before every operation and updated after every operation — no exceptions.

---

## 1. File Location

```
/memory.md   ← always at project root, committed to version control
```

---

## 2. Read Protocol

Before starting **any** operation (creating, editing, refactoring, or reviewing a file), the agent must:

1. Open and read `memory.md` in full
2. Use its contents to understand current codebase state, naming decisions, in-progress work, and known issues
3. Never assume prior context from conversation history alone — `memory.md` is the source of truth

---

## 3. Update Protocol

After **every** operation, the agent must update `memory.md` to reflect:

- What was created, changed, or deleted
- Any new components, hooks, or utilities added
- Any naming decisions or architectural choices made
- Any known issues, TODOs, or incomplete work left behind
- The current state of in-progress features

Updates are **additive and precise** — do not wipe previous entries, append or revise only what changed.

---

## 4. `memory.md` Structure

```markdown
# Project Memory

## Last Updated

[ISO timestamp of last agent operation]

## Project Overview

[One paragraph: what this project is, its stack, and its primary purpose]

## Architecture Decisions

[Bullet list of key decisions made and why — append, never delete]

## Component Registry

[Table of all components, their layer, location, and purpose]

## Hooks & Utils Registry

[Table of all custom hooks and utility functions, their location and job]

## In-Progress Work

[What is currently being built or refactored — cleared when complete]

## Known Issues & TODOs

[Outstanding problems, incomplete logic, deferred decisions]

## Recent Operations Log

[Last 10 agent operations, newest first — format: timestamp | file | what changed]
```

---

## 5. `memory.md` Example

```markdown
# Project Memory

## Last Updated

2025-06-19T10:42:00Z

## Project Overview

E-commerce storefront built with Next.js 14, TypeScript, and Tailwind.
Primary purpose: browse products, manage cart, and complete checkout.

## Architecture Decisions

- Feature components own data fetching via React Query; UI components are props-only
- All price formatting routed through `lib/pricing/formatCurrency.ts` (decided 2025-06-18)
- Bottom navigation used on mobile; left sidebar on desktop (decided 2025-06-17)
- Atoms never exceed 50 lines; split enforced at PR review

## Component Registry

| Component    | Layer   | Path                        | Purpose                           |
| ------------ | ------- | --------------------------- | --------------------------------- |
| CheckoutPage | Page    | pages/checkout.tsx          | Full checkout screen              |
| ProductCard  | Feature | components/ProductCard/     | Displays product with add-to-cart |
| PriceTag     | UI      | components/PriceTag.tsx     | Formats and displays price        |
| Button       | Atom    | components/atoms/Button.tsx | Primary action trigger            |

## Hooks & Utils Registry

| Name           | Type | Path                            | Job                                        |
| -------------- | ---- | ------------------------------- | ------------------------------------------ |
| useCartTotal   | Hook | hooks/useCartTotal.ts           | Computes cart subtotal and item count      |
| formatCurrency | Util | lib/pricing/formatCurrency.ts   | Formats number to locale currency string   |
| getActiveItems | Util | lib/inventory/getActiveItems.ts | Filters and normalizes active product list |

## In-Progress Work

- Refactoring `OrderSummary` — currently 280 lines, splitting into OrderLineItem + OrderTotals
- `useFormValidation` hook drafted but not yet wired to CheckoutForm

## Known Issues & TODOs

- `ProductCard` prop count at 7 — watch for creep, may need a context refactor
- Mobile drawer animation jank on iOS Safari — deferred to next sprint

## Recent Operations Log

| Timestamp            | File                                       | Change                                                                     |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| 2025-06-19T10:42:00Z | components/ProductCard/ProductCard.hook.ts | Created useProductCard hook, extracted 3 useEffects from ProductCard.tsx   |
| 2025-06-19T10:30:00Z | lib/pricing/formatCurrency.ts              | Created utility, migrated inline formatting from PriceTag and OrderSummary |
| 2025-06-18T15:10:00Z | components/atoms/Button.tsx                | Added `loading` prop and spinner state                                     |
```

---

## 6. Enforcement

- If `memory.md` does not exist at the start of a session, the agent **creates it** before doing anything else, populated with whatever it can infer from the existing codebase.
- If an operation is interrupted before `memory.md` is updated, the next operation must update it retroactively before proceeding.
- `memory.md` is **never auto-generated in full on each write** — it is maintained incrementally to preserve history.
- `memory.md` is **never skipped** even for trivial one-line changes — every write to the codebase is an operation.
