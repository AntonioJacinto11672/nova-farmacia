"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Box, Package, Tag, BarChart2, Home, ChevronDown } from 'lucide-react'

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Gerir Utilizadores', icon: Users },
  { href: '/admin/products', label: 'Gerir Produtos', icon: Box },
  { href: '/admin/manage-orders', label: 'Gerir Pedidos', icon: Package },
  { href: '/admin/providers', label: 'Gerir Fornecedores', icon: Tag },
  { href: '/admin/category', label: 'Gerir Categorias', icon: Tag },
]

export default function Sidebar() {
  const pathname = usePathname() || ''
  const [reportsOpen, setReportsOpen] = React.useState<boolean>(pathname.startsWith('/admin'))

 
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 pt-4 shadow-lg">
      <div className="px-4 mb-6">
        <div className="text-white font-bold text-lg">NETFARMA</div>
        <div className="text-sm text-gray-300">Painel Administrativo</div>
      </div>

      <nav className="px-2">
        {MENU.map((it) => {
          const Icon = it.icon
          const active = pathname === it.href || pathname.startsWith(it.href + '/admin')
          //console.log('Sidebar active:', it.href, pathname, active)
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 rounded mb-1 text-sm transition-colors ${active ? 'bg-gray-800 text-white font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-300'}`} />
              <span className="truncate">{it.label}</span>
            </Link>
          )
        })}

        {/* Reports with submenu */}
        <div className="mt-3">
          <button
            onClick={() => setReportsOpen((value) => !value)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded mb-1 text-sm ${reportsOpen || pathname.startsWith('/admin/reports') ? 'bg-gray-800 text-white font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className={`w-4 h-4 ${reportsOpen ? 'text-white' : 'text-gray-300'}`} />
              <span>Relatórios</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${reportsOpen ? 'rotate-180' : 'rotate-0'} ${reportsOpen ? 'text-white' : 'text-gray-300'}`} />
          </button>

          {reportsOpen && (
            <div className="pl-10 mt-1 space-y-1">
              <Link href="/admin/reports/summary" className={`block px-3 py-2 rounded text-sm ${pathname === '/admin/reports/summary' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                Estatísticas
              </Link>
              <Link href="/admin/reports/charts" className={`block px-3 py-2 rounded text-sm ${pathname === '/admin/reports/charts' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                Gráficos
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="absolute bottom-6 left-4 text-xs text-gray-400">v0.1 • NETFARMA</div>
    </aside>
  )
}
