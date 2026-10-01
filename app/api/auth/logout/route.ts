import { cookies } from "next/headers";
import { db } from "@/src/prisma/db";

const runtime = db.runtime();

export async function POST() {
  const cookieStore = await cookies();

  const token = cookieStore.get("sessao")?.value;

  if (!token) {
    return Response.json({
      mensagem: "Sessão encerrada",
    });
  }

  const excluirSessaoPlano = db.raw.sql`
  DELETE FROM "Sessao"
  WHERE "token" = ${token}
  RETURNING "id"
`
    .returnsRow({
      id: db.sql.public.Sessao.columns.id,
    })
    .build();

  await runtime.query(excluirSessaoPlano);
  cookieStore.delete("sessao");

  return Response.json({
    mensagem: "Logout realizado com sucesso",
  });
}
