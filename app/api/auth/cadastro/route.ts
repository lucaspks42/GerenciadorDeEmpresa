import { db } from "@/src/prisma/db";
import bcrypt from "bcryptjs";

const runtime = db.runtime();

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const nome = dados.nome?.trim();
    const email = dados.email?.trim().toLowerCase();
    const senha = dados.senha;

    if (!nome || !email || !senha) {
      return Response.json(
        {
          erro: "Preencha todos os campos",
        },
        { status: 400 },
      );
    }

    if (senha.length < 6) {
      return Response.json(
        {
          erro: "A senha precisa ter pelo menos 6 caracteres.",
        },
        { status: 400 },
      );
    }

    // Verifica se o e-mail já existe
    const usuarioPlano = db.raw.sql`
      SELECT
        "id"
      FROM "Usuario"
      WHERE "email" = ${email}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const solicitacaoPendentePlano = db.raw.sql`
  SELECT "id"
  FROM "SolicitacaoCadastro"
  WHERE "email" = ${email}
  AND "status" = 'PENDENTE'
`
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
      })
      .build();

    const solicitacoesCriadas = await runtime.query(solicitacaoPendentePlano);
    const solicitacao = solicitacoesCriadas[0];

    if (solicitacao) {
      return Response.json(
        {
          erro: "Já existe uma solicitação pendente para este e-mail.",
        },
        { status: 409 },
      );
    }

    const usuariosEncontrados = await runtime.query(usuarioPlano);
    const usuarioExistente = usuariosEncontrados[0];

    if (usuarioExistente) {
      return Response.json(
        {
          erro: "Este e-mail já está cadastrado",
        },
        { status: 409 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const inserirPlano = db.raw.sql`
      INSERT INTO "SolicitacaoCadastro"
      (
        "nome",
        "email",
        "senha",
        "status"
      )
      VALUES
      (
        ${nome},
        ${email},
        ${senhaHash},
        'PENDENTE'
            )
      RETURNING
        "id"
    `
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
      })
      .build();

    const solicitacoesCriados = await runtime.query(inserirPlano);
    const solicitacoes = solicitacoesCriados[0];

    if (!solicitacoes) {
      return Response.json(
        {
          erro: "Não foi possível criar a solicitação de cadastro.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        mensagem:
          "Solicitação de cadastro enviada. Aguarde a aprovação de um administrador.",
        id: solicitacoes.id,
        status: "PENDENTE",
      },
      { status: 201 },
    );
  } catch (erro) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", erro);

    return Response.json(
      {
        erro: "Erro interno ao cadastrar usuário",
      },
      { status: 500 },
    );
  }
}
