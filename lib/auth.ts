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
      "id",
      "usuarioId"
    FROM "Sessao"
    WHERE "token" = ${token}
    AND "expiraEm" > NOW()
  `
    .returnsRow({
      id: db.sql.public.Sessao.columns.id,
      usuarioId: db.sql.public.Sessao.columns.usuarioId,
    })
    .build();

  const [sessao] = await runtime.query(sessaoPlano);

  if (!sessao) {
    return null;
  }

  return sessao;
}
