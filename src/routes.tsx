import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Book from './pages/Book'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Layout from './components/common/Layout'

// Mock Authentication Guard for the Client Portal
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Let's bypass or allow easy entry for demonstration/agency purposes
  const token = localStorage.getItem('simpler_life_client_token') || 'demo'
  if (!token) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: 'book', element: <Book /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Catch-all wildcard as a separate top-level route (not nested under Layout)
  // This ensures /book is NOT matched by the wildcard
  {
    path: '*',
    element: <NotFound />,
  },
])