import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './input.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Router>
        <Routes>
          <h1> Hello World!!!! </h1>
        </Routes>
      </Router>
  </StrictMode>,
)
