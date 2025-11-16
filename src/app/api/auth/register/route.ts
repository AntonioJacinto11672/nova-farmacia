import { NextRequest, NextResponse } from 'next/server'
import { register as registerUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, age, sex, address, phone, password } = body

    // Validação básica
    if (!name || !email || !password || !address || !phone) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const result = await registerUser({
      name,
      email,
      age: age || 18,
      sex: sex || 'M',
      address,
      phone,
      password
    })

    // Criar resposta com cookie HTTP-Only
    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        message: 'Conta criada com sucesso'
      },
      { status: 201 }
    )

    // Definir cookie HTTP-Only com token
    response.cookies.set({
      name: 'auth_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    // Definir cookie HTTP-Only com dados do usuário
    response.cookies.set({
      name: 'user_data',
      value: JSON.stringify(result.user),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
