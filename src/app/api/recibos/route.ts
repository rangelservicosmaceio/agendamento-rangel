import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';
import { ReciboFormData } from '@/types';

export async function GET(request: NextRequest) {
  const usuario = requireAdmin(request);
  if (!usuario) {
    return NextResponse.json({ sucesso: false, erro: 'Nao autenticado' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('recibos').orderBy('numero', 'desc').get();
    const recibos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ sucesso: true, recibos });
  } catch (erro) {
    console.error('Erro ao listar recibos:', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao listar recibos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const usuario = requireAdmin(request);
  if (!usuario) {
    return NextResponse.json({ sucesso: false, erro: 'Nao autenticado' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ReciboFormData;

    if (!body.cliente?.nome || !body.itens?.length) {
      return NextResponse.json(
        { sucesso: false, erro: 'Cliente e ao menos um item sao obrigatorios' },
        { status: 400 }
      );
    }

    const total = body.itens.reduce((soma, item) => soma + item.valor, 0);
    const db = getAdminDb();
    const contadorRef = db.collection('contadores').doc('recibos');

    const numero = await db.runTransaction(async (t) => {
      const contadorDoc = await t.get(contadorRef);
      const proximo = (contadorDoc.data()?.ultimo || 0) + 1;
      t.set(contadorRef, { ultimo: proximo }, { merge: true });
      return proximo;
    });

    const recibo = {
      numero,
      cliente: body.cliente,
      dataEmissao: body.dataEmissao,
      itens: body.itens,
      total,
      formaPagamento: body.formaPagamento,
      status: body.status,
      criadoEm: new Date().toISOString(),
    };

    const docRef = await db.collection('recibos').add(recibo);

    return NextResponse.json({ sucesso: true, recibo: { id: docRef.id, ...recibo } });
  } catch (erro) {
    console.error('Erro ao criar recibo:', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao criar recibo' }, { status: 500 });
  }
}
