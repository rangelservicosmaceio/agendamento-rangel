'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    senha: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const resultado = await response.json();

      if (resultado.sucesso) {
        router.push('/admin/dashboard');
      } else {
        setErro(resultado.erro || 'Erro ao fazer login');
      }
    } catch {
      setErro('Erro de conexao');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Admin - Login</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="rangel@email.com"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Senha</label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            placeholder="Sua senha"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {erro && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{erro}</div>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
        >
          {carregando ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
