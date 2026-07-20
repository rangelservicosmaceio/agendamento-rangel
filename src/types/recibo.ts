import { FormaPagamento, StatusPagamento } from './agendamento';

export interface ItemRecibo {
  descricao: string;
  valor: number;
}

export interface ClienteRecibo {
  nome: string;
  telefone?: string;
  endereco?: string;
}

export interface Recibo {
  id: string;
  numero: number;
  cliente: ClienteRecibo;
  dataEmissao: string;
  itens: ItemRecibo[];
  total: number;
  formaPagamento: FormaPagamento;
  status: StatusPagamento;
  criadoEm: string;
}

export interface ReciboFormData {
  cliente: ClienteRecibo;
  dataEmissao: string;
  itens: ItemRecibo[];
  formaPagamento: FormaPagamento;
  status: StatusPagamento;
}
