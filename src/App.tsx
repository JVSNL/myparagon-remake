import { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PreferencesProvider } from './lib/preferences'
import { ArticlePage } from './pages/ArticlePage'
import { BookmarksPage } from './pages/BookmarksPage'
import { ComposePage } from './pages/ComposePage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ContentPage } from './pages/ContentPage'
import { DocumentPage } from './pages/DocumentPage'
import { GeneralPage } from './pages/GeneralPage'
import { LocationsPage } from './pages/LocationsPage'
import { StoriesPage } from './pages/StoriesPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MenuPage } from './pages/MenuPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { SettingsPage } from './pages/SettingsPage'
import { StoreProvider } from './store/StoreProvider'
import type { AppState } from './store/state'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

// The shareable demo build runs inside a host page that owns the URL, so it keeps routes in memory.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<OnboardingPage />} />
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="news/new" element={<ComposePage />} />
        <Route path="news/:postId" element={<ArticlePage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="region" element={<ComingSoonPage title="region.title" body="region.soon" phase={3} />} />
        <Route path="general" element={<GeneralPage />} />
        <Route path="pages/:slug" element={<ContentPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="documents/:documentId" element={<DocumentPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App({ initialState }: { initialState?: AppState }) {
  return (
    <PreferencesProvider>
      <StoreProvider initialState={initialState}>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </StoreProvider>
    </PreferencesProvider>
  )
}
