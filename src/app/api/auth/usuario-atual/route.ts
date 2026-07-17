import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { sucesso: false, logado: false, erro: 'Nao autenticado' },
        { status: 401 }
      );
    }

    const usuario = AuthService.verificarToken(token);

    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, logado: false, erro: 'Token invalido' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      logado: true,
      usuario,
    });
  } catch {
    return NextResponse.json(
      { sucesso: false, logado: false, erro: 'Erro ao verificar autenticacao' },
      { status: 500 }
    );
  }
}
