import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function GET() {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const plano = db.raw.sql`
      SELECT
        m."id" AS "moduloId",
        m."nome" AS "moduloNome",
        m."slug" AS "moduloSlug",
        m."descricao" AS "moduloDescricao",
        m."ativo" AS "moduloAtivo",
        p."id" AS "permissaoId",
        p."chave" AS "permissaoChave",
        p."nome" AS "permissaoNome",
        p."descricao" AS "permissaoDescricao"
      FROM "Modulo" m
      LEFT JOIN "Permissao" p
        ON p."moduloId" = m."id"
      WHERE m."ativo" = true
      ORDER BY m."nome", p."nome"
    `
      .returnsRow({
        moduloId: db.sql.public.Modulo.columns.id,
        moduloNome: db.sql.public.Modulo.columns.nome,
        moduloSlug: db.sql.public.Modulo.columns.slug,
        moduloDescricao: db.sql.public.Modulo.columns.descricao,
        moduloAtivo: db.sql.public.Modulo.columns.ativo,
        permissaoId: db.sql.public.Permissao.columns.id,
        permissaoChave: db.sql.public.Permissao.columns.chave,
        permissaoNome: db.sql.public.Permissao.columns.nome,
        permissaoDescricao: db.sql.public.Permissao.columns.descricao,
      })
      .build();

    const resultados = await runtime.query(plano);

    const modulos = new Map<
      string,
      {
        id: string;
        nome: string;
        slug: string;
        descricao: string | null;
        permissoes: {
          id: string;
          chave: string;
          nome: string;
          descricao: string | null;
        }[];
      }
    >();

    for (const item of resultados) {
      if (!modulos.has(item.moduloId)) {
        modulos.set(item.moduloId, {
          id: item.moduloId,
          nome: item.moduloNome,
          slug: item.moduloSlug,
          descricao: item.moduloDescricao,
          permissoes: [],
        });
      }

      if (item.permissaoId) {
        modulos.get(item.moduloId)!.permissoes.push({
          id: item.permissaoId,
          chave: item.permissaoChave!,
          nome: item.permissaoNome!,
          descricao: item.permissaoDescricao,
        });
      }
    }

    return Response.json(Array.from(modulos.values()));
  } catch (erro) {
    console.error("ERRO AO LISTAR PERMISSÕES:", erro);

    return Response.json(
      { erro: "Erro ao carregar módulos e permissões" },
      { status: 500 },
    );
  }
}
