import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast';
import CartProvider from '@/providers/CartProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NETFARMA - Delivery de Medicamentos',
  description: 'Sistema de delivery de medicamentos com entrega rápida e segura',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Toaster toastOptions={{
          style: {
            backgroundColor: 'rgb(51, 65, 85)',
            color: '#fff'
          }
        }} />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
