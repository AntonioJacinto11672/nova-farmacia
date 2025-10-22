'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { register as registerUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Heart, AlertCircle, CheckCircle } from 'lucide-react'
import logo from '@/assets/logo/NEtFarma.png'
import Image from 'next/image'
import UserService from '@/api/services/user.service'
import PersonService from '@/api/services/person.service'
import toast from 'react-hot-toast'



const userService = new UserService();

const personService = new PersonService();

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {

    setIsLoading(true)
    setError(null)

    try {

      const result = await userService.createClient(data.email, data.password, data.phone)

      console.log("Resultado criação usuário", result)
      if (result.error) {
        setError(result.error.message && result.error.message !== "record not found" ? result.error.message : 'Erro ao criar conta')
        return
      }

      if (result.data) {
        let userId = result.data.data.id
        if (!userId) {
          setError('Erro ao criar conta. Tente novamente.')
          return
        }

        const resultCreatePerson = await personService.createPerson(data.name, data.birthDate, data.sex, userId)
        //console.log("Resultado criação pessoa", resultCreatePerson)
        if (resultCreatePerson.error) {
         console.log("Erro criação pessoa", resultCreatePerson.error)
          setError('Erro ao criar dados pessoais. Tente novamente.')
          return
        }

        if (resultCreatePerson.data) {

          //console.log(result)
          toast.success('Account created')
          //console.log("Criar dados pessoais", resultCreatePerson)

          setIsLoading(true)
          setSuccess(true)
          
           // Redirecionar após 2 segundos
         setTimeout(() => {
           router.push("/auth/login")
         }, 2000)
        }
      }

     

    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Criada!</h2>
                <p className="text-gray-600 mb-4">
                  Sua conta foi criada com sucesso. Redirecionando...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mt-1">
          <div className="inline-flex items-center justify-center w-60 h-5 rounded-full">

            <Image src={logo} alt="NetFarma Logo" width={350} height={50} />
          </div>

        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
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
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Naascimento</Label>
                  <Input
                    id="birthDate"
                    placeholder="Seu nome completo"
                    type="date"
                    {...register('birthDate')}
                    className={errors.birthDate ? 'border-red-500' : ''}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <select
                    id="sex"
                    {...register('sex')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.sex ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                  {errors.sex && (
                    <p className="text-sm text-red-500">{errors.sex.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro, cidade"
                  {...register('address')}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="912345678"
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
