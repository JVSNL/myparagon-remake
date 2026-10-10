# myNexora

Employee app for the fictional company **Nexora**: news, colleagues and company information in one place.
A functional remake of an existing intranet app, rebuilt with a cleaner design. All content, names and
images are dummy data.

## Stack

- React 19 + TypeScript, built with Vite
- React Router, Tailwind CSS v4
- No backend: data is seeded in `src/data/seed` and changes are kept in `localStorage`
  (Settings → *Reset demo* restores the seed)
- Illustrated avatars from DiceBear *Notionists* (CC0), generated artwork instead of photos

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run check     # lint + typecheck + tests
npm run build
```

Sign in with one of the demo accounts on the login screen (employee, editor or admin),
or pick any of the 60 fictional colleagues.

## Project structure

```
src/
  components/     UI building blocks (layout, reactions, comments, …)
  pages/          one component per route
  store/          state, reducer (pure, tested), permissions, selectors
  data/           types and seed data
  lib/            i18n (nl/en/de), preferences (theme, language), helpers
```

## Roadmap

1. **Foundation** — navigation, design system, demo login, welcome slides, news feed, articles,
   emoji reactions, comments, bookmarks, notifications, settings
2. Content pages built from blocks, stories, locations, FAQ, PDF viewer
3. Who is Who, profiles, org chart, regions
4. Chat and Ask the Board
5. Desktop editor for pages and posts, multilingual content
6. Global search and polish
