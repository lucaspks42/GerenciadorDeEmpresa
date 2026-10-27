import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";
import { Temporal } from "@js-temporal/polyfill";

const runtime = db.runtime();

function converterData(valor: string | null | undefined) {
  if (!valor) return null;

  try {
    return Temporal.Instant.from(`${valor}T00:00:00Z`);
  } catch {
    throw new Error("Data inválida");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuarioLogado = await exigirAdministrador();

    if (!usuarioLogado) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const usuarioId = Number(id);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return Response.json({ erro: "ID de usuário inválido" }, { status: 400 });
    }

    const dados = await request.json();

    const {
      nome,
      email,
      telefone,
      cpf,
      dataNascimento,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cargo,
      departamento,
      dataAdmissao,
      perfil,
      perfilAcessoId,
      status,
    } = dados;

    // Verifica se o campo perfilAcessoId foi enviado.
    const perfilAcessoFoiEnviado = Object.prototype.hasOwnProperty.call(
      dados,
      "perfilAcessoId",
    );

    // Valida o ID do perfil de acesso.
    if (
      perfilAcessoFoiEnviado &&
      perfilAcessoId !== null &&
      (typeof perfilAcessoId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          perfilAcessoId,
        ))
    ) {
      return Response.json(
        { erro: "ID do perfil de acesso inválido" },
        { status: 400 },
      );
    }

    // Valida o status.
    if (status !== undefined && typeof status !== "boolean") {
      return Response.json(
        { erro: "Status de usuário inválido" },
        { status: 400 },
      );
    }

    // Valida o perfil de usuário.
    if (
      perfil !== undefined &&
      perfil !== "ADMINISTRADOR" &&
      perfil !== "FUNCIONARIO"
    ) {
      return Response.json(
        { erro: "Perfil de usuário inválido" },
        { status: 400 },
      );
    }

    // Nome e e-mail são obrigatórios.
    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return Response.json(
        { erro: "Nome e e-mail são obrigatórios" },
        { status: 400 },
      );
    }

    // Busca o usuário que será atualizado.
    const usuarioEncontradoPlano = db.raw.sql`
      SELECT
        "id",
        "email",
        "perfil",
        "administradorPrincipal"
      FROM "Usuario"
      WHERE "id" = ${usuarioId}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
        email: db.sql.public.Usuario.columns.email,
        perfil: db.sql.public.Usuario.columns.perfil,
        administradorPrincipal:
          db.sql.public.Usuario.columns.administradorPrincipal,
      })
      .build();

    const usuariosEncontrados = await runtime.query(usuarioEncontradoPlano);

    const usuarioAtual = usuariosEncontrados[0];

    if (!usuarioAtual) {
      return Response.json({ erro: "Usuário não encontrado" }, { status: 404 });
    }

    // Protege o administrador principal.
    if (usuarioAtual.administradorPrincipal && perfil === "FUNCIONARIO") {
      return Response.json(
        {
          erro: "O administrador principal não pode ser rebaixado",
        },
        { status: 403 },
      );
    }

    // Impede que o administrador rebaixe a própria conta.
    if (
      usuarioLogado.email?.toLowerCase() === usuarioAtual.email.toLowerCase() &&
      perfil === "FUNCIONARIO"
    ) {
      return Response.json(
        {
          erro: "Você não pode rebaixar seu próprio perfil",
        },
        { status: 403 },
      );
    }

    // Protege os dados do administrador principal.
    if (
      usuarioAtual.administradorPrincipal &&
      usuarioLogado.email?.toLowerCase() !== usuarioAtual.email.toLowerCase()
    ) {
      return Response.json(
        {
          erro: "Apenas o próprio administrador principal pode editar seus dados",
        },
        { status: 403 },
      );
    }

    // Verifica se o perfil de acesso existe e está ativo.
    if (perfilAcessoFoiEnviado && perfilAcessoId) {
      const buscarPerfilPlano = db.raw.sql`
        SELECT "id"
        FROM "PerfilAcesso"
        WHERE "id" = ${perfilAcessoId}
          AND "ativo" = true
      `
        .returnsRow({
          id: db.sql.public.PerfilAcesso.columns.id,
        })
        .build();

      const perfilEncontrado = await runtime.query(buscarPerfilPlano);

      if (!perfilEncontrado[0]) {
        return Response.json(
          {
            erro: "Perfil de acesso não encontrado ou inativo",
          },
          { status: 400 },
        );
      }
    }

    // Normaliza os dados.
    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = cpf?.replace(/\D/g, "") || null;
    const telefoneNormalizado = telefone?.trim() || null;
    const cepNormalizado = cep?.replace(/\D/g, "") || null;

    // Verifica e-mail duplicado.
    const emailDuplicadoPlano = db.raw.sql`
      SELECT "id"
      FROM "Usuario"
      WHERE "email" = ${emailNormalizado}
        AND "id" != ${usuarioId}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const emailsEncontrados = await runtime.query(emailDuplicadoPlano);

    if (emailsEncontrados[0]) {
      return Response.json(
        { erro: "Este e-mail já está cadastrado" },
        { status: 409 },
      );
    }

    // Verifica CPF duplicado.
    if (cpfNormalizado) {
      const cpfDuplicadoPlano = db.raw.sql`
        SELECT "id"
        FROM "Usuario"
        WHERE "cpf" = ${cpfNormalizado}
          AND "id" != ${usuarioId}
      `
        .returnsRow({
          id: db.sql.public.Usuario.columns.id,
        })
        .build();

      const cpfsEncontrados = await runtime.query(cpfDuplicadoPlano);

      if (cpfsEncontrados[0]) {
        return Response.json(
          { erro: "Este CPF já está cadastrado" },
          { status: 409 },
        );
      }
    }

    // Parâmetros tipados.
    const nomeParametro = param(nome.trim(), {
      codecId: db.sql.public.Usuario.columns.nome.codecId,
    });

    const emailParametro = param(emailNormalizado, {
      codecId: db.sql.public.Usuario.columns.email.codecId,
    });

    const telefoneParametro = param(telefoneNormalizado, {
      codecId: db.sql.public.Usuario.columns.telefone.codecId,
    });

    const cpfParametro = param(cpfNormalizado, {
      codecId: db.sql.public.Usuario.columns.cpf.codecId,
    });

    const dataNascimentoParametro = param(converterData(dataNascimento), {
      codecId: db.sql.public.Usuario.columns.dataNascimento.codecId,
    });

    const cepParametro = param(cepNormalizado, {
      codecId: db.sql.public.Usuario.columns.cep.codecId,
    });

    const enderecoParametro = param(endereco?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.endereco.codecId,
    });

    const numeroParametro = param(numero?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.numero.codecId,
    });

    const bairroParametro = param(bairro?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.bairro.codecId,
    });

    const cidadeParametro = param(cidade?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.cidade.codecId,
    });

    const estadoParametro = param(estado?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.estado.codecId,
    });

    const cargoParametro = param(cargo?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.cargo.codecId,
    });

    const departamentoParametro = param(departamento?.trim() || null, {
      codecId: db.sql.public.Usuario.columns.departamento.codecId,
    });

    const dataAdmissaoParametro = param(converterData(dataAdmissao), {
      codecId: db.sql.public.Usuario.columns.dataAdmissao.codecId,
    });

    const perfilParametro = param(perfil ?? null, {
      codecId: db.sql.public.Usuario.columns.perfil.codecId,
    });

    const statusParametro = param(status ?? null, {
      codecId: db.sql.public.Usuario.columns.status.codecId,
    });

    // Parâmetro do perfil de acesso.
    const perfilAcessoIdParametro = param(perfilAcessoId ?? null, {
      codecId: db.sql.public.Usuario.columns.perfilAcessoId.codecId,
    });

    // Informa se o campo foi enviado na requisição.
    const perfilAcessoFoiEnviadoParametro = param(perfilAcessoFoiEnviado, {
      codecId: db.sql.public.Usuario.columns.status.codecId,
    });

    // Atualiza os dados do usuário, incluindo o perfil de acesso.
    const atualizarUsuarioPlano = db.raw.sql`
      UPDATE "Usuario"
      SET
        "nome" = ${nomeParametro},
        "email" = ${emailParametro},
        "telefone" = ${telefoneParametro},
        "cpf" = ${cpfParametro},
        "dataNascimento" = ${dataNascimentoParametro},
        "cep" = ${cepParametro},
        "endereco" = ${enderecoParametro},
        "numero" = ${numeroParametro},
        "bairro" = ${bairroParametro},
        "cidade" = ${cidadeParametro},
        "estado" = ${estadoParametro},
        "cargo" = ${cargoParametro},
        "departamento" = ${departamentoParametro},
        "dataAdmissao" = ${dataAdmissaoParametro},

        "perfil" = COALESCE(
          ${perfilParametro},
          "perfil"
        ),

        "perfilAcessoId" = CASE
          WHEN ${perfilAcessoFoiEnviadoParametro}
          THEN ${perfilAcessoIdParametro}
          ELSE "perfilAcessoId"
        END,

        "status" = COALESCE(
          ${statusParametro},
          "status"
        )

      WHERE "id" = ${usuarioId}

      RETURNING
        "id",
        "perfilAcessoId"
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
        perfilAcessoId: db.sql.public.Usuario.columns.perfilAcessoId,
      })
      .build();

    const usuarioAtualizado = await runtime.query(atualizarUsuarioPlano);

    if (!usuarioAtualizado[0]) {
      return Response.json(
        { erro: "Não foi possível atualizar o usuário" },
        { status: 500 },
      );
    }

    return Response.json({
      mensagem: "Usuário atualizado com sucesso",
      usuario: {
        id: usuarioAtualizado[0].id,
        perfilAcessoId: usuarioAtualizado[0].perfilAcessoId,
      },
    });
  } catch (erro) {
    console.error("ERRO AO ATUALIZAR USUÁRIO:", erro);

    if (erro instanceof Error && erro.message === "Data inválida") {
      return Response.json(
        { erro: "Uma das datas informadas é inválida" },
        { status: 400 },
      );
    }

    return Response.json(
      { erro: "Erro interno ao atualizar usuário" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuarioLogado = await exigirAdministrador();

    if (!usuarioLogado) {
      return Response.json({ erro: "Acesso negado." }, { status: 403 });
    }

    const { id } = await params;
    const usuarioId = Number(id);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return Response.json(
        { erro: "ID de usuário inválido." },
        { status: 400 },
      );
    }

    // Busca o usuário que será excluído.
    const buscarUsuarioPlano = db.raw.sql`
      SELECT
        "id",
        "email",
        "administradorPrincipal"
      FROM "Usuario"
      WHERE "id" = ${usuarioId}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
        email: db.sql.public.Usuario.columns.email,
        administradorPrincipal:
          db.sql.public.Usuario.columns.administradorPrincipal,
      })
      .build();

    const usuariosEncontrados = await runtime.query(buscarUsuarioPlano);

    const usuarioEncontrado = usuariosEncontrados[0];

    if (!usuarioEncontrado) {
      return Response.json(
        { erro: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    // Impede a exclusão do administrador principal.
    if (usuarioEncontrado.administradorPrincipal) {
      return Response.json(
        {
          erro: "O administrador principal não pode ser excluído.",
        },
        { status: 403 },
      );
    }

    // Impede que o administrador exclua a própria conta.
    if (
      usuarioLogado.email?.toLowerCase() ===
      usuarioEncontrado.email?.toLowerCase()
    ) {
      return Response.json(
        {
          erro: "Você não pode excluir sua própria conta.",
        },
        { status: 403 },
      );
    }

    // Primeiro, exclui as sessões vinculadas ao usuário.
    const excluirSessoesPlano = db.raw.sql`
      DELETE FROM "Sessao"
      WHERE "usuarioId" = ${usuarioId}
      RETURNING "usuarioId"
    `
      .returnsRow({
        usuarioId: db.sql.public.Sessao.columns.usuarioId,
      })
      .build();

    await runtime.query(excluirSessoesPlano);

    // Depois, exclui o usuário.
    const excluirUsuarioPlano = db.raw.sql`
      DELETE FROM "Usuario"
      WHERE "id" = ${usuarioId}
        AND "administradorPrincipal" IS NOT TRUE
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuarioExcluido = await runtime.query(excluirUsuarioPlano);

    if (!usuarioExcluido[0]) {
      return Response.json(
        { erro: "Não foi possível excluir o usuário." },
        { status: 404 },
      );
    }

    return Response.json({
      mensagem: "Usuário excluído com sucesso.",
      id: usuarioExcluido[0].id,
    });
  } catch (erro) {
    console.error("ERRO AO DELETAR USUÁRIO:", erro);

    return Response.json(
      { erro: "Erro interno ao excluir usuário." },
      { status: 500 },
    );
  }
}
