'use client';

import React, { useEffect, useState } from 'react';
import { DiaComSlots, SlotHorario } from '@/types';

interface CalendarioMesProps {
  onSelecionarSlot: (data: string, slot: SlotHorario) => void;
}

export const CalendarioMes: React.FC<CalendarioMesProps> = ({ onSelecionarSlot }) => {
  const [dias, setDias] = useState<DiaComSlots[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/disponibilidades')
      .then((res) => res.json())
      .then((data) => {
        if (data.sucesso) setDias(data.disponibilidades);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <div className="bg-white p-6 rounded-lg shadow">Carregando horarios...</div>;
  }

  const dia = dias.find((d) => d.data === diaSelecionado);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Escolha uma data e hora</h2>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
        {dias.map((d) => (
          <button
            key={d.data}
            onClick={() => setDiaSelecionado(d.data)}
            className={`p-2 border rounded text-sm ${
              diaSelecionado === d.data ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
            }`}
          >
            {d.data.slice(8, 10)}/{d.data.slice(5, 7)}
          </button>
        ))}
      </div>

      {dia && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {dia.slots.map((slot) => (
            <button
              key={slot.hora}
              disabled={slot.ocupado}
              onClick={() => onSelecionarSlot(dia.data, slot)}
              className="p-3 border rounded hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {slot.hora} - {slot.horaFim}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
