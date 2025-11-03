"use client"
import React from 'react'
import Link from 'next/link'

const items = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Gerir Utilizadores' },
  { href: '/admin/products', label: 'Gerir Produtos' },
  { href: '/admin/orders', label: 'Gerir Pedidos' },
  { href: '/admin/categories', label: 'Gerir Categorias' },
  { href: '/admin/reports', label: 'Relatórios' }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 pt-4">
      <div className="px-4 mb-6">
        <div className="text-white font-bold text-lg">NETFARMA</div>
        <div className="text-sm text-gray-300">Painel Administrativo</div>
      </div>
      <nav className="px-2 space-y-1">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800">
            <span className="w-4 text-gray-300">•</span>
            <span className="text-sm">{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
