import db from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const pagamentoID = Number(id);

    const dados = await request.json();

    // ALTERAR STATUS
    if (dados.status !== undefined) {
      const resultado = db
        .prepare(
          `
          UPDATE pagamentos
          SET status = ?
          WHERE id = ?
        `,
        )
        .run(dados.status, pagamentoID);

      if (resultado.changes === 0) {
        return Response.json(
          { mensagem: "Pagamento não encontrado" },
          { status: 404 },
        );
      }

      return Response.json({
        mensagem: "Status do pagamento atualizado",
      });
    }

    // ALTERAR VALOR E DATA
    if (dados.valor !== undefined && dados.data_vencimento !== undefined) {
      const resultado = db
        .prepare(
          `
          UPDATE pagamentos
          SET valor = ?, data_vencimento = ?
          WHERE id = ?
        `,
        )
        .run(dados.valor, dados.data_vencimento, pagamentoID);

      if (resultado.changes === 0) {
        return Response.json(
          { mensagem: "Pagamento não encontrado" },
          { status: 404 },
        );
      }

      return Response.json({
        mensagem: "Pagamento alterado com sucesso",
      });
    }

    return Response.json(
      { mensagem: "Nenhuma alteração enviada" },
      { status: 400 },
    );
  } catch (erro) {
    console.error("ERRO NO PATCH:", erro);

    return Response.json(
      { mensagem: "Erro ao atualizar pagamento" },
      { status: 500 },
    );
  }
}
