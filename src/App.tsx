import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Prodotti from './pages/Prodotti'
import Magazzini from './pages/Magazzini'
import Movimenti from './pages/Movimenti'
import Portafogli from './pages/Portafogli'
import Clienti from './pages/Clienti'
import Impostazioni from './pages/Impostazioni'

function App() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prodotti" element={<Prodotti />} />
        <Route path="/magazzini" element={<Magazzini />} />
        <Route path="/movimenti" element={<Movimenti />} />
        <Route path="/portafogli" element={<Portafogli />} />
        <Route path="/clienti" element={<Clienti />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
      </Routes>
    </Layout>
  )
}

export default App

