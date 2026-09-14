import db from "@/lib/db";

export async function POST(request: Request) {
  const dados = await request.json();

  const {
    nome,
    empresa,
    email,
    telefone,
    valorProduto,
    valorMensalidade,
    diaVencimento,
  } = dados;

  const resultado = db
    .prepare(
      `
      INSERT INTO clientes
      (
        nome,
        empresa,
        email,
        telefone,
        valor_produto,
        valor_mensalidade,
        dia_vencimento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      nome,
      empresa,
      email,
      telefone,
      valorProduto,
      valorMensalidade,
      diaVencimento,
    );

  const clienteId = Number(resultado.lastInsertRowid);

  return Response.json({
    id: clienteId,
    nome,
    empresa,
    email,
    telefone,
    valorProduto,
    valorMensalidade,
    diaVencimento,
  });
}

export async function GET() {
  const clientes = db.prepare("SELECT * FROM clientes").all();

  return Response.json(clientes);
}
