"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logoImg from '@/assets/logo/NEtFarma.png'
import { useCart } from '@/hooks/useCart'
import { User, LogOut, Settings, ShoppingBag, ChevronDown, Search, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'

export interface User {
  id: string
  email: string
  userName: string
  phoneNumber: string
  role: string
}

export default function Header() {
    const [cartCount, setCartCount] = React.useState(0);
    const [user, setUser] = useState<User | null>(null)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const { cartTotalQty } = useCart()
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Buscar dados do usuário via API (cookies HTTP-Only)
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error)
            }
        }

        fetchUser()

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

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            setUser(null)
            setShowUserDropdown(false)
            router.push('/')
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            setShowMobileSearch(false)
        }
    }

    if (!mounted) return null

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center" style={{ minWidth: 120 }}>
                    <Link href="/" className="flex items-center">
                        <div className="relative w-20 h-12 md:w-32 md:h-16">
                            <Image src={logoImg} alt="NETFARMA" fill className="object-contain" />
                        </div>
                    </Link>
                </div>
                {/* Search center */}
                <div className="flex-1 flex justify-center">
                    <form className="w-full max-w-md flex gap-2" onSubmit={handleSearch}>
                        <input value={searchQuery} className="flex-1 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharmacy-500" placeholder="Pesquisar produtos..." onChange={(e) => setSearchQuery(e.target.value)} />
                        <button type="submit" className="rounded-md bg-pharmacy-600 hover:bg-pharmacy-700 px-4 text-white transition-colors">Pesquisar</button>
                    </form>
                </div>
                {/* Menu */}
                <div className="flex-shrink-0" style={{ minWidth: 220 }}>
                    <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300 justify-end">

                        <div className="flex items-center gap-2">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
                                title={theme === 'dark' ? "Mudar para modo claro" : "Mudar para modo escuro"}
                            >
                                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-y-full' : 'translate-y-0'}`}>
                                    {/* Sun Icon */}
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'translate-y-0' : '-translate-y-full'}`}>
                                    {/* Moon Icon */}
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                            </button>

                            {/* Cart Icon */}
                            <div className="relative group">
                                <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => router.push("/cart")}>
                                    <Link href="/cart" className="relative">
                                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {cartTotalQty > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-pharmacy-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {cartTotalQty}
                                            </span>
                                        )}
                                    </Link>
                                </button>
                            </div>
                        </div>
                        <Link href="/products" className="hover:text-pharmacy-600 dark:hover:text-pharmacy-400 transition-colors">Produtos</Link>
                        <Link href="/support" className="hover:text-pharmacy-600 dark:hover:text-pharmacy-400 transition-colors">Suporte</Link>
                        
                        {user ? (
                            <div className="relative user-dropdown">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <User className="w-4 h-4" />
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
                                                href="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Painel/Dashboard
                                            </Link>
                                            
                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                Meus Pedidos
                                            </Link>
                                            
                                            {user.role === 'Administrador' && (
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

                    </nav>
                </div>
            </div>
        </header>
    )
}
