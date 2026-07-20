'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormaPagamento, ItemRecibo, StatusPagamento } from '@/types';
import { baixarReciboPdf } from '@/lib/baixarReciboPdf';

const hoje = () => new Date().toISOString().slice(0, 10);

export default function NovoReciboPage() {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataEmissao, setDataEmissao] = useState(hoje());
  const [itens, setItens] = useState<ItemRecibo[]>([{ descricao: '', valor: 0 }]);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(FormaPagamento.PIX);
  const [status, setStatus] = useState<StatusPagamento>(StatusPagamento.PAGO);

  useEffect(() => {
    fetch('/api/auth/usuario-atual', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) router.push('/admin/login');
        else setVerificando(false);
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  const total = itens.reduce((soma, item) => soma + (Number(item.valor) || 0), 0);

  const atualizarItem = (index: number, campo: keyof ItemRecibo, valor: string) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [campo]: campo === 'valor' ? Number(valor) : valor } : item
      )
    );
  };

  const adicionarItem = () => setItens((prev) => [...prev, { descricao: '', valor: 0 }]);
  const removerItem = (index: number) => setItens((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Informe o nome do cliente');
      return;
    }
    if (!itens.length || itens.some((i) => !i.descricao.trim() || i.valor <= 0)) {
      setErro('Preencha a descrição e o valor de todos os itens');
      return;
    }

    setSalvando(true);
    try {
      const response = await fetch('/api/recibos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cliente: { nome, telefone: telefone || undefined, endereco: endereco || undefined },
          dataEmissao,
          itens,
          formaPagamento,
          status,
        }),
      });

      const resultado = await response.json();

      if (!resultado.sucesso) {
        setErro(resultado.erro || 'Erro ao gerar recibo');
        return;
      }

      await baixarReciboPdf(resultado.recibo);
      router.push('/admin/recibos');
    } catch {
      setErro('Erro de conexão');
    } finally {
      setSalvando(false);
    }
  };

  if (verificando) return <div className="p-4">Carregando...</div>;

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Novo Recibo</h1>
        <button
          onClick={() => router.push('/admin/recibos')}
          className="text-blue-600 font-semibold hover:underline"
        >
          ← Voltar
        </button>
      </nav>

      <div className="container mx-auto p-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Cliente</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data de emissão</label>
              <input
                type="date"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Endereço</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <h2 className="text-lg font-bold mb-4">Itens do serviço</h2>
          {itens.map((item, i) => (
            <div key={i} className="flex gap-2 mb-3 items-start">
              <input
                type="text"
                placeholder="Descrição do serviço"
                value={item.descricao}
                onChange={(e) => atualizarItem(i, 'descricao', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Valor"
                value={item.valor || ''}
                onChange={(e) => atualizarItem(i, 'valor', e.target.value)}
                className="w-32 p-2 border rounded"
              />
              {itens.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerItem(i)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={adicionarItem}
            className="text-sm text-blue-600 font-semibold hover:underline mb-6"
          >
            + Adicionar item
          </button>

          <div className="flex justify-between items-center mb-6 pt-4 border-t">
            <span className="font-bold">Total</span>
            <span className="font-bold text-xl">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Forma de pagamento</label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                className="w-full p-2 border rounded"
              >
                <option value={FormaPagamento.PIX}>Pix</option>
                <option value={FormaPagamento.DINHEIRO}>Dinheiro</option>
                <option value={FormaPagamento.DEBITO}>Débito</option>
                <option value={FormaPagamento.CREDITO}>Crédito</option>
                <option value={FormaPagamento.NFC}>Aproximação (NFC)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusPagamento)}
                className="w-full p-2 border rounded"
              >
                <option value={StatusPagamento.PAGO}>Pago</option>
                <option value={StatusPagamento.NAO_PAGO}>Não pago</option>
              </select>
            </div>
          </div>

          {erro && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{erro}</div>}

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
          >
            {salvando ? 'Gerando...' : 'Gerar recibo em PDF'}
          </button>
        </form>
      </div>
    </main>
  );
}
