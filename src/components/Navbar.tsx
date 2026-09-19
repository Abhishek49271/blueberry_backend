import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ShoppingBag, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cafeInfo } from '../data/cafe'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/#menu' },
  { label: 'Story', href: '/#story' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Visit', href: '/#visit' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount, openCart } = useCart()
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40 || !isHome)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const solid = scrolled || !isHome

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-blueberry-900/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              solid ? 'bg-blueberry-700' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <span className="text-white font-display font-bold text-lg">B</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-xl font-semibold tracking-tight transition-colors ${
                solid ? 'text-blueberry-900' : 'text-white'
              }`}>
                {cafeInfo.name}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                solid ? 'text-blueberry-600' : 'text-white/70'
              }`}>
                The Restro Cafe
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  solid ? 'text-gray-700 hover:text-blueberry-700' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${
                  solid ? 'bg-blueberry-600' : 'bg-white'
                }`} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative p-2.5 rounded-full transition-colors ${
                solid ? 'text-blueberry-800 hover:bg-blueberry-50' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blueberry-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              to={user ? (isAdmin ? '/admin' : '/orders') : '/login'}
              className={`p-2.5 rounded-full transition-colors hidden sm:flex ${
                solid ? 'text-blueberry-800 hover:bg-blueberry-50' : 'text-white hover:bg-white/10'
              }`}
            >
              <User size={20} />
            </Link>

            <a
              href={`tel:${cafeInfo.phoneRaw}`}
              className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                solid ? 'text-blueberry-800' : 'text-white'
              }`}
            >
              <Phone size={16} />
              <span className="hidden xl:inline">{cafeInfo.phone}</span>
            </a>

            <Link
              to="/#menu"
              className={`hidden lg:inline-flex px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                solid
                  ? 'bg-blueberry-700 text-white hover:bg-blueberry-800 shadow-md shadow-blueberry-700/20'
                  : 'bg-white text-blueberry-900 hover:bg-cream-100'
              }`}
            >
              Order Now
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                solid ? 'text-blueberry-900' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-blueberry-950/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col pt-24 px-8"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="py-4 text-2xl font-display text-blueberry-900 border-b border-blueberry-100"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                to={user ? '/orders' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="py-4 text-2xl font-display text-blueberry-900 border-b border-blueberry-100"
              >
                {user ? 'My Orders' : 'Login'}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-2xl font-display text-blueberry-900 border-b border-blueberry-100"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => { openCart(); setMobileOpen(false); }}
                className="mt-6 flex items-center justify-center gap-2 bg-blueberry-700 text-white py-4 rounded-full font-semibold"
              >
                <ShoppingBag size={18} />
                Cart ({itemCount})
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
