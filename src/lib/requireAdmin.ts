import { NextRequest } from 'next/server';
import { AuthService } from '@/services/authService';

export function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return AuthService.verificarToken(token);
}
