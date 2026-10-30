import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";
import { registrarHistorico } from "@/lib/historico";

const runtime = db.runtime();

// ==========================================
// GET - BUSCAR CLIENTE
// ==========================================

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

// ==========================================
// DELETE - EXCLUIR CLIENTE
// ==========================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuarioLogado = await exigirAdministrador();

    if (!usuarioLogado) {
      return Response.json({ erro: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const clienteId = Number(id);

    if (!Number.isInteger(clienteId)) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    // Busca os dados do cliente antes da exclusão
    const clientePlano = db.raw.sql`
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

    const [cliente] = await runtime.query(clientePlano);

    if (!cliente) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
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

    // Registra a exclusão no histórico
    await registrarHistorico({
      usuario: {
        id: usuarioLogado.usuarioId,
        nome: usuarioLogado.nome,
      },
      request,
      modulo: "CLIENTES",
      acao: "EXCLUSAO",
      descricao: `Excluiu o cliente ${cliente.nome}`,
      entidade: "Cliente",
      entidadeId: String(cliente.id),
      dadosAnteriores: {
        nome: cliente.nome,
        empresa: cliente.empresa,
        email: cliente.email,
        telefone: cliente.telefone,
        valorProduto: cliente.valorProduto,
        valorMensalidade: cliente.valorMensalidade,
        diaVencimento: cliente.diaVencimento,
      },
    });

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

// ==========================================
// PATCH - EDITAR CLIENTE
// ==========================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuarioLogado = await exigirAdministrador();

    if (!usuarioLogado) {
      return Response.json({ erro: "Não autorizado" }, { status: 401 });
    }

    const dados = await request.json();
    const { id } = await params;

    const clienteId = Number(id);

    if (!Number.isInteger(clienteId)) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    // Busca os dados atuais do cliente
    const clienteAtualPlano = db.raw.sql`
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

    // Atualiza o cliente e retorna os novos dados
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

    const [clienteNovo] = await runtime.query(plano);

    if (!clienteNovo) {
      return Response.json(
        { erro: "Não foi possível atualizar o cliente" },
        { status: 500 },
      );
    }

    // Se a mensalidade ou o vencimento mudou, remove pagamentos pendentes futuros
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

    // Registra a edição no histórico
    await registrarHistorico({
      usuario: {
        id: usuarioLogado.usuarioId,
        nome: usuarioLogado.nome,
      },
      request,
      modulo: "CLIENTES",
      acao: "EDICAO",
      descricao: `Editou os dados do cliente ${clienteNovo.nome}`,
      entidade: "Cliente",
      entidadeId: String(clienteNovo.id),
      dadosAnteriores: {
        nome: clienteAtual.nome,
        empresa: clienteAtual.empresa,
        email: clienteAtual.email,
        telefone: clienteAtual.telefone,
        valorProduto: clienteAtual.valorProduto,
        valorMensalidade: clienteAtual.valorMensalidade,
        diaVencimento: clienteAtual.diaVencimento,
      },
      dadosNovos: {
        nome: clienteNovo.nome,
        empresa: clienteNovo.empresa,
        email: clienteNovo.email,
        telefone: clienteNovo.telefone,
        valorProduto: clienteNovo.valorProduto,
        valorMensalidade: clienteNovo.valorMensalidade,
        diaVencimento: clienteNovo.diaVencimento,
      },
    });

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
