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
export async function GET() {
  const clientes = db.prepare("SELECT * FROM clientes").all();

  return Response.json(clientes);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const dados = await request.json();

    const { id } = await params;

    const {
      nome,
      empresa,
      email,
      telefone,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    } = dados;

    console.log("ID:", id);
    console.log("DADOS:", dados);

    const clienteAtual = db
      .prepare("SELECT * FROM clientes WHERE id = ?")
      .get(Number(id)) as {
        valor_produto: number | null;
        valor_mensalidade: number | null;
        dia_vencimento: number | null;
      } | undefined;

    if (!clienteAtual) {
      return Response.json(
        { erro: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const resultado = db
      .prepare(`
        UPDATE clientes
        SET
          nome = ?,
          empresa = ?,
          email = ?,
          telefone = ?,
          valor_produto = ?,
          valor_mensalidade = ?,
          dia_vencimento = ?
        WHERE id = ?
      `)
      .run(
        nome,
        empresa,
        email,
        telefone,
        valorProduto ?? clienteAtual.valor_produto,
        valorMensalidade ?? clienteAtual.valor_mensalidade,
        diaVencimento ?? clienteAtual.dia_vencimento,
        Number(id)
      );

    console.log("RESULTADO:", resultado);

    return Response.json({
      mensagem: "Cliente atualizado com sucesso",
    });
  } catch (erro) {
    console.error("ERRO NO PATCH:", erro);

    return Response.json(
      { erro: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}