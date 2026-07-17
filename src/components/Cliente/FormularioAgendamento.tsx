'use client';

import React, { useState } from 'react';
import { AgendamentoFormData, TipoServico } from '@/types';

interface FormularioAgendamentoProps {
  dataAgendamento: string;
  horaInicio: string;
  onSubmit: (dados: AgendamentoFormData) => Promise<void>;
  carregando?: boolean;
}

export const FormularioAgendamento: React.FC<FormularioAgendamentoProps> = ({
  dataAgendamento,
  horaInicio,
  onSubmit,
  carregando = false,
}) => {
  const [formData, setFormData] = useState<AgendamentoFormData>({
    nome: '',
    telefone: '',
    endereco: '',
    tipoServico: TipoServico.ELETRICO,
    descricao: '',
    dataAgendamento,
    horaInicio,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Seus dados</h2>
      <p className="text-sm text-gray-600 mb-4">
        Agendamento para {dataAgendamento} as {horaInicio}
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nome *</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Joao Silva"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Telefone *</label>
        <input
          type="tel"
          value={formData.telefone}
          onChange={(e) =>
            setFormData({ ...formData, telefone: e.target.value.replace(/\D/g, '') })
          }
          placeholder="11987654321"
          className="w-full p-2 border rounded"
          maxLength={11}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Endereco *</label>
        <input
          type="text"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          placeholder="Apto 401, Bloco A"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tipo de Servico *</label>
        <select
          value={formData.tipoServico}
          onChange={(e) =>
            setFormData({ ...formData, tipoServico: e.target.value as TipoServico })
          }
          className="w-full p-2 border rounded"
        >
          <option value={TipoServico.ELETRICO}>Conserto Eletrico</option>
          <option value={TipoServico.HIDRAULICO}>Conserto Hidraulico</option>
          <option value={TipoServico.PINTURA}>Pintura</option>
          <option value={TipoServico.MONTAGEM}>Montagem de Moveis</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Descricao do Problema *</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva o problema..."
          rows={4}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={carregando}
        className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
      >
        {carregando ? 'Agendando...' : 'Confirmar Agendamento'}
      </button>
    </form>
  );
};
