import { db } from "@/src/prisma/db";
import bcrypt from "bcryptjs";

const runtime = db.runtime();

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { nome, email, senha } = dados;

    if (!nome || !email || !senha) {
      return Response.json(
        {
          erro: "Preencha todos os campos",
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

    const [usuarioExistente] = await runtime.query(usuarioPlano);

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

    const [usuario] = await runtime.query(inserirPlano);

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
