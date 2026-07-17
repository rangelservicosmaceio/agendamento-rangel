import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  AgendamentoFormData,
  Agendamento,
  StatusAgendamento,
  StatusPagamento,
} from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AgendamentoFormData;

    if (!body.nome || body.nome.length < 3) {
      return NextResponse.json(
        { sucesso: false, erro: 'Nome invalido (min 3 caracteres)' },
        { status: 400 }
      );
    }

    if (!/^\d{11}$/.test(body.telefone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { sucesso: false, erro: 'Telefone invalido (11 digitos)' },
        { status: 400 }
      );
    }

    if (!body.endereco || body.endereco.length < 10) {
      return NextResponse.json(
        { sucesso: false, erro: 'Endereco incompleto' },
        { status: 400 }
      );
    }

    const agora = new Date();

    const agendamento: Partial<Agendamento> = {
      cliente: {
        nome: body.nome,
        telefone: body.telefone.replace(/\D/g, ''),
        endereco: body.endereco,
      },
      tipoServico: body.tipoServico,
      descricao: body.descricao,
      dataAgendamento: new Date(body.dataAgendamento),
      horaInicio: body.horaInicio,
      horaFim: body.horaInicio,
      duracao: 60,
      status: StatusAgendamento.PENDENTE,
      statusPagamento: StatusPagamento.NAO_PAGO,
      origem: 'website',
      criadoEm: agora,
      atualizadoEm: agora,
    };

    const docRef = await addDoc(collection(db, 'agendamentos'), agendamento);

    const mensagemWhatsApp = `Ola ${body.nome}! Seu agendamento foi recebido para ${body.dataAgendamento} as ${body.horaInicio} - ${body.tipoServico}. Voce recebera confirmacao em breve. Qualquer duvida, e comigo!`;

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Agendamento recebido com sucesso!',
      agendamento: {
        id: docRef.id,
        ...agendamento,
      },
      mensagemWhatsApp,
    });
  } catch (erro) {
    console.error('Erro ao criar agendamento:', erro);
    return NextResponse.json(
      { sucesso: false, erro: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}
