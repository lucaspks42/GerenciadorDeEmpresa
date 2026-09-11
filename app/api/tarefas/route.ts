import db from "@/lib/db";

export async function GET() {
  const tarefas = db.prepare("SELECT * FROM tarefas").all();

  return Response.json(tarefas);
}

export async function POST(request: Request) {
  const dados = await request.json();

  const { titulo, descricao, status } = dados;

  const resultado = db
    .prepare("INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)")
    .run(titulo, descricao, status);

  console.log(resultado);

  return Response.json({
    id: resultado.lastInsertRowid,
    titulo,
    descricao,
    status,
  });
}
