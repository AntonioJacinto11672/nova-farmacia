'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import UserService from '@/api/services/user.service'
import RoleService from '@/api/services/role.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Heart, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import logo from '@/assets/logo/NEtFarma.png'

export interface userResponseNew {
  data: DataUser
}

export interface DataUser {
  id: string
  email: string
  userName: string
  phoneNumber: string
  role: string
  person: any
}


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const userService = new UserService()
  const roleService = new RoleService()

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

        // Salvar token no localStorage
        localStorage.setItem('token', accessToken)

        // Buscar informações do usuário
        try {
          const userInfoResponse = await userService.getUserInfo(accessToken)

          if (userInfoResponse.data) {
            const userInfo = userInfoResponse.data as any

            //console.log("userInfo hire", userInfo)

            localStorage.setItem('user', JSON.stringify(userInfo))

            // Redirecionar baseado no role
            if (userInfo.role === 'Administrador') {
              router.push('/admin')
            } else {
              router.push('/dashboard')
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

        <Card className="shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
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
