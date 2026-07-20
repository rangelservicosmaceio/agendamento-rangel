import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const usuario = requireAdmin(request);
  if (!usuario) {
    return NextResponse.json({ sucesso: false, erro: 'Nao autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection('recibos').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ sucesso: false, erro: 'Recibo nao encontrado' }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true, recibo: { id: doc.id, ...doc.data() } });
  } catch (erro) {
    console.error('Erro ao buscar recibo:', erro);
    return NextResponse.json({ sucesso: false, erro: 'Erro ao buscar recibo' }, { status: 500 });
  }
}
