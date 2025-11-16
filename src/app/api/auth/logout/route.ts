import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Criar resposta de logout
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout realizado com sucesso'
      },
      { status: 200 }
    )

    // Limpar cookies
    response.cookies.delete('auth_token')
    response.cookies.delete('user_data')

    return response
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
