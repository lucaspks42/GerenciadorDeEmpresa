import db from "@/lib/db";

export async function POST(request: Request) {
  const dados = await request.json();

  const { nome, empresa, email, telefone } = dados;

  const resultado = db
    .prepare(
      "INSERT INTO clientes (nome, empresa, email, telefone) VALUES (?, ?, ?, ?)",
    )
    .run(nome, empresa, email, telefone);

  console.log(resultado);

  return Response.json({
    id: resultado.lastInsertRowid,
    nome,
    empresa,
    email,
    telefone,
  });
}

export async function GET() {
  const clientes = db.prepare("SELECT * FROM clientes").all();

  return Response.json(clientes);
}

