import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute'
import CustomerLayout from '@/components/layout/CustomerLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import HomePage from '@/pages/HomePage'
import BookingPage from '@/pages/BookingPage'
import MyBookingsPage from '@/pages/MyBookingsPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminBookingsPage from '@/pages/AdminBookingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(145deg, rgba(20,20,22,0.96), rgba(12,12,14,0.9))',
              color: '#f5f5f5',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '14px',
              fontSize: '13px',
              padding: '12px 16px',
              boxShadow: '0 16px 42px rgba(0,0,0,0.45)',
              backdropFilter: 'blur(12px)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#141416' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#141416' } },
          }}
        />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking/:carId" element={<BookingPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
