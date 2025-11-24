import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  // simple auth flag in localStorage
  const isAuth = localStorage.getItem('isAuthenticated') === 'true'
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default PrivateRoute
