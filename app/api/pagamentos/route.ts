import db from "@/lib/db";

export async function GET() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const anoHoje = hoje.getFullYear();
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");
  const diaHoje = String(hoje.getDate()).padStart(2, "0");

  const hojeFormatado = `${anoHoje}-${mesHoje}-${diaHoje}`;

  // Busca todos os clientes que possuem mensalidade e dia de vencimento
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

  // Cria o próximo pagamento de cada cliente, caso ainda não exista
  for (const cliente of clientes) {
    const vencimentoPassou = cliente.dia_vencimento < hoje.getDate();

    let mesVencimento = mes;

    if (vencimentoPassou) {
      mesVencimento = mes + 1;
    }

    const dataVencimento = new Date(ano, mesVencimento, cliente.dia_vencimento);

    const anoFormatado = dataVencimento.getFullYear();

    const mesFormatado = String(dataVencimento.getMonth() + 1).padStart(2, "0");

    const diaFormatado = String(dataVencimento.getDate()).padStart(2, "0");

    const dataFormatada = `${anoFormatado}-${mesFormatado}-${diaFormatado}`;

    // Verifica se já existe esse pagamento
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

  // Busca todos os pagamentos
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
        pagamentos.status,

        CASE
          WHEN pagamentos.data_vencimento < ? THEN 1
          WHEN pagamentos.data_vencimento = ? THEN 2
          ELSE 3
        END AS prioridade

      FROM pagamentos

      INNER JOIN clientes
        ON pagamentos.cliente_id = clientes.id

      ORDER BY
        prioridade ASC,
        pagamentos.data_vencimento ASC
      `,
    )
    .all(hojeFormatado, hojeFormatado);

  return Response.json(pagamentos);
}
