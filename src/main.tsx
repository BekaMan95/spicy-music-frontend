import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import './input.css'
import { ModeToggle } from './components/mode-toggle'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <ModeToggle />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
)
