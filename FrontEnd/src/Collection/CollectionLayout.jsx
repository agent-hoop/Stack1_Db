import React, { useEffect, useRef, useState } from 'react'
import Header from './Components/Header'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FolderIcon, Home, Search, SettingsIcon } from 'lucide-react'

export default function CollectionLayout() {

  const navigate = useNavigate()
  const {pathname} = useLocation()
  const [showNav, setShowNav] = useState(true)
  const lastScrollY = useRef(0)

  // hide/show nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNav(false) // scrolling down
      } else {
        setShowNav(true) // scrolling up
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <div className="h-screen  flex flex-col">
      <Header />

      <main className="flex-1 px-3 overflow-y-auto pb-18">
        <Outlet />
      </main>

        <BottomNav
          pathname={pathname}
          navigate={navigate}
          show={showNav}
        />

    </div>
  )
}
function BottomNav({ pathname, navigate, show }) {
  const items = [
    { label: 'Home', icon: Home, path: '' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Library', icon: FolderIcon, path: '/library' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ]

  return (
    <nav
      className={`
        fixed bottom-0  left-0 right-0 
        w-full h-16
        rounded-t-2xl
        rounded-b-none
        backdrop-blur-xl bg-white/10
        border border-white/20
        shadow-xl shadow-black/30
        flex items-center justify-around
        transition-all duration-300 ease-out
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
      `}
    >
      {items.map(item => (
        <NavItem
          key={item.path}
          item={item}
          active={pathname === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
    </nav>
  )
}
function NavItem({ item, active, onClick }) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center w-16 h-full"
    >
      {/* Active glow */}
      {active && (
        <span className="absolute -top-1 w-10 h-1 rounded-full bg-blue-400" />
      )}

      <Icon
        size={22}
        className={active ? 'text-blue-400' : 'text-white/70'}
      />

      <span
        className={`text-[11px] mt-1 ${
          active ? 'text-blue-400' : 'text-white/60'
        }`}
      >
        {item.label}
      </span>
    </button>
  )
}
