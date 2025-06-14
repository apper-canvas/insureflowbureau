import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { navRoutes } from '@/config/routes'

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Shield" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-surface-900">
                  InsureFlow
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white border-b border-surface-200 shadow-lg z-50 md:hidden"
              >
                <nav className="px-4 py-4 space-y-2">
                  {navRoutes.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5" />
                      <span>{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden border-t border-surface-200 bg-white z-40">
        <nav className="flex items-center justify-around px-2 py-2">
          {navRoutes.slice(0, 4).map((route) => {
            const isActive = location.pathname === route.path || 
              (route.path !== '/products' && location.pathname.startsWith(route.path))
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{route.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Layout