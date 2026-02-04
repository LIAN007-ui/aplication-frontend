import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute - Component that protects routes based on user role
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If allowedRoles is specified and user's role is not included, redirect to 403
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />
  }

  return children
}

export default ProtectedRoute
