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

    const plano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "empresa",
        "email",
        "telefone",
        "valorProduto",
        "valorMensalidade",
        "diaVencimento"
      FROM "Cliente"
      WHERE "id" = ${clienteId}
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

    if (!cliente) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
    }

    return Response.json(cliente);
  } catch (erro) {
    console.error("ERRO AO BUSCAR CLIENTE:", erro);

    return Response.json({ erro: "Erro ao buscar cliente" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const clienteId = Number(id);

    if (!Number.isInteger(clienteId)) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    // Primeiro remove os pagamentos relacionados ao cliente
    const excluirPagamentosPlano = db.raw.sql`
      DELETE FROM "Pagamento"
      WHERE "clienteId" = ${clienteId}
    `
      .affectedCount()
      .build();

    await runtime.execute(excluirPagamentosPlano);

    // Depois remove o cliente
    const excluirClientePlano = db.raw.sql`
      DELETE FROM "Cliente"
      WHERE "id" = ${clienteId}
    `
      .affectedCount()
      .build();

    const resultado = await runtime.execute(excluirClientePlano);

    if (resultado.affectedRows === 0) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
    }

    return Response.json({
      mensagem: "Cliente deletado",
    });
  } catch (erro) {
    console.error("ERRO AO DELETAR CLIENTE:", erro);

    return Response.json(
      {
        erro: "Erro ao deletar cliente",
        detalhe: String(erro),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dados = await request.json();

    const { id } = await params;

    const clienteId = Number(id);

    if (!Number.isInteger(clienteId)) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    const clienteAtualPlano = db.raw.sql`
      SELECT
        "id",
        "valorProduto",
        "valorMensalidade",
        "diaVencimento"
      FROM "Cliente"
      WHERE "id" = ${clienteId}
    `
      .returnsRow({
        id: db.sql.public.Cliente.columns.id,
        valorProduto: db.sql.public.Cliente.columns.valorProduto,
        valorMensalidade: db.sql.public.Cliente.columns.valorMensalidade,
        diaVencimento: db.sql.public.Cliente.columns.diaVencimento,
      })
      .build();

    const [clienteAtual] = await runtime.query(clienteAtualPlano);

    if (!clienteAtual) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
    }

    const {
      nome,
      empresa,
      email,
      telefone,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    } = dados;

    const novoValorMensalidade =
      valorMensalidade ?? clienteAtual.valorMensalidade;

    const novoDiaVencimento = diaVencimento ?? clienteAtual.diaVencimento;

    const mensalidadeMudou =
      novoValorMensalidade !== clienteAtual.valorMensalidade ||
      novoDiaVencimento !== clienteAtual.diaVencimento;

    const plano = db.raw.sql`
      UPDATE "Cliente"
      SET
        "nome" = ${nome},
        "empresa" = ${empresa ?? null},
        "email" = ${email ?? null},
        "telefone" = ${telefone ?? null},
        "valorProduto" = ${valorProduto ?? clienteAtual.valorProduto},
        "valorMensalidade" = ${novoValorMensalidade},
        "diaVencimento" = ${novoDiaVencimento}
      WHERE "id" = ${clienteId}
    `
      .affectedCount()
      .build();

    await runtime.execute(plano);

    if (mensalidadeMudou) {
      const hoje = new Date();

      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");

      const dataHoje = `${ano}-${mes}-${dia}`;

      const excluirPlano = db.raw.sql`
        DELETE FROM "Pagamento"
        WHERE "clienteId" = ${clienteId}
        AND "status" = 'Pendente'
        AND "dataVencimento" >= ${dataHoje}::date
      `
        .affectedCount()
        .build();

      await runtime.execute(excluirPlano);
    }

    return Response.json({
      mensagem: "Cliente atualizado com sucesso",
    });
  } catch (erro) {
    console.error("ERRO NO PATCH DO CLIENTE:", erro);

    return Response.json(
      { erro: "Erro ao atualizar cliente" },
      { status: 500 },
    );
  }
}
