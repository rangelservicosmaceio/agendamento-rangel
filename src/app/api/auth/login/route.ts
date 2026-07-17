import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AuthService, ADMIN_EMAIL, ADMIN_SENHA_HASH } from '@/services/authService';
import { LoginRequest, LoginResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = (await request.json()) as LoginRequest;

    if (!body.email || !body.senha) {
      return NextResponse.json(
        { sucesso: false, erro: 'Email e senha obrigatorios' },
        { status: 400 }
      );
    }

    if (body.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { sucesso: false, erro: 'Credenciais invalidas' },
        { status: 401 }
      );
    }

    const senhaCorreta = await bcrypt.compare(body.senha, ADMIN_SENHA_HASH);

    if (!senhaCorreta) {
      return NextResponse.json(
        { sucesso: false, erro: 'Credenciais invalidas' },
        { status: 401 }
      );
    }

    const usuario = AuthService.obterAdminPadrao();
    const token = AuthService.gerarToken(usuario);

    const response = NextResponse.json({
      sucesso: true,
      token,
      usuario,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
