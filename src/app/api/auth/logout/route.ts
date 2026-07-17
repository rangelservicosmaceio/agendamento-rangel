import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ sucesso: true, mensagem: 'Desconectado com sucesso!' });

  response.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
