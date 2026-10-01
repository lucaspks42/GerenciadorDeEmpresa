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

    const usuarios = await runtime.query(usuarioPlano);
    const usuarioExistente = usuarios[0];

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
      INSERT INTO "Usuario"
      (
        "nome",
        "email",
        "senha"
      )
      VALUES
      (
        ${nome},
        ${email},
        ${senhaHash}
      )
      RETURNING
        "id"
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuariosCriados = await runtime.query(inserirPlano);
    const usuario = usuariosCriados[0];

    if (!usuario) {
      return Response.json(
        {
          erro: "Não foi possível criar o usuário",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        mensagem: "Usuário cadastrado com sucesso",
        id: usuario.id,
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
