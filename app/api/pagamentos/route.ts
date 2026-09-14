import db from "@/lib/db";

export async function GET() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  // Busca todos os clientes
  const clientes = db
    .prepare(
      `
      SELECT
        id,
        nome,
        empresa,
        valor_mensalidade,
        dia_vencimento
      FROM clientes
      WHERE valor_mensalidade IS NOT NULL
      AND dia_vencimento IS NOT NULL
      `,
    )
    .all() as {
    id: number;
    nome: string;
    empresa: string;
    valor_mensalidade: number;
    dia_vencimento: number;
  }[];

  // Para cada cliente
  for (const cliente of clientes) {
    const dataVencimento = new Date(ano, mes, cliente.dia_vencimento);

    const anoFormatado = dataVencimento.getFullYear();

    const mesFormatado = String(dataVencimento.getMonth() + 1).padStart(2, "0");

    const diaFormatado = String(dataVencimento.getDate()).padStart(2, "0");

    const dataFormatada = `${anoFormatado}-${mesFormatado}-${diaFormatado}`;

    // Verifica se já existe pagamento para esse cliente neste mês
    const pagamentoExistente = db
      .prepare(
        `
        SELECT id
        FROM pagamentos
        WHERE cliente_id = ?
        AND data_vencimento = ?
        `,
      )
      .get(cliente.id, dataFormatada);

    // Se não existir, cria
    if (!pagamentoExistente) {
      db.prepare(
        `
        INSERT INTO pagamentos
        (
          cliente_id,
          valor,
          dia_vencimento,
          data_vencimento,
          status
        )
        VALUES (?, ?, ?, ?, ?)
        `,
      ).run(
        cliente.id,
        cliente.valor_mensalidade,
        cliente.dia_vencimento,
        dataFormatada,
        "Pendente",
      );
    }
  }

  // Retorna os pagamentos com os dados dos clientes
  const pagamentos = db
    .prepare(
      `
      SELECT
        pagamentos.id,
        pagamentos.cliente_id,
        clientes.nome,
        clientes.empresa,
        pagamentos.valor,
        pagamentos.dia_vencimento,
        pagamentos.data_vencimento,
        pagamentos.status
      FROM pagamentos
      INNER JOIN clientes
        ON pagamentos.cliente_id = clientes.id
      ORDER BY pagamentos.data_vencimento ASC
      `,
    )
    .all();

  return Response.json(pagamentos);
}
