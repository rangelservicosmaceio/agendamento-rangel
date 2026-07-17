'use client';

import { useState } from 'react';
import { CalendarioMes } from '@/components/Cliente/CalendarioMes';
import { FormularioAgendamento } from '@/components/Cliente/FormularioAgendamento';
import { AgendamentoFormData, SlotHorario } from '@/types';

type Etapa = 'calendario' | 'formulario' | 'confirmacao';

export default function Home() {
  const [etapa, setEtapa] = useState<Etapa>('calendario');
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [slotSelecionado, setSlotSelecionado] = useState<SlotHorario | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemWhatsApp, setMensagemWhatsApp] = useState('');
  const [erro, setErro] = useState('');

  const handleSelecionarSlot = (data: string, slot: SlotHorario) => {
    setDataSelecionada(data);
    setSlotSelecionado(slot);
    setEtapa('formulario');
  };

  const handleSubmitAgendamento = async (dados: AgendamentoFormData) => {
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch('/api/agendamentos/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (resultado.sucesso) {
        setMensagemWhatsApp(resultado.mensagemWhatsApp);
        setEtapa('confirmacao');
      } else {
        setErro(resultado.erro || 'Erro ao agendar');
      }
    } catch {
      setErro('Erro de conexao');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Agende seu Servico</h1>

      {etapa === 'calendario' && <CalendarioMes onSelecionarSlot={handleSelecionarSlot} />}

      {etapa === 'formulario' && slotSelecionado && (
        <>
          {erro && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{erro}</div>}
          <FormularioAgendamento
            dataAgendamento={dataSelecionada}
            horaInicio={slotSelecionado.hora}
            onSubmit={handleSubmitAgendamento}
            carregando={carregando}
          />
        </>
      )}

      {etapa === 'confirmacao' && (
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Agendamento Recebido!</h2>
          <p className="mb-4">Copie a mensagem abaixo e envie no WhatsApp:</p>
          <div className="bg-white p-4 border rounded mb-4">{mensagemWhatsApp}</div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(mensagemWhatsApp);
              alert('Mensagem copiada!');
            }}
            className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700"
          >
            Copiar Mensagem
          </button>
        </div>
      )}
    </main>
  );
}
