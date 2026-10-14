import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";
import { param } from "@prisma/orm-postgres/relational-core";

const runtime = db.runtime();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;

    const solicitacaoId = Number(id);

    if (!Number.isInteger(solicitacaoId) || solicitacaoId <= 0) {
      return Response.json(
        { erro: "ID da solicitação inválido" },
        { status: 400 },
      );
    }

    const solicitacaoPlano = db.raw.sql`
  SELECT
    "id",
    "nome",
    "email",
    "senha",
    "status"
  FROM "SolicitacaoCadastro"
  WHERE "id" = ${solicitacaoId}
`
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
        nome: db.sql.public.SolicitacaoCadastro.columns.nome,
        email: db.sql.public.SolicitacaoCadastro.columns.email,
        senha: db.sql.public.SolicitacaoCadastro.columns.senha,
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

    const usuarioPlano = db.raw.sql`
  SELECT "id"
  FROM "Usuario"
  WHERE "email" = ${solicitacao.email}
`
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuariosEncontrados = await runtime.query(usuarioPlano);

    const usuarioExistente = usuariosEncontrados[0];

    if (usuarioExistente) {
      return Response.json(
        {
          erro: "Este email já está cadastrado",
        },
        {
          status: 409,
        },
      );
    }

    const perfil = "FUNCIONARIO";

    const inserirUsuarioPlano = db.raw.sql`
  INSERT INTO "Usuario" ("nome", "email", "senha", "perfil")
  VALUES (
    ${solicitacao.nome},
    ${solicitacao.email},
    ${solicitacao.senha},
    ${param(perfil, {
      codecId: db.sql.public.Usuario.columns.perfil.codecId,
    })}
  )
  RETURNING "id"
`
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuarioCriado = await runtime.query(inserirUsuarioPlano);

    const atualizarSolicitacaoPlano = db.raw.sql`
  UPDATE "SolicitacaoCadastro"
  SET "status" = 'APROVADO'
  WHERE "id" = ${solicitacaoId}
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
        { erro: "Não foi possível atualizar a solicitação." },
        { status: 500 },
      );
    }

    return Response.json(
      {
        mensagem: "Solicitação aprovada com sucesso!",
        usuarioId: usuarioCriado[0]?.id,
      },
      { status: 200 },
    );

    // Continuaremos a implementação aqui.
  } catch (erro) {
    console.error("ERRO AO APROVAR SOLICITAÇÃO:", erro);

    return Response.json(
      { erro: "Erro interno ao aprovar solicitação" },
      { status: 500 },
    );
  }
}
