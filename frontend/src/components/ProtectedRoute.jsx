import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, roles = [] }){
  const { user, loading } = React.useContext(AuthContext)
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/auth" replace />
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
