import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast';
import CartProvider from '@/providers/CartProvider';
import { DarkModeProvider } from '@/providers/DarkModeProvider';

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
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        <DarkModeProvider>
          <Toaster toastOptions={{
            style: {
              backgroundColor: 'rgb(51, 65, 85)',
              color: '#fff'
            }
          }} />
          <CartProvider>
            {children}
          </CartProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
