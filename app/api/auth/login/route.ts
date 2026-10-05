import { obterSessao } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

const runtime = db.runtime();

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const email = dados.email?.trim().toLowerCase();
    const senha = dados.senha;

    if (!email || !senha) {
      return Response.json(
        {
          erro: "Preencha todos os campos",
        },
        { status: 400 },
      );
    }

    const usuarioPlano = db.raw.sql`
      SELECT
        "id",
        "senha",
        "perfil"
      FROM "Usuario"
      WHERE "email" = ${email}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
        senha: db.sql.public.Usuario.columns.senha,
        perfil: db.sql.public.Usuario.columns.perfil,
      })
      .build();

    const usuarios = await runtime.query(usuarioPlano);
    const usuarioExistente = usuarios[0];

    if (!usuarioExistente) {
      return Response.json(
        {
          erro: "Usuário ou senha inválidos",
        },
        { status: 401 },
      );
    }

    const senhaValida = await bcrypt.compare(senha, usuarioExistente.senha);

    if (!senhaValida) {
      return Response.json(
        {
          erro: "Usuário ou senha inválidos",
        },
        { status: 401 },
      );
    }

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
        ${usuarioExistente.id},
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
        mensagem: "Login realizado com sucesso",
        id: usuarioExistente.id,
        perfil: usuarioExistente.perfil,
      },
      { status: 200 },
    );
  } catch (erro) {
    console.error("ERRO AO FAZER LOGIN:", erro);

    return Response.json(
      {
        erro: "Erro interno ao fazer login",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const sessao = await obterSessao();

    if (!sessao) {
      return Response.json({ erro: "Não autenticado" }, { status: 401 });
    }

    return Response.json(sessao);
  } catch (erro) {
    console.error("ERRO AO VERIFICAR SESSÃO:", erro);

    return Response.json(
      {
        erro: "Erro interno ao verificar sessão",
      },
      { status: 500 },
    );
  }
}
