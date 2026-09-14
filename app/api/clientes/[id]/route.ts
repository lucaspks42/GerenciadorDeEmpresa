import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const resultado = db.prepare("DELETE FROM clientes WHERE id = ?").run(id);

  return Response.json({
    mensagem: "cliente deletado",
  });
}
