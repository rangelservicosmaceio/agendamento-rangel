import { pdf } from '@react-pdf/renderer';
import { ReciboPDF } from '@/components/Admin/ReciboPDF';
import { Recibo } from '@/types';

export async function baixarReciboPdf(recibo: Recibo) {
  const blob = await pdf(<ReciboPDF recibo={recibo} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recibo-${String(recibo.numero).padStart(4, '0')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
