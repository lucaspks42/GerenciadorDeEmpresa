import { cookies } from "next/headers";
import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function obterSessao() {
  const cookieStore = await cookies();

  const token = cookieStore.get("sessao")?.value;

  if (!token) {
    return null;
  }

  const sessaoPlano = db.raw.sql`
    SELECT
      "Sessao"."id" AS "sessaoId",
      "Usuario"."id" AS "usuarioId",
      "Usuario"."nome",
      "Usuario"."email",
      "Usuario"."perfil"
    FROM "Sessao"
    JOIN "Usuario"
      ON "Usuario"."id" = "Sessao"."usuarioId"
    WHERE "Sessao"."token" = ${token}
      AND "Sessao"."expiraEm" > NOW()
  `
    .returnsRow({
      sessaoId: db.sql.public.Sessao.columns.id,
      usuarioId: db.sql.public.Usuario.columns.id,
      nome: db.sql.public.Usuario.columns.nome,
      email: db.sql.public.Usuario.columns.email,
      perfil: db.sql.public.Usuario.columns.perfil,
    })
    .build();

  const sessoes = await runtime.query(sessaoPlano);
  const sessao = sessoes[0];

  if (!sessao) {
    return null;
  }

  return sessao;
}

export async function exigirAdministrador() {
  const usuario = await obterSessao();

  if (!usuario) {
    return;
  }

  if (usuario.perfil !== "ADMINISTRADOR") {
    return;
  }

  return usuario;
}
