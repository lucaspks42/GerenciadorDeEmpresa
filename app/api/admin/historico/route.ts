import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";

const runtime = db.runtime();

export async function GET(request: Request) {
  try {
    const usuarioLogado = await exigirAdministrador();

    if (!usuarioLogado || usuarioLogado.perfil !== "ADMINISTRADOR") {
      return Response.json(
        { erro: "Acesso permitido somente para administradores." },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);

    const busca = searchParams.get("busca")?.trim() || "";
    const modulo = searchParams.get("modulo") || "";
    const acao = searchParams.get("acao") || "";
    const status = searchParams.get("status") || "";
    const dataInicio = searchParams.get("dataInicio") || "";
    const dataFim = searchParams.get("dataFim") || "";

    const pagina = Math.max(
      1,
      Math.floor(Number(searchParams.get("pagina")) || 1),
    );

    const limite = 30;
    const offset = (pagina - 1) * limite;

    const plano = db.raw.sql`
      SELECT
        "id",
        "usuarioId",
        "usuarioNome",
        "modulo",
        "acao",
        "descricao",
        "entidade",
        "entidadeId",
        "dadosAnteriores",
        "dadosNovos",
        "ip",
        "userAgent",
        "status",
        "criadoEm"
      FROM "HistoricoAtividade"
      WHERE
        (
          ${busca} = ''
          OR COALESCE("usuarioNome", '') ILIKE '%' || ${busca} || '%'
          OR "descricao" ILIKE '%' || ${busca} || '%'
          OR COALESCE("entidade", '') ILIKE '%' || ${busca} || '%'
          OR COALESCE("entidadeId", '') ILIKE '%' || ${busca} || '%'
        )
        AND (${modulo} = '' OR "modulo" = ${modulo})
        AND (${acao} = '' OR "acao" = ${acao})
        AND (${status} = '' OR "status" = ${status})
        AND (
          NULLIF(${dataInicio}, '')::date IS NULL
          OR "criadoEm" >= NULLIF(${dataInicio}, '')::date
        )
        AND (
          NULLIF(${dataFim}, '')::date IS NULL
          OR "criadoEm" < (
            NULLIF(${dataFim}, '')::date + INTERVAL '1 day'
          )
        )
      ORDER BY "criadoEm" DESC, "id" DESC
      LIMIT ${limite}
      OFFSET ${offset}
    `
      .returnsRow({
        id: db.sql.public.HistoricoAtividade.columns.id,
        usuarioId: db.sql.public.HistoricoAtividade.columns.usuarioId,
        usuarioNome: db.sql.public.HistoricoAtividade.columns.usuarioNome,
        modulo: db.sql.public.HistoricoAtividade.columns.modulo,
        acao: db.sql.public.HistoricoAtividade.columns.acao,
        descricao: db.sql.public.HistoricoAtividade.columns.descricao,
        entidade: db.sql.public.HistoricoAtividade.columns.entidade,
        entidadeId: db.sql.public.HistoricoAtividade.columns.entidadeId,
        dadosAnteriores:
          db.sql.public.HistoricoAtividade.columns.dadosAnteriores,
        dadosNovos: db.sql.public.HistoricoAtividade.columns.dadosNovos,
        ip: db.sql.public.HistoricoAtividade.columns.ip,
        userAgent: db.sql.public.HistoricoAtividade.columns.userAgent,
        status: db.sql.public.HistoricoAtividade.columns.status,
        criadoEm: db.sql.public.HistoricoAtividade.columns.criadoEm,
      })
      .build();

    const atividades = await runtime.query(plano);

    return Response.json({
      atividades,
      pagina,
      limite,
      temMais: atividades.length === limite,
    });
  } catch (erro) {
    console.error("ERRO AO BUSCAR HISTÓRICO:", erro);

    return Response.json(
      { erro: "Erro ao buscar histórico de atividades." },
      { status: 500 },
    );
  }
}
