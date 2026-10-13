import { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PreferencesProvider } from './lib/preferences'
import { ArticlePage } from './pages/ArticlePage'
import { AdminPage } from './pages/admin/AdminPage'
import { PageEditorPage } from './pages/admin/PageEditorPage'
import { PostEditorPage } from './pages/admin/PostEditorPage'
import { AskBoardPage } from './pages/AskBoardPage'
import { FeedbackPage } from './pages/FeedbackPage'
import { ChatListPage } from './pages/chat/ChatListPage'
import { ChatThreadPage } from './pages/chat/ChatThreadPage'
import { NewChatPage } from './pages/chat/NewChatPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { ComposePage } from './pages/ComposePage'
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
import { OrgChartPage } from './pages/OrgChartPage'
import { PeoplePage } from './pages/PeoplePage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegionPage } from './pages/RegionPage'
import { SearchPage } from './pages/SearchPage'
import { AgendaPage } from './pages/AgendaPage'
import { ToolPlaceholderPage } from './pages/ToolPlaceholderPage'
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
        <Route path="region" element={<RegionPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="people/:userId" element={<ProfilePage />} />
        <Route path="people/:userId/edit" element={<ProfileEditPage />} />
        <Route path="profile" element={<ProfilePage own />} />
        <Route path="org" element={<OrgChartPage />} />
        <Route path="chat" element={<ChatListPage />} />
        <Route path="chat/new" element={<NewChatPage />} />
        <Route path="chat/:conversationId" element={<ChatThreadPage />} />
        <Route path="ask" element={<AskBoardPage />} />
        <Route path="general" element={<GeneralPage />} />
        <Route path="pages/:slug" element={<ContentPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="documents/:documentId" element={<DocumentPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="tools/:toolId" element={<ToolPlaceholderPage />} />
        <Route path="beheer" element={<AdminPage />} />
        <Route path="beheer/pages/:pageId" element={<PageEditorPage />} />
        <Route path="beheer/posts/:postId" element={<PostEditorPage />} />
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
