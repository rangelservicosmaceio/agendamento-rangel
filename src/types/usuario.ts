export interface UsuarioAdmin {
  id: string;
  nome: string;
  email: string;
  role: 'admin';
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  sucesso: boolean;
  token?: string;
  usuario?: UsuarioAdmin;
  erro?: string;
  mensagem?: string;
}
