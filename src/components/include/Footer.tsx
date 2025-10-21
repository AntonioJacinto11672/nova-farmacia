"use client"
import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-full mt-8 bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
                <div>
                    <div className="font-bold text-white text-lg">NETFARMA</div>
                    <p className="mt-2 text-sm">Sua saúde, nossa prioridade.</p>
                </div>
                <div>
                    <div className="font-semibold text-white">Quem Somos</div>
                    <p className="mt-2 text-sm">Empresa dedicada à entrega de medicamentos com segurança e agilidade.</p>
                </div>
                <div>
                    <div className="font-semibold text-white">Contactos</div>
                    <p className="mt-2 text-sm">Email: suporte@netfarma.com</p>
                    <p className="text-sm">Parcerias: parceiros@netfarma.com</p>
                </div>
                <div>
                    <div className="font-semibold text-white">Links</div>
                    <ul className="mt-2 space-y-2 text-sm">
                        <li>
                            <Link href="/support" className="hover:text-white">Suporte</Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-white">Quem Somos</Link>
                        </li>
                        <li>
                            <Link href="/auth/login" className="hover:text-white">Entrar</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} NETFARMA</div>
        </footer>
    )
}
