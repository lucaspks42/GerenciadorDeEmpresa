import { cookies } from "next/headers";
import { db } from "@/src/prisma/db";

const runtime = db.runtime();

// ==========================================
// OBTER USUÁRIO LOGADO
// ==========================================

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
      "Usuario"."perfil",
      "Usuario"."status",
      "Usuario"."administradorPrincipal"
    FROM "Sessao"
    JOIN "Usuario"
      ON "Usuario"."id" = "Sessao"."usuarioId"
    WHERE "Sessao"."token" = ${token}
      AND "Sessao"."expiraEm" > NOW()
      AND "Usuario"."status" = true
  `
    .returnsRow({
      sessaoId: db.sql.public.Sessao.columns.id,
      usuarioId: db.sql.public.Usuario.columns.id,
      nome: db.sql.public.Usuario.columns.nome,
      email: db.sql.public.Usuario.columns.email,
      perfil: db.sql.public.Usuario.columns.perfil,
      status: db.sql.public.Usuario.columns.status,
      administradorPrincipal:
        db.sql.public.Usuario.columns.administradorPrincipal,
    })
    .build();

  const sessoes = await runtime.query(sessaoPlano);

  return sessoes[0] ?? null;
}

// ==========================================
// EXIGIR ADMINISTRADOR
// ==========================================

export async function exigirAdministrador() {
  const usuario = await obterSessao();

  if (!usuario) {
    return null;
  }

  if (usuario.perfil !== "ADMINISTRADOR") {
    return null;
  }

  return usuario;
}

// ==========================================
// VERIFICAR PERMISSÃO DO USUÁRIO
// ==========================================

export async function exigirPermissao(chave: string) {
  const usuario = await obterSessao();

  // Usuário não está autenticado
  if (!usuario) {
    return null;
  }

  // Administradores têm acesso a todas as permissões
  if (usuario.perfil === "ADMINISTRADOR") {
    return usuario;
  }

  // Verifica se o perfil do funcionário possui a permissão
  const permissaoPlano = db.raw.sql`
    SELECT
      p."chave"
    FROM "Usuario" u
    JOIN "PerfilAcesso" pa
      ON pa."id" = u."perfilAcessoId"
    JOIN "PerfilPermissao" pp
      ON pp."perfilAcessoId" = pa."id"
    JOIN "Permissao" p
      ON p."id" = pp."permissaoId"
    WHERE u."id" = ${usuario.usuarioId}
      AND pa."ativo" = true
      AND p."chave" = ${chave}
    LIMIT 1
  `
    .returnsRow({
      chave: db.sql.public.Permissao.columns.chave,
    })
    .build();

  const permissoes = await runtime.query(permissaoPlano);

  // Não possui a permissão
  if (permissoes.length === 0) {
    return null;
  }

  return usuario;
}
