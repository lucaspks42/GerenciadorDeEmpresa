import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function GET() {
  try {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const anoHoje = hoje.getFullYear();
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaHoje = String(hoje.getDate()).padStart(2, "0");

    const hojeFormatado = `${anoHoje}-${mesHoje}-${diaHoje}`;

    const clientesPlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "empresa",
        "valorMensalidade",
        "diaVencimento"
      FROM "Cliente"
      WHERE "valorMensalidade" IS NOT NULL
      AND "diaVencimento" IS NOT NULL
    `
      .returnsRow({
        id: db.sql.public.Cliente.columns.id,
        nome: db.sql.public.Cliente.columns.nome,
        empresa: db.sql.public.Cliente.columns.empresa,
        valorMensalidade: db.sql.public.Cliente.columns.valorMensalidade,
        diaVencimento: db.sql.public.Cliente.columns.diaVencimento,
      })
      .build();

    const clientes = await runtime.query(clientesPlano);

    for (const cliente of clientes) {
      if (cliente.valorMensalidade == null || cliente.diaVencimento == null) {
        continue;
      }

      const vencimentoPassou = cliente.diaVencimento < hoje.getDate();

      let mesVencimento = mes;

      if (vencimentoPassou) {
        mesVencimento = mes + 1;
      }

      const ultimoDiaDoMes = new Date(ano, mesVencimento + 1, 0).getDate();

      const dia = Math.min(cliente.diaVencimento, ultimoDiaDoMes);

      const dataVencimento = new Date(ano, mesVencimento, dia);

      const dataFormatada =
        `${dataVencimento.getFullYear()}-` +
        `${String(dataVencimento.getMonth() + 1).padStart(2, "0")}-` +
        `${String(dataVencimento.getDate()).padStart(2, "0")}`;

      const existentePlano = db.raw.sql`
        SELECT
          "id"
        FROM "Pagamento"
        WHERE "clienteId" = ${cliente.id}
        AND "dataVencimento"::date = ${dataFormatada}::date
      `
        .returnsRow({
          id: db.sql.public.Pagamento.columns.id,
        })
        .build();

      const [pagamentoExistente] = await runtime.query(existentePlano);

      if (!pagamentoExistente) {
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
            ${cliente.id},
            ${cliente.valorMensalidade},
            ${cliente.diaVencimento},
            ${dataFormatada}::date,
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
    p."id",
    p."clienteId",
    c."nome",
    c."empresa",
    p."valor",
    p."diaVencimento",
    TO_CHAR(p."dataVencimento", 'YYYY-MM-DD') AS "dataVencimento",
    p."status",

    CASE
      WHEN p."dataVencimento"::date < ${hojeFormatado}::date
        THEN 1
      WHEN p."dataVencimento"::date = ${hojeFormatado}::date
        THEN 2
      ELSE 3
    END AS "prioridade"

  FROM "Pagamento" p

  INNER JOIN "Cliente" c
    ON p."clienteId" = c."id"

  ORDER BY
    "prioridade" ASC,
    p."dataVencimento" ASC
`
      .returnsRow({
        id: db.sql.public.Pagamento.columns.id,
        clienteId: db.sql.public.Pagamento.columns.clienteId,
        nome: db.sql.public.Cliente.columns.nome,
        empresa: db.sql.public.Cliente.columns.empresa,
        valor: db.sql.public.Pagamento.columns.valor,
        diaVencimento: db.sql.public.Pagamento.columns.diaVencimento,

        // IMPORTANTE: não usar Pagamento.columns.dataVencimento
        dataVencimento: "pg/text@1",

        status: db.sql.public.Pagamento.columns.status,
        prioridade: "pg/int4@1",
      })
      .build();

    const pagamentos = await runtime.query(pagamentosPlano);

    const pagamentosFormatados = pagamentos.map((pagamento) => ({
      ...pagamento,
      valor: Number(pagamento.valor),
    }));

    return Response.json(pagamentosFormatados);

    return Response.json(pagamentos);
  } catch (erro) {
    console.error("ERRO AO BUSCAR PAGAMENTOS:", erro);

    return Response.json(
      {
        erro: "Erro ao buscar pagamentos",
        detalhe: String(erro),
      },
      { status: 500 },
    );
  }
}
