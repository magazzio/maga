import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/theme-provider'

// Pages (da creare)
import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="magazzio-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
