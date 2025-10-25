"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '@/assets/logo/NEtFarma.png'
import { useCart } from '@/hooks/useCart'

export default function Header() {
    const [cartCount, setCartCount] = React.useState(0);
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const { cartTotalQty } = useCart()
    useEffect(() => {
        console.log('cartTotalQty', cartTotalQty)
    }, [])

    return (
        <header className="bg-white border-b z-10 sticky top-0">
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
                    <form className="w-full max-w-md flex gap-2">
                        <input className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" placeholder="Pesquisar produtos..." />
                        <button type="submit" className="rounded-md bg-blue-600 px-4 text-white">Pesquisar</button>
                    </form>
                </div>
                {/* Menu */}
                <div className="flex-shrink-0" style={{ minWidth: 220 }}>
                    <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 justify-end">

                        <div className="flex items-center gap-2">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-300 relative overflow-hidden"
                                title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
                            >
                                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-y-full' : 'translate-y-0'}`}>
                                    {/* Sun Icon */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'translate-y-0' : '-translate-y-full'}`}>
                                    {/* Moon Icon */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                            </button>

                            {/* Cart Icon */}
                            <div className="relative group">
                                <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartTotalQty > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform">
                                            {cartTotalQty}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <Link href="/products" className="hover:text-blue-600">Produtos</Link>
                        <Link href="/support" className="hover:text-blue-600">Suporte</Link>
                        <Link href="/auth/login" className="hover:text-blue-600">Entrar</Link>

                    </nav>
                </div>
            </div>
        </header>
    )
}
