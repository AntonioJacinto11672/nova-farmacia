"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '@/assets/logo/NEtFarma.png'

export default function Header() {
    return (
        <header className="bg-white border-b z-10 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
                <div className="flex-shrink-0 flex items-center" style={{ minWidth: 120 }}>
                    <Link href="/" className="flex items-center">
                        <div className="relative w-20 h-12 md:w-32 md:h-16">
                            <Image src={logoImg} alt="NETFARMA" fill className="object-contain" />
                        </div>
                    </Link>
                </div>
                <div className="flex-1 flex justify-center">
                    <form className="w-full max-w-md flex gap-2">
                        <input className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" placeholder="Pesquisar produtos..." />
                        <button type="submit" className="rounded-md bg-blue-600 px-4 text-white">Pesquisar</button>
                    </form>
                </div>
                <div className="flex-shrink-0" style={{ minWidth: 220 }}>
                    <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 justify-end">
                        <Link href="/products" className="hover:text-blue-600">Produtos</Link>
                        <Link href="/support" className="hover:text-blue-600">Suporte</Link>
                        <Link href="/auth/login" className="hover:text-blue-600">Entrar</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
