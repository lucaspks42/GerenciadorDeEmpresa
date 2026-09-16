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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dados = await request.json();

    const { id } = await params;
    const clienteId = Number(id);

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
      .get(clienteId) as
      | {
          valor_produto: number | null;
          valor_mensalidade: number | null;
          dia_vencimento: number | null;
        }
      | undefined;

    if (!clienteAtual) {
      return Response.json({ erro: "Cliente não encontrado" }, { status: 404 });
    }

    const novoValorMensalidade =
      valorMensalidade ?? clienteAtual.valor_mensalidade;

    const novoDiaVencimento = diaVencimento ?? clienteAtual.dia_vencimento;

    // Verifica se a configuração da mensalidade mudou
    const mensalidadeMudou =
      novoValorMensalidade !== clienteAtual.valor_mensalidade ||
      novoDiaVencimento !== clienteAtual.dia_vencimento;

    const resultado = db
      .prepare(
        `
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
      `,
      )
      .run(
        nome,
        empresa,
        email,
        telefone,
        valorProduto ?? clienteAtual.valor_produto,
        novoValorMensalidade,
        novoDiaVencimento,
        clienteId,
      );

    console.log("RESULTADO:", resultado);

    // Se a mensalidade ou o dia de vencimento mudou,
    // remove somente os pagamentos pendentes futuros.
    if (mensalidadeMudou) {
      const hoje = new Date();

      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");

      const dataHoje = `${ano}-${mes}-${dia}`;

      db.prepare(
        `
        DELETE FROM pagamentos
        WHERE cliente_id = ?
        AND status = 'Pendente'
        AND data_vencimento >= ?
      `,
      ).run(clienteId, dataHoje);
    }

    return Response.json({
      mensagem: "Cliente atualizado com sucesso",
    });
  } catch (erro) {
    console.error("ERRO NO PATCH:", erro);

    return Response.json(
      { erro: "Erro ao atualizar cliente" },
      { status: 500 },
    );
  }
}
