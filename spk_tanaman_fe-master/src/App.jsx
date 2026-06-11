import { useState } from 'react'
import { SpkProvider } from './store/SpkContext'
import { getToken } from './lib/api'
import { logout } from './services/auth'
import LoginPage from './components/LoginPage'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Kriteria from './pages/Kriteria'
import SubKriteria from './pages/SubKriteria'
import Alternatif from './pages/Alternatif'
import Penilaian from './pages/Penilaian'
import Perhitungan from './pages/Perhitungan'
import Perangkingan from './pages/Perangkingan'
import Profil from './pages/Profil'

const PAGES = {
  dashboard: Dashboard,
  kriteria: Kriteria,
  'sub-kriteria': SubKriteria,
  alternatif: Alternatif,
  penilaian: Penilaian,
  perhitungan: Perhitungan,
  perangkingan: Perangkingan,
  profil: Profil,
}

export default function App() {
  const [authed, setAuthed] = useState(() => !!getToken())
  const [page, setPage] = useState('dashboard')
  const [showLogin, setShowLogin] = useState(false) // tampilkan form login dari landing page

  async function handleLogout() {
    await logout()
    setAuthed(false)
    setShowLogin(false)
    setPage('dashboard')
  }

  if (!authed) {
    if (showLogin) {
      return (
        <LoginPage onLogin={() => setAuthed(true)} onBack={() => setShowLogin(false)} />
      )
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />
  }

  const PageComponent = PAGES[page] || Dashboard

  return (
    <SpkProvider>
      <div className="min-h-screen">
        <Sidebar page={page} onNavigate={setPage} />
        <div className="flex min-h-screen flex-col pl-[220px]">
          <Topbar page={page} onNavigate={setPage} onLogout={handleLogout} />
          <div className="flex-1 p-6">
            <PageComponent />
          </div>
          <Footer />
        </div>
      </div>
      <Toast />
    </SpkProvider>
  )
}
