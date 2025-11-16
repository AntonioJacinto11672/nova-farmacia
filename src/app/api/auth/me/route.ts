import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Obter cookie do token
    const token = request.cookies.get('auth_token')?.value
    const userData = request.cookies.get('user_data')?.value

    if (!token || !userData) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Parsing do userData
    const user = JSON.parse(userData)

    return NextResponse.json(
      {
        success: true,
        user,
        token
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar autenticação' },
      { status: 500 }
    )
  }
}
