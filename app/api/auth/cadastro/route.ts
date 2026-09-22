import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { nome, email, senha } = dados;

    if (!nome || !email || !senha) {
      return Response.json(
        {
          erro: "Preencha todos os campos",
        },
        { status: 400 },
      );
    }

    const usuarioExistente = db
      .prepare("SELECT id FROM usuarios WHERE email = ?")
      .get(email);

    if (usuarioExistente) {
      return Response.json(
        {
          erro: "Este e-mail já está cadastrado",
        },
        { status: 409 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = db
      .prepare(
        `
          INSERT INTO usuarios
          (nome, email, senha)
          VALUES (?, ?, ?)
        `,
      )
      .run(nome, email, senhaHash);

    return Response.json(
      {
        mensagem: "Usuário cadastrado com sucesso",
        id: Number(resultado.lastInsertRowid),
      },
      { status: 201 },
    );
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);

    return Response.json(
      {
        erro: "Erro interno ao cadastrar usuário",
      },
      { status: 500 },
    );
  }
}
