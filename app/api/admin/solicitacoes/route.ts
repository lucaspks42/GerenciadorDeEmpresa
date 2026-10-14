import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";

const runtime = db.runtime();

export async function GET() {
  try {
    // Verifica se quem está fazendo a requisição é administrador
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    // Busca somente as solicitações pendentes
    const solicitacoesPlano = db.raw.sql`
  SELECT
    "id",
    "nome",
    "email",
    "criadoEm"::text AS "criadoEmTexto"
  FROM "SolicitacaoCadastro"
  WHERE "status" = 'PENDENTE'
  ORDER BY "SolicitacaoCadastro"."criadoEm" DESC
`
      .returnsRow({
        id: db.sql.public.SolicitacaoCadastro.columns.id,
        nome: db.sql.public.SolicitacaoCadastro.columns.nome,
        email: db.sql.public.SolicitacaoCadastro.columns.email,
        criadoEmTexto: "pg/text@1",
      })
      .build();

    const solicitacoes = await runtime.query(solicitacoesPlano);

    return Response.json(solicitacoes);
  } catch (erro) {
    console.error("ERRO AO LISTAR SOLICITAÇÕES:", erro);

    return Response.json(
      { erro: "Erro interno ao buscar solicitações" },
      { status: 500 },
    );
  }
}
