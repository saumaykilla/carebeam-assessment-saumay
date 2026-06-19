---
trigger: always_on
---

# Codebase Writing Rule

## Core Principle

Every component must do exactly one thing. If you can describe a component with the word "and", it needs to be split. Small, focused, reusable — always.

---

## 1. When to Split a Component

Split immediately when a component:

- Exceeds **150 lines** (including markup, logic, and styles)
- Contains **more than one distinct visual region** (e.g. a header and a list and a footer)
- Holds **local state unrelated to its primary job**
- Repeats a JSX pattern **more than once**
- Has **props that only apply to part of its output**

---

## 2. Decomposition Hierarchy

Structure components in four layers:

```
Page / Screen
  └── Feature Components      (domain-aware, own their data fetching or state)
        └── UI Components     (dumb, props-only, no side effects)
              └── Atoms        (buttons, inputs, icons, badges — never decompose further)
```

Rules per layer:

| Layer         | Owns State? | Fetches Data? | Max Props | Max Lines |
| ------------- | ----------- | ------------- | --------- | --------- |
| Page / Screen | Yes         | Yes           | —         | —         |
| Feature       | Yes         | Yes           | 8         | 200       |
| UI Component  | No          | No            | 6         | 100       |
| Atom          | No          | No            | 4         | 50        |

---

## 3. Extracting Reusable Functions

Extract a function (outside the component) when logic:

- Is **pure** — same input always gives same output
- Is used in **more than one place**, or is likely to be
- Makes the component body **hard to read at a glance**

```ts
// ❌ Inline — hard to test, hard to reuse
const formatted = items
  .filter((i) => i.active)
  .map((i) => ({ ...i, label: i.name.trim().toUpperCase() }));

// ✅ Extracted — named, testable, portable
function getActiveItems(items) {
  return items
    .filter((i) => i.active)
    .map((i) => ({ ...i, label: i.name.trim().toUpperCase() }));
}
```

Place extracted functions in:

- `utils/` — generic, domain-agnostic helpers
- `lib/[domain]/` — domain-specific logic (e.g. `lib/pricing/calculateDiscount.ts`)
- Co-located `[Component].utils.ts` — helpers used only by one component

---

## 4. Custom Hooks

Extract a custom hook when a component:

- Calls `useEffect` with more than 5 lines of logic
- Combines 3 or more `useState` / `useReducer` calls around one concern
- Duplicates stateful logic that appears in another component

Name hooks `use[Concern]` — e.g. `useCartTotal`, `useInfiniteScroll`, `useFormValidation`.

Hooks live in `hooks/` at project root or co-located as `[Component].hook.ts`.

---

## 5. Naming Conventions

| Type              | Convention               | Example                |
| ----------------- | ------------------------ | ---------------------- |
| Page              | `[Name]Page`             | `CheckoutPage`         |
| Feature Component | PascalCase               | `ProductCard`          |
| UI Component      | PascalCase               | `PriceTag`             |
| Atom              | Single or adjective+noun | `Button`, `InputField` |
| Hook              | `use[Concern]`           | `useCartTotal`         |
| Util function     | `[verb][Noun]` camelCase | `formatCurrency`       |

---

## 6. Shared UI Component Library

All reusable UI components (cards, buttons, inputs, badges, modals, etc.) live in a single shared library folder — **never inside a feature folder**.

```
components/
  ui/                          ← shared UI library — used across the entire codebase
    Button/
      index.ts
      Button.tsx
      Button.types.ts
      Button.test.tsx
    Card/
      index.ts
      Card.tsx
      Card.types.ts
      Card.test.tsx
    Input/
      index.ts
      Input.tsx
      Input.types.ts
      Input.test.tsx
    Badge/
    Modal/
    Avatar/
    Spinner/
    ...
  atoms/                       ← smallest indivisible elements (single files)
    Icon.tsx
    Divider.tsx
    Label.tsx
  [FeatureName]/               ← feature-specific components (import from ui/, never duplicate it)
    ProductCard/
    CheckoutForm/
```

### Rules for `components/ui/`

- **Zero domain knowledge.** UI components must not import from `lib/`, `store/`, or any feature folder. They receive everything through props.
- **No data fetching.** Never call an API, read from a store, or use `useEffect` for data inside a UI component.
- **Composable by default.** Prefer `children` and render props over rigid internal structure so consumers can adapt layout without forking the component.
- **Variant-driven, not duplicated.** Use a `variant` prop (e.g. `variant="primary" | "secondary" | "ghost"`) instead of creating `PrimaryButton`, `SecondaryButton`, `GhostButton` as separate files.
- **Never copy a UI component into a feature folder.** If a feature needs a slightly different card, pass props — if props aren't enough, extend the shared component with a new variant, don't clone it.

### Variant prop pattern

```ts
// ✅ One component, many appearances
<Button variant="primary" size="sm" loading={isSubmitting}>
  Submit
</Button>

<Card variant="outlined" padding="lg">
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
</Card>

// ❌ Never do this — feature-specific clones
components/checkout/CheckoutButton.tsx   // just use Button variant="primary"
components/product/ProductCardOutlined.tsx // just use Card variant="outlined"
```

### Compound component pattern (for complex UI)

Use compound components for UI pieces with multiple sub-regions (Card, Modal, Form):

```ts
// Card.tsx exports a compound component
export const Card = ({ children, variant = 'default', ...props }) => (...)
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

// Consumer
<Card variant="outlined">
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

---

## 7. File Structure per Component

Every non-atom component ships as a folder:

```
components/
  ui/
    Card/
      index.ts                ← re-exports the default
      Card.tsx                ← component
      Card.types.ts           ← TypeScript interfaces / types
      Card.test.tsx           ← unit tests
  [Feature]/
    ProductCard/
      index.ts
      ProductCard.tsx         ← imports Card, Button etc. from components/ui/
      ProductCard.hook.ts     ← custom hook (if any)
      ProductCard.utils.ts    ← helpers (if any)
      ProductCard.types.ts    ← TypeScript interfaces / types
      ProductCard.test.tsx    ← unit tests
```

Atoms are single files: `components/atoms/Icon.tsx`.

---

## 8. Props Discipline

- Prefer **explicit props** over spreading objects (`{...props}`) into components
- Never pass a prop down more than **two levels** — use context or composition instead
- If a prop is only used to be forwarded to a child, the abstraction boundary is in the wrong place
- Boolean props default to `false` — never require a consumer to pass `false` explicitly

---

## 9. Reusability Checklist

Before committing any new component or function, confirm:

- [ ] Does it do exactly one thing?
- [ ] Is it under the line limit for its layer?
- [ ] Are all extractable logic pieces in hooks or utils?
- [ ] Is the naming consistent with conventions in Section 5?
- [ ] Is it in the correct folder with the correct file structure?
- [ ] Could it be used somewhere else in the codebase without modification?
- [ ] If it is a UI element (card, button, input, badge, modal) — is it in `components/ui/` and not inside a feature folder?
- [ ] If a variant was needed — was a `variant` prop added to the existing shared component instead of creating a new file?
- [ ] Does the component have zero domain knowledge (no store imports, no API calls, no feature-specific logic)?
