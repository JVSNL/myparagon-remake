import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../../store/StoreProvider'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'

/** Layout for every signed-in page; sends visitors to login or the welcome slides first. */
export function AppShell() {
  const { state, me } = useStore()
  const location = useLocation()

  if (!me) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!state.onboarded.includes(me.id)) return <Navigate to="/welcome" replace />

  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-24 lg:pb-12">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
