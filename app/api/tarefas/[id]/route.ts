import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const tarefa = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(id);

  return Response.json(tarefa);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const dados = await request.json();

  const { status } = dados;

  const resultado = db
    .prepare("UPDATE tarefas SET status = ? WHERE id = ?")
    .run(status, id);

  return Response.json({
    mensagem: "tarefa atualizada",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const resultado = db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);

  return Response.json({
    mensagem: "tarefa deletada",
  });
}
