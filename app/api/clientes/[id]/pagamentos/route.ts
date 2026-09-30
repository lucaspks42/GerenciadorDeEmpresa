import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const clienteId = Number(id);

    if (!Number.isInteger(clienteId)) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    const clientePlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "valorMensalidade",
        "diaVencimento"
      FROM "Cliente"
      WHERE "id" = ${clienteId}
    `
      .returnsRow({
        id: db.sql.public.Cliente.columns.id,
        nome: db.sql.public.Cliente.columns.nome,
        valorMensalidade: db.sql.public.Cliente.columns.valorMensalidade,
        diaVencimento: db.sql.public.Cliente.columns.diaVencimento,
      })
      .build();

    const [cliente] = await runtime.query(clientePlano);

    if (!cliente) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
    }

    if (cliente.valorMensalidade == null || cliente.diaVencimento == null) {
      return Response.json([]);
    }

    const hoje = new Date();

    for (let i = 0; i < 12; i++) {
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + i;

      const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

      const dia = Math.min(cliente.diaVencimento, ultimoDiaDoMes);

      const dataVencimento = new Date(ano, mes, dia);

      const dataFormatada =
        `${dataVencimento.getFullYear()}-` +
        `${String(dataVencimento.getMonth() + 1).padStart(2, "0")}-` +
        `${String(dataVencimento.getDate()).padStart(2, "0")}`;

      const existentePlano = db.raw.sql`
        SELECT
          "id"
        FROM "Pagamento"
        WHERE "clienteId" = ${clienteId}
        AND "dataVencimento"::date = ${dataFormatada}::date
      `
        .returnsRow({
          id: db.sql.public.Pagamento.columns.id,
        })
        .build();

      const [pagamentoExistente] = await runtime.query(existentePlano);

      if (!pagamentoExistente) {
        const dataPg = dataVencimento.toISOString();

        const dataParaBanco = new Date(dataPg);

        const inserirPlano = db.raw.sql`
          INSERT INTO "Pagamento"
          (
            "clienteId",
            "valor",
            "diaVencimento",
            "dataVencimento",
            "status"
          )
          VALUES
          (
            ${clienteId},
            ${cliente.valorMensalidade},
            ${cliente.diaVencimento},
            ${dataParaBanco.toISOString()},
            'Pendente'
          )
        `
          .affectedCount()
          .build();

        await runtime.execute(inserirPlano);
      }
    }

    const pagamentosPlano = db.raw.sql`
      SELECT
        "id",
        "valor",
        "diaVencimento",
        "dataVencimento",
        "status"
      FROM "Pagamento"
      WHERE "clienteId" = ${clienteId}
      ORDER BY "dataVencimento" ASC
    `
      .returnsRow({
        id: db.sql.public.Pagamento.columns.id,
        valor: db.sql.public.Pagamento.columns.valor,
        diaVencimento: db.sql.public.Pagamento.columns.diaVencimento,
        dataVencimento: db.sql.public.Pagamento.columns.dataVencimento,
        status: db.sql.public.Pagamento.columns.status,
      })
      .build();

    const pagamentos = await runtime.query(pagamentosPlano);

    return Response.json(pagamentos);
  } catch (erro) {
    console.error("ERRO AO BUSCAR PAGAMENTOS DO CLIENTE:", erro);

    return Response.json(
      { erro: "Erro ao buscar pagamentos" },
      { status: 500 },
    );
  }
}
