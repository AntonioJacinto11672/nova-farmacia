import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, user, token } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (!user || !token) {
      return NextResponse.json(
        { error: 'Dados de usuário inválidos' },
        { status: 400 }
      )
    }

    // Criar resposta com cookie HTTP-Only
    const response = NextResponse.json(
      {
        success: true,
        user: user,
        message: 'Login realizado com sucesso'
      },
      { status: 200 }
    )

    // Definir cookie HTTP-Only com token
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    // Definir cookie HTTP-Only com dados do usuário (JSON serializado)
    response.cookies.set({
      name: 'user_data',
      value: JSON.stringify(user),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}

