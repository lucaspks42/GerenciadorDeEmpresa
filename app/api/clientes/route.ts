import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const {
      nome,
      empresa,
      email,
      telefone,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    } = dados;

    const valorProdutoFinal =
      valorProduto === "" || valorProduto === null ? 0 : Number(valorProduto);

    const valorMensalidadeFinal =
      valorMensalidade === "" || valorMensalidade === null
        ? 0
        : Number(valorMensalidade);

    const diaVencimentoFinal =
      diaVencimento === "" || diaVencimento === null
        ? 0
        : Number(diaVencimento);

    const plano = db.raw.sql`
      INSERT INTO "Cliente"
      (
        "nome",
        "empresa",
        "email",
        "telefone",
        "valorProduto",
        "valorMensalidade",
        "diaVencimento"
      )
      VALUES
      (
        ${nome},
        ${empresa || null},
        ${email || null},
        ${telefone || null},
        ${valorProdutoFinal},
        ${valorMensalidadeFinal},
        ${diaVencimentoFinal}
      )
      RETURNING
        "id",
        "nome",
        "empresa",
        "email",
        "telefone",
        "valorProduto",
        "valorMensalidade",
        "diaVencimento"
    `
      .returnsRow({
        id: db.sql.public.Cliente.columns.id,
        nome: db.sql.public.Cliente.columns.nome,
        empresa: db.sql.public.Cliente.columns.empresa,
        email: db.sql.public.Cliente.columns.email,
        telefone: db.sql.public.Cliente.columns.telefone,
        valorProduto: db.sql.public.Cliente.columns.valorProduto,
        valorMensalidade: db.sql.public.Cliente.columns.valorMensalidade,
        diaVencimento: db.sql.public.Cliente.columns.diaVencimento,
      })
      .build();

    const [cliente] = await runtime.query(plano);

    return Response.json(cliente, { status: 201 });
  } catch (erro) {
    console.error("ERRO AO CADASTRAR CLIENTE:", erro);

    return Response.json(
      { erro: "Erro ao cadastrar cliente" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const plano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "empresa",
        "telefone",
        "email",
        "valorProduto",
        "valorMensalidade",
        "diaVencimento"
      FROM "Cliente"
      ORDER BY "id" ASC
    `
      .returnsRow({
        id: db.sql.public.Cliente.columns.id,
        nome: db.sql.public.Cliente.columns.nome,
        empresa: db.sql.public.Cliente.columns.empresa,
        email: db.sql.public.Cliente.columns.email,
        telefone: db.sql.public.Cliente.columns.telefone,
        valorProduto: db.sql.public.Cliente.columns.valorProduto,
        valorMensalidade: db.sql.public.Cliente.columns.valorMensalidade,
        diaVencimento: db.sql.public.Cliente.columns.diaVencimento,
      })
      .build();

    const clientes = await runtime.query(plano);

    return Response.json(clientes);
  } catch (erro) {
    console.error("ERRO AO BUSCAR CLIENTES:", erro);

    return Response.json({ erro: "Erro ao buscar clientes" }, { status: 500 });
  }
}
