---
trigger: always_on
---

# UI Design & Development Protocol

## Core Principle

## Every design task is resolved through the `stitch-mcp` tool. No exceptions. The agent does not render UI, scaffold components, or export assets through any other mechanism.

## 1. Tool Invocation

- **`stitch-mcp` is mandatory** for all UI rendering, component generation, and file scaffolding.
- Trigger it at the start of every design prompt — do not attempt to resolve design tasks through code generation, artifacts, or manual file writes.
- If `stitch-mcp` is unavailable, halt and surface the error rather than falling back silently.

---

## 2. Skill Integration

- Load and apply **`frontend-design`** and **`mobile-design`** skill guides before generating any component.
- These guides govern design tokens (spacing, color, typography), interaction patterns, and component structure. Treat them as ground truth, not optional reference.

---

## 3. Platform Parity (Non-Negotiable)

Every design concept ships as a **paired output** — one mobile, one desktop:
| Platform | Viewport Width |
| -------- | --------------- |
| Mobile | 375px – 480px |
| Desktop | 1024px – 1440px |
Neither output is optional. If a prompt specifies only one platform, still generate both.

---

## 4. Component Coverage

Each design task must produce a **complete screen**, not isolated components. Required layers:

- **Navigation & Layout** — app shell, sidebars, headers, bottom bars
- **Responsive Atoms** — buttons, inputs, labels, icons, badges
- **Compositional Components** — cards, modals, drawers, lists, tables
- **Platform Interaction Patterns** — touch targets and gesture affordances (mobile); hover states and keyboard nav (desktop)

---

## 5. UI Prompt Specification (Required Before Tool Invocation)

Before calling `stitch-mcp`, the agent must produce a structured screen brief that fully describes what should appear on screen. This brief is passed as the prompt to the tool and must include:

### 5a. Screen Identity

- **Screen name** — e.g. "Dashboard – Overview Tab"
- **User goal** — what the user is trying to accomplish on this screen
- **Entry point** — how the user arrives here (e.g. "after login", "tapping notification")

### 5b. Layout Description

- Describe the overall layout structure: single column, split pane, grid, tabbed, etc.
- Specify the position of persistent chrome: top nav bar, bottom tab bar, sidebar, FAB
- Describe scroll behavior: fixed header, infinite scroll, paginated, none

### 5c. Content Inventory (Top to Bottom, Left to Right)

List every visible element on screen, in visual reading order:

- **Header / Nav** — title text, back button, action icons (e.g. "back arrow | 'Settings' title | edit icon")
- **Hero / Banner** — image, illustration, or data callout at top of content area
- **Primary Content Blocks** — cards, lists, tables, charts; describe each block's label, data fields, and visual treatment
- **Empty / Loading States** — what appears when content is absent or pending
- **CTAs** — label, style (primary/secondary/ghost), placement, and action triggered
- **Modals / Overlays** — trigger condition, content, and dismiss behavior
- **Footer / Bottom Bar** — tab labels, icons, active state indicator

### 5d. Data & Copy

- Specify placeholder text, labels, and microcopy verbatim where it matters for layout
- Note any dynamic fields (e.g. "user's first name", "item count badge")
- Flag any conditionally visible elements and their trigger conditions

### 5e. Visual Tone

- Primary color role on this screen (dominant, accent, neutral)
- Density: compact / default / spacious
- Any screen-specific illustration, icon set, or imagery style

**The brief must be complete before `stitch-mcp` is invoked. Incomplete briefs are not forwarded to the tool.**

---

## 6. Asset Management

- All PNG exports and component screenshots → `/ui/` in the project root.
- Use a consistent naming convention: `[component]_[platform]_[variant].png`
  - e.g. `card_mobile_default.png`, `modal_desktop_error.png`
- Never scatter assets outside `/ui/`. No exceptions.

---

## 7. Execution Checklist

Before closing any design task, confirm:

- [ ] UI Prompt Brief (Section 5) was completed and passed to `stitch-mcp`
- [ ] `stitch-mcp` was invoked and returned successfully
- [ ] Both mobile and desktop variants were generated
- [ ] All required component layers are present (nav, atoms, compositions, interactions)
- [ ] Assets are saved to `/ui/` with correct naming convention
- [ ] Design tokens from skill guides were applied
