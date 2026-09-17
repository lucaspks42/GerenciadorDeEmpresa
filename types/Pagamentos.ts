export type Pagamento = {
  id: number;
  cliente_id: number;
  nome: string;
  empresa: string;
  valor: number;
  dia_vencimento: number;
  data_vencimento: string;
  status: string;
  prioridade: number;
};
