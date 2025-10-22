import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './input.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppThemeProvider } from './theme'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LandingPage, LoginPage, SignupPage, HomePage, ProfilePage, MusicPage, NotFoundPage } from './pages'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <Router>
          <Routes>
            <Route element={<AppLayout />}> 
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/music/:id" element={<ProtectedRoute><MusicPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AppThemeProvider>
    </Provider>
  </StrictMode>,
)
