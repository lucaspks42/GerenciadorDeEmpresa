import { db } from "@/src/prisma/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { param } from "@prisma/orm-postgres/relational-core/expression";

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

    // Verifica se já existe algum usuário no sistema
    const primeiroUsuario = db.raw.sql`
      SELECT
        "id"
      FROM "Usuario"
      LIMIT 1
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuariosExistentes = await runtime.query(primeiroUsuario);
    const usuarioEncontrado = usuariosExistentes[0];

    // O primeiro usuário será administrador.
    // Os próximos serão funcionários.
    const perfil = usuarioEncontrado ? "FUNCIONARIO" : "ADMINISTRADOR";

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    console.log(db.sql.public);

    // Cria o usuário
    const inserirPlano = db.raw.sql`
      INSERT INTO "Usuario"
      (
        "nome",
        "email",
        "senha",
        "perfil"
      )
      VALUES
      (
        ${nome},
        ${email},
        ${senhaHash},
        ${param(perfil, {
          codecId: db.sql.public.Usuario.columns.perfil.codecId,
        })}
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

    // Cria a sessão automaticamente
    const token = crypto.randomBytes(32).toString("hex");

    const expiraEm = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const sessaoPlano = db.raw.sql`
      INSERT INTO "Sessao"
      (
        "token",
        "usuarioId",
        "expiraEm"
      )
      VALUES
      (
        ${token},
        ${usuario.id},
        ${expiraEm}
      )
      RETURNING
        "id"
    `
      .returnsRow({
        id: db.sql.public.Sessao.columns.id,
      })
      .build();

    await runtime.query(sessaoPlano);

    // Salva a sessão no navegador
    const cookieStore = await cookies();

    cookieStore.set("sessao", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json(
      {
        mensagem: "Usuário cadastrado com sucesso",
        id: usuario.id,
        perfil,
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
