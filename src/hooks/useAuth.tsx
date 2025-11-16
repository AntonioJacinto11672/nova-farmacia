'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface UseAuthReturn {
  user: User | null
  token: string | null
  isLoading: boolean
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Fazer requisição para verificar se há cookie válido
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include' // Enviar cookies
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setToken(data.token)
        } else {
          setUser(null)
          setToken(null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Enviar cookies
      })

      if (response.ok) {
        setUser(null)
        setToken(null)
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }, [router])

  return {
    user,
    token,
    isLoading,
    logout,
    isAuthenticated: !!user && !!token
  }
}
