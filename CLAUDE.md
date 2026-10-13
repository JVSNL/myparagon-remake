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
- Brand blue `#134D71` for headings, navigation and primary buttons. For colour, use the
  categorical palette tokens (`bg-c-<name>-soft`, `text-c-<name>-text`, `bg-c-<name>`; names: navy,
  royal, sky, orange, sienna, sage, berry) via `src/lib/colors.ts` — they are AA-checked in both
  themes. Channels and navigation items each have their own colour.
- Content stays far from the original app: Nexora is a fictional e-bike company (NL/BE/DK/ES)
  and posts are light, everyday topics.
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
- Posts and comments carry their `lang`; show them through `usePostContent` / `useTranslated` so readers
  get stored or machine translations (`src/lib/translate.ts`). New seed posts/comments need EN and DE
  versions in `src/data/seed/translations.ts` (a test checks this).
- Built-but-parked features are switched off in `src/lib/features.ts` (currently the launchpad); keep
  their code and tests working so they can be switched on again.
- Deleting posts or pages moves them to `state.trash`; restore goes through `restoreFromTrash`. Role changes
  and the launchpad are admin-only (`isAdmin`), and admins cannot change their own role.
- Show news through `visiblePosts` / `canSeePost` (audience by region, scheduled posts have a future
  `createdAt`); never list `state.posts` directly in employee-facing screens.
- Poll votes, form entries and event sign-ups are keyed by block id (`findBlock` in the reducer). Poll results
  are only shown as anonymous percentages; form entries are visible to editors with the sender's name.
- Names and avatars of people link to their profile (`PersonLink` / `AvatarLink`).
- Page headers take the colour of their section (`sectionColor` in `navItems.ts`); content on deep
  brand colours uses the `.on-brand` token scope.
