import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const clienteId = Number(id);

  // 1. Buscar os dados do cliente
  const cliente = db
    .prepare(
      `
      SELECT
        id,
        nome,
        valor_mensalidade,
        dia_vencimento
      FROM clientes
      WHERE id = ?
      `,
    )
    .get(clienteId) as
    | {
        id: number;
        nome: string;
        valor_mensalidade: number;
        dia_vencimento: number;
      }
    | undefined;

  // 2. Verificar se o cliente existe
  if (!cliente) {
    return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
  }

  // 3. Verificar se o cliente possui mensalidade configurada
  if (
    cliente.valor_mensalidade === null ||
    cliente.valor_mensalidade === undefined ||
    cliente.dia_vencimento === null ||
    cliente.dia_vencimento === undefined
  ) {
    return Response.json([]);
  }

  // 4. Data atual
  const hoje = new Date();

  // 5. Gerar os próximos 12 meses
  for (let i = 0; i < 12; i++) {
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + i;

    // Último dia daquele mês
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

    // Evita problemas com vencimento no dia 31
    const dia = Math.min(cliente.dia_vencimento, ultimoDiaDoMes);

    const dataVencimento = new Date(ano, mes, dia);

    const anoFormatado = dataVencimento.getFullYear();

    const mesFormatado = String(dataVencimento.getMonth() + 1).padStart(2, "0");

    const diaFormatado = String(dataVencimento.getDate()).padStart(2, "0");

    const dataFormatada = `${anoFormatado}-${mesFormatado}-${diaFormatado}`;

    // 6. Verificar se esse pagamento já existe
    const pagamentoExistente = db
      .prepare(
        `
        SELECT id
        FROM pagamentos
        WHERE cliente_id = ?
        AND data_vencimento = ?
        `,
      )
      .get(clienteId, dataFormatada);

    // 7. Se não existir, criar
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
        clienteId,
        cliente.valor_mensalidade,
        cliente.dia_vencimento,
        dataFormatada,
        "Pendente",
      );
    }
  }

  // 8. Buscar os pagamentos do cliente
  const pagamentos = db
    .prepare(
      `
      SELECT
        pagamentos.id,
        pagamentos.valor,
        pagamentos.dia_vencimento,
        pagamentos.data_vencimento,
        pagamentos.status
      FROM pagamentos
      WHERE pagamentos.cliente_id = ?
      ORDER BY pagamentos.data_vencimento ASC
      `,
    )
    .all(clienteId);

  return Response.json(pagamentos);
}
