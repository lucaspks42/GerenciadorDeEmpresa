import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";

const runtime = db.runtime();

type Responsavel = {
  id?: number | null;
  nome?: string | null;
};

type RegistrarHistoricoParams = {
  usuario: Responsavel;
  request: Request;
  modulo: string;
  acao: string;
  descricao: string;
  entidade?: string | null;
  entidadeId?: string | null;
  dadosAnteriores?: Record<string, unknown> | null;
  dadosNovos?: Record<string, unknown> | null;
  status?: string;
};

export async function registrarHistorico({
  usuario,
  request,
  modulo,
  acao,
  descricao,
  entidade = null,
  entidadeId = null,
  dadosAnteriores = null,
  dadosNovos = null,
  status = "SUCESSO",
}: RegistrarHistoricoParams): Promise<void> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const userAgent = request.headers.get("user-agent") || null;

    const inserirPlano = db.raw.sql`
      INSERT INTO "HistoricoAtividade"
      (
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
        "status"
      )
      VALUES
      (
        ${param(usuario.id ?? null, {
          codecId: db.sql.public.HistoricoAtividade.columns.usuarioId.codecId,
        })},
        ${param(usuario.nome ?? null, {
          codecId: db.sql.public.HistoricoAtividade.columns.usuarioNome.codecId,
        })},
        ${param(modulo, {
          codecId: db.sql.public.HistoricoAtividade.columns.modulo.codecId,
        })},
        ${param(acao, {
          codecId: db.sql.public.HistoricoAtividade.columns.acao.codecId,
        })},
        ${param(descricao, {
          codecId: db.sql.public.HistoricoAtividade.columns.descricao.codecId,
        })},
        ${param(entidade, {
          codecId: db.sql.public.HistoricoAtividade.columns.entidade.codecId,
        })},
        ${param(entidadeId, {
          codecId: db.sql.public.HistoricoAtividade.columns.entidadeId.codecId,
        })},
        ${param(dadosAnteriores, {
          codecId:
            db.sql.public.HistoricoAtividade.columns.dadosAnteriores.codecId,
        })},
        ${param(dadosNovos, {
          codecId: db.sql.public.HistoricoAtividade.columns.dadosNovos.codecId,
        })},
        ${param(ip, {
          codecId: db.sql.public.HistoricoAtividade.columns.ip.codecId,
        })},
        ${param(userAgent, {
          codecId: db.sql.public.HistoricoAtividade.columns.userAgent.codecId,
        })},
        ${param(status, {
          codecId: db.sql.public.HistoricoAtividade.columns.status.codecId,
        })}
      )
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.HistoricoAtividade.columns.id,
      })
      .build();

    await runtime.query(inserirPlano);
  } catch (erro) {
    // Uma falha no histórico não deve transformar
    // um cadastro concluído em uma resposta de erro.
    console.error("ERRO AO REGISTRAR HISTÓRICO:", erro);
  }
}
