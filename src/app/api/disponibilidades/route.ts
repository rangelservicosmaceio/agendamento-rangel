import { NextRequest, NextResponse } from 'next/server';
import { DiaComSlots } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const mes = request.nextUrl.searchParams.get('mes') || new Date().toISOString().slice(0, 7);
    const slots = gerarSlotsDoMes(mes);

    return NextResponse.json({
      sucesso: true,
      disponibilidades: slots,
      total: slots.length,
    });
  } catch {
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao buscar disponibilidades' },
      { status: 500 }
    );
  }
}

const HORARIOS_PADRAO = [
  { hora: '06:00', horaFim: '07:00' },
  { hora: '07:00', horaFim: '08:00' },
  { hora: '16:00', horaFim: '17:00' },
  { hora: '17:00', horaFim: '18:00' },
  { hora: '18:00', horaFim: '19:00' },
];

function gerarSlotsDoMes(mes: string): DiaComSlots[] {
  const [ano, mesNumero] = mes.split('-').map(Number);
  const diasNoMes = new Date(ano, mesNumero, 0).getDate();
  const nomesDiaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const horaAtual = agora.getHours() * 60 + agora.getMinutes();

  const dias: DiaComSlots[] = [];

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mesNumero - 1, dia);
    const diaSemana = nomesDiaSemana[data.getDay()];

    if (diaSemana === 'dom' || diaSemana === 'sab') continue;
    if (data < hoje) continue;

    const ehHoje = data.getTime() === hoje.getTime();

    const slots = HORARIOS_PADRAO.filter((h) => {
      if (!ehHoje) return true;
      const [horaSlot, minutoSlot] = h.hora.split(':').map(Number);
      return horaSlot * 60 + minutoSlot > horaAtual;
    }).map((h) => ({
      hora: h.hora,
      horaFim: h.horaFim,
      disponivel: true,
      ocupado: false,
    }));

    if (!slots.length) continue;

    dias.push({
      data: data.toISOString().slice(0, 10),
      diaSemana,
      slots,
    });
  }

  return dias;
}
