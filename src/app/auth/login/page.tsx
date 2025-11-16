'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import UserService from '@/api/services/user.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'
import logo from '@/assets/logo/NEtFarma.png'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const userService = new UserService()

  // Verificar se usuário já está logado (via cookie HTTP-Only)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          router.replace('/')
        }
      } catch (error) {
        console.log('Não autenticado - continuando com login')
      }
    }
    checkAuth()
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await userService.signIn(data.email, data.password)

      if (response.error) {
        console.log(response.error);
        setError(response.error.message && response.error.message !== "record not found" ? response.error.message : 'Email ou senha incorretos')
        return
      }

      if (response.data?.data) {
        const { accessToken } = response.data.data

        // Buscar informações do usuário
        try {
          const userInfoResponse = await userService.getUserInfo(accessToken)

          if (userInfoResponse.data) {
            const userInfo = userInfoResponse.data as any

            // Enviar para API route que vai configurar cookies HTTP-Only
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                email: data.email,
                password: data.password,
                user: userInfo,
                token: accessToken
              })
            })

            if (loginResponse.ok) {
              const result = await loginResponse.json()
              
              // Redirecionar baseado no role (role vem do banco de dados via API)
              if (userInfo.role === 'Administrador') {
                router.replace('/admin')
              } else {
                router.replace('/')
              }
            } else {
              setError('Erro ao configurar sessão')
            }
          } else {
            setError('Erro ao obter informações do usuário')
          }
        } catch (userInfoError) {
          console.error('Erro ao buscar informações do usuário:', userInfoError)
          setError('Erro ao obter informações do usuário')
        }
      } else {
        setError('Resposta inválida do servidor')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-60 h-5 rounded-full">
            {/*  <Heart className="w-8 h-8 text-white" /> */}
            <Link href="/">
              <Image src={logo} alt="NetFarma Logo" width={160} height={50} />
            </Link>
          </div>
        </div>

        <Card className="shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">Entrar</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={`${errors.email ? 'border-red-500' : ''} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`${errors.password ? 'border-red-500' : ''} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-pharmacy-600 hover:bg-pharmacy-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <Link href="/auth/register" className="text-pharmacy-600 hover:text-pharmacy-700 dark:text-pharmacy-400 dark:hover:text-pharmacy-300 hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>

            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
