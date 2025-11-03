"use client"
import React from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'

/* export const metadata = {
  title: 'NETFARMA Admin'
}
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
