import { db } from "@/src/prisma/db";
import { exigirAdministrador } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { param } from "@prisma/orm-postgres/relational-core";
import { registrarHistorico } from "@/lib/historico";

const runtime = db.runtime();

export async function GET() {
  try {
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const usuariosPlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "email",
        "telefone",
        "cpf",
        "dataNascimento",
        "cep",
        "endereco",
        "numero",
        "bairro",
        "cidade",
        "estado",
        "cargo",
        "departamento",
        "dataAdmissao",
        "perfil",
        "perfilAcessoId",
        "status",
        "administradorPrincipal"
      FROM "Usuario"
      ORDER BY "id" ASC
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
        nome: db.sql.public.Usuario.columns.nome,
        email: db.sql.public.Usuario.columns.email,
        telefone: db.sql.public.Usuario.columns.telefone,
        cpf: db.sql.public.Usuario.columns.cpf,
        dataNascimento: db.sql.public.Usuario.columns.dataNascimento,
        cep: db.sql.public.Usuario.columns.cep,
        endereco: db.sql.public.Usuario.columns.endereco,
        numero: db.sql.public.Usuario.columns.numero,
        bairro: db.sql.public.Usuario.columns.bairro,
        cidade: db.sql.public.Usuario.columns.cidade,
        estado: db.sql.public.Usuario.columns.estado,
        cargo: db.sql.public.Usuario.columns.cargo,
        departamento: db.sql.public.Usuario.columns.departamento,
        dataAdmissao: db.sql.public.Usuario.columns.dataAdmissao,
        perfil: db.sql.public.Usuario.columns.perfil,
        perfilAcessoId: db.sql.public.Usuario.columns.perfilAcessoId,
        status: db.sql.public.Usuario.columns.status,
        administradorPrincipal:
          db.sql.public.Usuario.columns.administradorPrincipal,
      })
      .build();

    const usuarios = await runtime.query(usuariosPlano);

    return Response.json(usuarios);
  } catch (erro) {
    console.error("ERRO AO LISTAR USUÁRIOS:", erro);

    return Response.json(
      { erro: "Erro interno ao buscar usuários" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const dados = await request.json();

    const nome = dados.nome?.trim();
    const email = dados.email?.toLowerCase().trim();
    const telefone = dados.telefone?.trim() || null;
    const senha = dados.senha;

    if (!nome || !email || !senha) {
      return Response.json(
        { erro: "Preencha todos os campos" },
        { status: 400 },
      );
    }

    const cadastrarUsuario = db.raw.sql`
      SELECT "id"
      FROM "Usuario"
      WHERE "email" = ${email}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuarioExistente = await runtime.query(cadastrarUsuario);

    if (usuarioExistente[0]) {
      return Response.json(
        { erro: "Este email já está cadastrado" },
        { status: 409 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const perfil = "FUNCIONARIO";

    const inserirPlano = db.raw.sql`
      INSERT INTO "Usuario"
      (
        "nome",
        "email",
        "telefone",
        "senha",
        "perfil",
        "status"
      )
      VALUES
      (
        ${nome},
        ${email},
        ${telefone},
        ${senhaHash},
        ${param(perfil, {
          codecId: db.sql.public.Usuario.columns.perfil.codecId,
        })},
        ${param(true, {
          codecId: db.sql.public.Usuario.columns.status.codecId,
        })}
      )
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuariosCriados = await runtime.query(inserirPlano);
    const usuarioCriado = usuariosCriados[0];

    if (!usuarioCriado) {
      return Response.json(
        { erro: "Não foi possível criar o funcionário" },
        { status: 500 },
      );
    }

    // REGISTRAR ATIVIDADE
    await registrarHistorico({
      usuario: {
        id: usuario.usuarioId,
        nome: usuario.nome,
      },
      request,
      modulo: "USUARIOS",
      acao: "CADASTRO",
      descricao: `Cadastrou o funcionário ${nome}`,
      entidade: "Usuario",
      entidadeId: String(usuarioCriado.id),
      dadosNovos: {
        nome,
        email,
        telefone,
        perfil,
        status: true,
      },
    });

    return Response.json(
      {
        mensagem: "Funcionário criado com sucesso",
        id: usuarioCriado.id,
        nome,
        email,
        telefone,
        perfil,
        perfilAcessoId: null,
        status: true,
      },
      { status: 201 },
    );
  } catch (erro) {
    console.error("ERRO AO CRIAR USUÁRIO:", erro);

    return Response.json(
      { erro: "Erro interno ao criar funcionário" },
      { status: 500 },
    );
  }
}
