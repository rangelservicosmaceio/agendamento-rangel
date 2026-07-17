import jwt from 'jsonwebtoken';
import { UsuarioAdmin } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRACAO = '24h';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rangel@email.com';
export const ADMIN_SENHA_HASH =
  process.env.ADMIN_SENHA_HASH ||
  '$2b$10$bjyH742lHXYUxadBm9tsdOGoDYQXgJxnCazEyV4Bg6Acupm8NzmgW'; // senha123

export class AuthService {
  static gerarToken(usuario: UsuarioAdmin): string {
    return jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRACAO, algorithm: 'HS256' }
    );
  }

  static verificarToken(token: string): UsuarioAdmin | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UsuarioAdmin;
      return {
        id: decoded.id,
        email: decoded.email,
        nome: decoded.nome,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  static obterAdminPadrao(): UsuarioAdmin {
    return {
      id: 'usr_rangel_001',
      email: ADMIN_EMAIL,
      nome: 'Rangel',
      role: 'admin',
    };
  }
}
