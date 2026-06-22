import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Book from './pages/Book'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Layout from './components/common/Layout'

// Solution Pages
import InsuranceQuotes from './pages/solutions/InsuranceQuotes'
import ConstructionBids from './pages/solutions/ConstructionBids'
import ProposalWriting from './pages/solutions/ProposalWriting'
import VendorOnboarding from './pages/solutions/VendorOnboarding'
import ProcurementAutomation from './pages/solutions/ProcurementAutomation'
import ComplianceDashboard from './pages/solutions/ComplianceDashboard'
// New Service Pages (Sales, Financial & Legal)
import MortgageLeads from './pages/solutions/MortgageLeads'
import LegalIntake from './pages/solutions/LegalIntake'
import ContractReview from './pages/solutions/ContractReview'
import Configurator from './pages/solutions/Configurator'
import LeakedLeadROI from './pages/LeakedLeadROI'
import Scanner from './pages/solutions/Scanner'
import Checklist from './pages/Checklist'
import Sandbox from './pages/solutions/Sandbox'

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
      // Solution Pages
      { path: 'solutions/insurance-quotes', element: <InsuranceQuotes /> },
      { path: 'solutions/construction-bids', element: <ConstructionBids /> },
      { path: 'solutions/proposal-writing', element: <ProposalWriting /> },
      { path: 'solutions/vendor-onboarding', element: <VendorOnboarding /> },
      { path: 'solutions/procurement-automation', element: <ProcurementAutomation /> },
      { path: 'solutions/compliance-dashboard', element: <ComplianceDashboard /> },
      // New Service Routes (Sales, Financial & Legal)
      { path: 'solutions/mortgage-leads', element: <MortgageLeads /> },
      { path: 'solutions/legal-intake', element: <LegalIntake /> },
      { path: 'solutions/contract-review', element: <ContractReview /> },
      { path: 'solutions/configurator', element: <Configurator /> },
      { path: 'roi', element: <LeakedLeadROI /> },
      { path: 'scanner', element: <Scanner /> },
      { path: 'checklist', element: <Checklist /> },
      { path: 'sandbox', element: <Sandbox /> },
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