"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import logoImg from '@/assets/logo/NEtFarma.png'
import { useCart } from '@/hooks/useCart'
import { useRouter } from 'next/navigation'
import { User as UserIcon, LogOut, Settings, ShoppingBag, ChevronDown, Home } from 'lucide-react'
import { useTheme } from 'next-themes'
import { User } from '../include/Header'


export default function Topbar() {
  const [cartCount, setCartCount] = React.useState(0);
  const [user, setUser] = useState<User | null>(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const { cartTotalQty } = useCart()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fechar dropdown ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-dropdown')) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowUserDropdown(false)
    router.push('/')
  }

  if (!mounted) return null
  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center" style={{ minWidth: 120 }}>
          <Link href="/" className="flex items-center">
            <div className="relative w-20 h-12 md:w-32 md:h-16">
              <Image src={logoImg} alt="NETFARMA" fill className="object-contain" />
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </button>


        {user ? (
          <div className="relative user-dropdown">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{user.userName || user.email}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.userName || user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>

                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Meus Pedidos
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login" className="hover:text-pharmacy-600 dark:hover:text-pharmacy-400 transition-colors">Entrar</Link>
        )}
      </div>
    </div>
  )
}
