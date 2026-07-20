'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recibo } from '@/types';
import { baixarReciboPdf } from '@/lib/baixarReciboPdf';

export default function RecibosPage() {
  const router = useRouter();
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [baixandoId, setBaixandoId] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const response = await fetch('/api/recibos', { credentials: 'include' });
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }
        const resultado = await response.json();
        if (resultado.sucesso) setRecibos(resultado.recibos);
      } catch {
        router.push('/admin/login');
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [router]);

  const handleBaixar = async (recibo: Recibo) => {
    setBaixandoId(recibo.id);
    try {
      await baixarReciboPdf(recibo);
    } finally {
      setBaixandoId(null);
    }
  };

  if (carregando) return <div className="p-4">Carregando...</div>;

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recibos</h1>
        <div className="flex gap-4 items-center">
          <Link href="/admin/dashboard" className="text-blue-600 font-semibold hover:underline">
            ← Dashboard
          </Link>
          <Link
            href="/admin/recibos/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
          >
            + Novo recibo
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="bg-white rounded shadow overflow-x-auto">
          {recibos.length === 0 ? (
            <p className="p-6 text-gray-600">Nenhum recibo gerado ainda.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b bg-gray-50">
                  <th className="p-3">Nº</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {recibos.map((recibo) => (
                  <tr key={recibo.id} className="border-b last:border-0">
                    <td className="p-3 font-mono">{String(recibo.numero).padStart(4, '0')}</td>
                    <td className="p-3">{recibo.cliente.nome}</td>
                    <td className="p-3">{recibo.dataEmissao}</td>
                    <td className="p-3">
                      {recibo.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          recibo.status === 'pago'
                            ? 'text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold'
                            : 'text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold'
                        }
                      >
                        {recibo.status === 'pago' ? 'Pago' : 'Não pago'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleBaixar(recibo)}
                        disabled={baixandoId === recibo.id}
                        className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
                      >
                        {baixandoId === recibo.id ? 'Gerando...' : 'Baixar PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
