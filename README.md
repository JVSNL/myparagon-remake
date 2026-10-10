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
npm run build:demo  # single self-contained HTML file in dist-demo/ to share as a clickable demo
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

## Features

- **News**: feed, articles with one emoji reaction per person, threaded comments, bookmarks; editors post with their own photo
- **Content pages** built from blocks, stories per department, locations, FAQ and an in-app PDF viewer
- **People**: Who is Who with search and filters, profiles (edit your own), interactive org chart, regions
- **Chat** (1-on-1 and groups) and **Ask the Board** (public or board-only questions)
- **Management** (`/beheer`): desktop block editor with live preview, NL/EN/DE versions, drafts and version history; post translations; feedback inbox
- **Search** across news, pages, colleagues, locations and FAQ
- Notifications centre with per-type settings, dark mode, NL/EN/DE interface, installable as an app (PWA)

Simulated colleagues like and reply to your comments, answer in chats and the board answers questions,
so the demo feels alive without a backend.

## Roadmap

All six phases are built, one pull request each:

1. Foundation — navigation, design system, demo login, welcome slides, news, reactions, comments, notifications
2. Content pages, stories, locations, FAQ, PDF viewer
3. Who is Who, profiles, org chart, regions
4. Chat and Ask the Board
5. Desktop editor, multilingual content, settings and feedback
6. Global search and polish

Possible next steps: a real backend (the store's actions map one-to-one to API calls), push notifications,
hosting on Netlify with previews per pull request.
