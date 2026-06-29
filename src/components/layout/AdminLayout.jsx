import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col page-shell">
      <AdminNavbar />
      <main className="flex-1 pt-18">
        <Outlet />
      </main>
    </div>
  )
}
