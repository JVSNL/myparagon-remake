# myNexora — notes for Claude

Remake of an employee intranet app with **dummy data only**. The fictional company is *Nexora*;
the app is *myNexora*. Never put real names, photos, logos or texts from the original app in this repo.

## Workflow

- The owner works in Dutch. Code, comments, commits and PR descriptions are in **English**.
- New features: first propose a plan without changing code; after approval create a branch,
  build, run the app and share screenshots (mobile 390px and desktop 1440px), then open a PR.
- One PR per roadmap phase (see README). Never push directly to `main`.
- Before pushing: `npm run check` and `npm run build` must pass (CI runs the same).

## Design

- House style lives in `.claude/skills/paragon-presentation-designer/` (colours, Roboto). Use its
  **colours and typography only**; the app uses its own Nexora mark (`src/components/Logo.tsx`),
  never the logo files from the skill.
- Components use the semantic tokens from `src/index.css` (`bg-surface`, `text-heading`,
  `text-primary`, …), never raw hex values, so dark mode keeps working.
- Brand blue `#134D71` for headings, navigation and primary buttons; orange `#E38900` sparingly
  (badges, unread dots), always with dark text (`text-on-accent`).
- WCAG AA: brand grey `#7F7F7F`, royal blue `#238ACB` and orange fail as text colour on white —
  use `text-muted` / `text-primary` instead. Every interactive element needs an accessible name.
- Slightly rounded (12px cards), subtle shadows, lots of white space, subtle motion that respects
  `prefers-reduced-motion`.

## Code

- State: `src/store/reducer.ts` is pure; actions carry their own ids and timestamps. Add a test
  in `reducer.test.ts` for every new action. Permission checks live in `permissions.ts` and are
  enforced in the reducer, not only in the UI.
- Text: every UI string goes through `t()`; add keys to `nl.ts`, `en.ts` and `de.ts`
  (a test checks they stay in sync). UI language follows the browser unless set in Settings.
- Never use `window.alert/confirm/prompt`; use `ConfirmDialog` (they are blocked in the shared demo viewer).
- `npm run build:demo` builds the shareable single-file demo (memory router, everything inlined).
- Search lives in `src/lib/search.ts` (pure, tested). New content types should be added there too.
- Editor actions (pages/posts) require `canEditContent`; drafts never show outside the editor.
- Seed content is Dutch. Keep the seed deterministic (`src/lib/random.ts`).
