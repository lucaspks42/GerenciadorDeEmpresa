import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";

const runtime = db.runtime();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Verifica se o usuário é administrador
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    // 2. Recupera e valida o ID
    const { id } = await params;
    const solicitacaoId = Number(id);

    if (!Number.isInteger(solicitacaoId) || solicitacaoId <= 0) {
      return Response.json(
        { erro: "ID da solicitação inválido" },
        { status: 400 },
      );
    }

    // 3. Verifica se a solicitação existe e está pendente
    const solicitacaoPlano = db.raw.sql`
      SELECT "id", "status"
      FROM "SolicitacaoCadastro"
      WHERE "id" = ${solicitacaoId}
    `
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
        status: db.sql.public.SolicitacaoCadastro.columns.status,
      })
      .build();

    const solicitacoesEncontradas = await runtime.query(solicitacaoPlano);
    const solicitacao = solicitacoesEncontradas[0];

    if (!solicitacao) {
      return Response.json(
        { erro: "Solicitação não encontrada" },
        { status: 404 },
      );
    }

    if (solicitacao.status !== "PENDENTE") {
      return Response.json(
        { erro: "Esta solicitação já foi processada" },
        { status: 409 },
      );
    }

    // 4. Atualiza o status para RECUSADO
    const atualizarSolicitacaoPlano = db.raw.sql`
      UPDATE "SolicitacaoCadastro"
      SET "status" = 'RECUSADO'
      WHERE "id" = ${solicitacaoId}
        AND "status" = 'PENDENTE'
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
      })
      .build();

    const solicitacaoAtualizada = await runtime.query(
      atualizarSolicitacaoPlano,
    );

    if (!solicitacaoAtualizada[0]) {
      return Response.json(
        { erro: "Não foi possível recusar a solicitação." },
        { status: 409 },
      );
    }

    // 5. Retorna sucesso
    return Response.json(
      { mensagem: "Solicitação recusada com sucesso!" },
      { status: 200 },
    );
  } catch (erro) {
    console.error("ERRO AO RECUSAR SOLICITAÇÃO:", erro);

    return Response.json(
      { erro: "Erro interno ao recusar solicitação" },
      { status: 500 },
    );
  }
}
