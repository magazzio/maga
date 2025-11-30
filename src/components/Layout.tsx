import { ReactNode, useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import {
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
  Wallet,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react'
import { Toaster } from './ui/toaster'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Prodotti', href: '/prodotti', icon: Package },
  { name: 'Clienti', href: '/clienti', icon: Users },
  { name: 'Magazzini', href: '/magazzini', icon: Warehouse },
  { name: 'Portafogli', href: '/portafogli', icon: Wallet },
  { name: 'Movimenti', href: '/movimenti', icon: ArrowLeftRight },
  { name: 'Impostazioni', href: '/impostazioni', icon: Settings },
]

const SIDEBAR_STATE_KEY = 'magazz-sidebar-open'

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY)
    return saved !== null ? saved === 'true' : true
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Persistenza stato sidebar
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(sidebarOpen))
  }, [sidebarOpen])

  // Focus trap e gestione Escape per mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        mobileMenuButtonRef.current?.focus()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = mobileMenuRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Focus sul primo elemento quando si apre
    setTimeout(() => {
      firstFocusableRef.current?.focus()
    }, 100)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  // Focus restoration quando si chiude mobile menu
  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      mobileMenuButtonRef.current?.focus()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
        aria-label="Navigazione principale"
      >
        {/* Header Sidebar */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              Magazz.io
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
            aria-label={sidebarOpen ? 'Comprimi sidebar' : 'Espandi sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="main-navigation"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform duration-300 ${
                sidebarOpen ? '' : 'rotate-180'
              }`}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav id="main-navigation" className="flex-1 p-2 space-y-1" aria-label="Navigazione principale">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                title={!sidebarOpen ? item.name : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size={sidebarOpen ? 'default' : 'icon'}
            onClick={logout}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            aria-label="Esci dall'applicazione"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3"
              >
                Esci
              </motion.span>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Magazz.io
          </h1>
          <Button
            ref={mobileMenuButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={handleCloseMobileMenu}
              aria-hidden="true"
            />
            <motion.aside
              ref={mobileMenuRef}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-background md:hidden"
              aria-label="Menu di navigazione"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex h-16 items-center justify-between border-b px-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Magazz.io
                </h1>
                <Button
                  ref={firstFocusableRef}
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseMobileMenu}
                  aria-label="Chiudi menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav id="mobile-navigation" className="flex-1 p-2 space-y-1" aria-label="Navigazione principale">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleCloseMobileMenu}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t p-2">
                <Button
                  ref={lastFocusableRef}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={logout}
                  aria-label="Esci dall'applicazione"
                >
                  <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                  Esci
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 container py-8 md:py-8 pt-20 md:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

