import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { authApi, tokenManager, type User } from '../../services/api'
import { authSucceeded, authFailed } from '../../store/slices/authSlice'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user, isLoading } = useAppSelector((s) => s.auth)
  const token = tokenManager.getToken()

  useEffect(() => {
    // If we have a token but no user, try to get profile
    if (token && !user && !isLoading) {
      const checkAuth = async () => {
        try {
          const profile = await authApi.getProfile()
          dispatch(authSucceeded({ message: "Session restored", data: { user: profile as User, token } }))

        } catch (error) {
          // Token is invalid, clear it
          tokenManager.removeToken()
          dispatch(authFailed('Session expired'))
        }
      }
      checkAuth()
    }
  }, [token, user, isLoading, dispatch])

  // Show loading while checking authentication
  if (token && !user && !isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#a1a1aa'
      }}>
        Verifying authentication...
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
