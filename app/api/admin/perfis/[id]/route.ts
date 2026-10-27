import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";

const runtime = db.runtime();

const visualizacoesPermitidas = ["todos", "proprios", "setor", "atribuidos"];

const regexUuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function validarId(id: string): boolean {
  return regexUuid.test(id);
}

function respostaErro(mensagem: string, status: number) {
  return Response.json({ erro: mensagem }, { status });
}

function validarListaPermissoes(valor: unknown): valor is string[] {
  return (
    Array.isArray(valor) &&
    valor.every((chave) => typeof chave === "string" && chave.trim().length > 0)
  );
}

// ==========================================
// BUSCAR PERMISSÕES DE UM PERFIL
// ==========================================

async function buscarPermissoesPerfil(perfilId: string) {
  const perfilIdParametro = param(perfilId, {
    codecId: db.sql.public.PerfilPermissao.columns.perfilAcessoId.codecId,
  });

  const buscarPermissoesPlano = db.raw.sql`
    SELECT
      "p"."id",
      "p"."chave",
      "p"."nome",
      "p"."descricao",
      "p"."moduloId",
      "m"."nome" AS "moduloNome",
      "m"."slug" AS "moduloSlug"
    FROM "PerfilPermissao" "pp"
    INNER JOIN "Permissao" "p"
      ON "p"."id" = "pp"."permissaoId"
    INNER JOIN "Modulo" "m"
      ON "m"."id" = "p"."moduloId"
    WHERE "pp"."perfilAcessoId" = ${perfilIdParametro}
    ORDER BY "m"."nome", "p"."nome"
  `
    .returnsRow({
      id: db.sql.public.Permissao.columns.id,
      chave: db.sql.public.Permissao.columns.chave,
      nome: db.sql.public.Permissao.columns.nome,
      descricao: db.sql.public.Permissao.columns.descricao,
      moduloId: db.sql.public.Permissao.columns.moduloId,
      moduloNome: db.sql.public.Modulo.columns.nome,
      moduloSlug: db.sql.public.Modulo.columns.slug,
    })
    .build();

  return runtime.query(buscarPermissoesPlano);
}

// ==========================================
// GET - BUSCAR PERFIL POR ID
// ==========================================

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return respostaErro("Acesso negado", 403);
    }

    const { id } = await params;

    if (!validarId(id)) {
      return respostaErro("ID de perfil inválido", 400);
    }

    const idParametro = param(id, {
      codecId: db.sql.public.PerfilAcesso.columns.id.codecId,
    });

    const buscarPerfilPlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "descricao",
        "ativo",
        "permissoesVizualizacao",
        "observacoes",
        "createdAt",
        "updatedAt"
      FROM "PerfilAcesso"
      WHERE "id" = ${idParametro}
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
        nome: db.sql.public.PerfilAcesso.columns.nome,
        descricao: db.sql.public.PerfilAcesso.columns.descricao,
        ativo: db.sql.public.PerfilAcesso.columns.ativo,
        permissoesVizualizacao:
          db.sql.public.PerfilAcesso.columns.permissoesVizualizacao,
        observacoes: db.sql.public.PerfilAcesso.columns.observacoes,
        createdAt: db.sql.public.PerfilAcesso.columns.createdAt,
        updatedAt: db.sql.public.PerfilAcesso.columns.updatedAt,
      })
      .build();

    const perfis = await runtime.query(buscarPerfilPlano);
    const perfil = perfis[0];

    if (!perfil) {
      return respostaErro("Perfil não encontrado", 404);
    }

    const permissoes = await buscarPermissoesPerfil(id);

    return Response.json({
      ...perfil,
      permissoes,
    });
  } catch (erro) {
    console.error("ERRO AO BUSCAR PERFIL:", erro);

    return respostaErro("Erro interno ao buscar perfil", 500);
  }
}

// ==========================================
// PATCH - EDITAR PERFIL
// ==========================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return respostaErro("Acesso negado", 403);
    }

    const { id } = await params;

    if (!validarId(id)) {
      return respostaErro("ID de perfil inválido", 400);
    }

    // ------------------------------------------
    // LER JSON
    // ------------------------------------------

    let dados: Record<string, unknown>;

    try {
      const corpo: unknown = await request.json();

      if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
        return respostaErro("Dados enviados inválidos", 400);
      }

      dados = corpo as Record<string, unknown>;
    } catch {
      return respostaErro("Corpo da requisição inválido", 400);
    }

    const {
      nome,
      descricao,
      ativo,
      permissoesVizualizacao,
      observacoes,
      permissoes,
    } = dados;

    // ------------------------------------------
    // VALIDAÇÕES
    // ------------------------------------------

    if (
      nome !== undefined &&
      (typeof nome !== "string" || !nome.trim() || nome.trim().length > 100)
    ) {
      return respostaErro("Nome do perfil inválido", 400);
    }

    if (
      descricao !== undefined &&
      descricao !== null &&
      (typeof descricao !== "string" || descricao.trim().length > 500)
    ) {
      return respostaErro("Descrição inválida", 400);
    }

    if (ativo !== undefined && typeof ativo !== "boolean") {
      return respostaErro("Status do perfil inválido", 400);
    }

    if (
      permissoesVizualizacao !== undefined &&
      (typeof permissoesVizualizacao !== "string" ||
        !visualizacoesPermitidas.includes(permissoesVizualizacao))
    ) {
      return respostaErro("Regra de visualização inválida", 400);
    }

    if (
      observacoes !== undefined &&
      observacoes !== null &&
      (typeof observacoes !== "string" || observacoes.trim().length > 300)
    ) {
      return respostaErro("Observações inválidas", 400);
    }

    if (permissoes !== undefined && !validarListaPermissoes(permissoes)) {
      return respostaErro("A lista de permissões é inválida", 400);
    }

    // Remove chaves repetidas.
    const chavesPermissoes =
      permissoes === undefined
        ? undefined
        : [...new Set(permissoes.map((chave) => chave.trim()))];

    // ------------------------------------------
    // BUSCAR PERFIL ATUAL
    // ------------------------------------------

    const idParametro = param(id, {
      codecId: db.sql.public.PerfilAcesso.columns.id.codecId,
    });

    const buscarPerfilPlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "descricao",
        "ativo",
        "permissoesVizualizacao",
        "observacoes"
      FROM "PerfilAcesso"
      WHERE "id" = ${idParametro}
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
        nome: db.sql.public.PerfilAcesso.columns.nome,
        descricao: db.sql.public.PerfilAcesso.columns.descricao,
        ativo: db.sql.public.PerfilAcesso.columns.ativo,
        permissoesVizualizacao:
          db.sql.public.PerfilAcesso.columns.permissoesVizualizacao,
        observacoes: db.sql.public.PerfilAcesso.columns.observacoes,
      })
      .build();

    const perfisEncontrados = await runtime.query(buscarPerfilPlano);
    const perfilAtual = perfisEncontrados[0];

    if (!perfilAtual) {
      return respostaErro("Perfil não encontrado", 404);
    }

    // ------------------------------------------
    // BUSCAR PERMISSÕES ATUAIS
    // ------------------------------------------

    const permissoesAtuais = await buscarPermissoesPerfil(id);

    const chavesAnteriores = permissoesAtuais.map(
      (permissao) => permissao.chave,
    );

    // ------------------------------------------
    // VERIFICAR NOME DUPLICADO
    // ------------------------------------------

    const nomeFinal =
      nome === undefined ? perfilAtual.nome : (nome as string).trim();

    if (nome !== undefined) {
      const nomeParametro = param(nomeFinal, {
        codecId: db.sql.public.PerfilAcesso.columns.nome.codecId,
      });

      const duplicadoPlano = db.raw.sql`
        SELECT "id"
        FROM "PerfilAcesso"
        WHERE LOWER("nome") = LOWER(${nomeParametro})
          AND "id" != ${idParametro}
        LIMIT 1
      `
        .returnsRow({
          id: db.sql.public.PerfilAcesso.columns.id,
        })
        .build();

      const duplicados = await runtime.query(duplicadoPlano);

      if (duplicados[0]) {
        return respostaErro("Já existe outro perfil com esse nome", 409);
      }
    }

    // ------------------------------------------
    // VALIDAR PERMISSÕES ANTES DE ATUALIZAR
    // ------------------------------------------

    const permissoesEncontradas: string[] = [];

    if (chavesPermissoes !== undefined) {
      for (const chave of chavesPermissoes) {
        const chaveParametro = param(chave, {
          codecId: db.sql.public.Permissao.columns.chave.codecId,
        });

        const buscarPermissaoPlano = db.raw.sql`
          SELECT "id", "chave"
          FROM "Permissao"
          WHERE "chave" = ${chaveParametro}
          LIMIT 1
        `
          .returnsRow({
            id: db.sql.public.Permissao.columns.id,
            chave: db.sql.public.Permissao.columns.chave,
          })
          .build();

        const resultado = await runtime.query(buscarPermissaoPlano);

        if (!resultado[0]) {
          return respostaErro(`Permissão não encontrada: ${chave}`, 400);
        }

        permissoesEncontradas.push(resultado[0].id);
      }
    }

    // ------------------------------------------
    // PREPARAR DADOS
    // ------------------------------------------

    const descricaoFinal =
      descricao === undefined
        ? perfilAtual.descricao
        : typeof descricao === "string"
          ? descricao.trim() || null
          : null;

    const ativoFinal =
      ativo === undefined ? perfilAtual.ativo : (ativo as boolean);

    const visualizacaoFinal =
      permissoesVizualizacao === undefined
        ? perfilAtual.permissoesVizualizacao
        : (permissoesVizualizacao as string);

    const observacoesFinal =
      observacoes === undefined
        ? perfilAtual.observacoes
        : typeof observacoes === "string"
          ? observacoes.trim() || null
          : null;

    const nomeParametro = param(nomeFinal, {
      codecId: db.sql.public.PerfilAcesso.columns.nome.codecId,
    });

    const descricaoParametro = param(descricaoFinal, {
      codecId: db.sql.public.PerfilAcesso.columns.descricao.codecId,
    });

    const ativoParametro = param(ativoFinal, {
      codecId: db.sql.public.PerfilAcesso.columns.ativo.codecId,
    });

    const visualizacaoParametro = param(visualizacaoFinal, {
      codecId:
        db.sql.public.PerfilAcesso.columns.permissoesVizualizacao.codecId,
    });

    const observacoesParametro = param(observacoesFinal, {
      codecId: db.sql.public.PerfilAcesso.columns.observacoes.codecId,
    });

    const agora = new Date();

    const agoraParametro = param(agora, {
      codecId: db.sql.public.PerfilAcesso.columns.updatedAt.codecId,
    });

    // ------------------------------------------
    // ATUALIZAR DADOS DO PERFIL
    // ------------------------------------------

    const atualizarPerfilPlano = db.raw.sql`
      UPDATE "PerfilAcesso"
      SET
        "nome" = ${nomeParametro},
        "descricao" = ${descricaoParametro},
        "ativo" = ${ativoParametro},
        "permissoesVizualizacao" = ${visualizacaoParametro},
        "observacoes" = ${observacoesParametro},
        "updatedAt" = ${agoraParametro}
      WHERE "id" = ${idParametro}
      RETURNING
        "id",
        "nome",
        "descricao",
        "ativo",
        "permissoesVizualizacao",
        "observacoes",
        "createdAt",
        "updatedAt"
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
        nome: db.sql.public.PerfilAcesso.columns.nome,
        descricao: db.sql.public.PerfilAcesso.columns.descricao,
        ativo: db.sql.public.PerfilAcesso.columns.ativo,
        permissoesVizualizacao:
          db.sql.public.PerfilAcesso.columns.permissoesVizualizacao,
        observacoes: db.sql.public.PerfilAcesso.columns.observacoes,
        createdAt: db.sql.public.PerfilAcesso.columns.createdAt,
        updatedAt: db.sql.public.PerfilAcesso.columns.updatedAt,
      })
      .build();

    const perfilAtualizado = await runtime.query(atualizarPerfilPlano);
    const novoPerfil = perfilAtualizado[0];

    if (!novoPerfil) {
      return respostaErro("Não foi possível atualizar o perfil", 500);
    }

    // ------------------------------------------
    // ATUALIZAR VÍNCULOS DAS PERMISSÕES
    // ------------------------------------------

    if (chavesPermissoes !== undefined) {
      const perfilPermissaoIdParametro = param(id, {
        codecId: db.sql.public.PerfilPermissao.columns.perfilAcessoId.codecId,
      });

      // Excluir vínculos anteriores.
      const excluirVinculosPlano = db.raw.sql`
        DELETE FROM "PerfilPermissao"
        WHERE "perfilAcessoId" = ${perfilPermissaoIdParametro}
        RETURNING "id"
      `
        .returnsRow({
          id: db.sql.public.PerfilPermissao.columns.id,
        })
        .build();

      await runtime.query(excluirVinculosPlano);

      // Criar os novos vínculos.
      for (const permissaoId of permissoesEncontradas) {
        const vinculoId = crypto.randomUUID();

        const vinculoIdParametro = param(vinculoId, {
          codecId: db.sql.public.PerfilPermissao.columns.id.codecId,
        });

        const perfilIdParametro = param(id, {
          codecId: db.sql.public.PerfilPermissao.columns.perfilAcessoId.codecId,
        });

        const permissaoIdParametro = param(permissaoId, {
          codecId: db.sql.public.PerfilPermissao.columns.permissaoId.codecId,
        });

        const criadoEmParametro = param(agora, {
          codecId: db.sql.public.PerfilPermissao.columns.createdAt.codecId,
        });

        const criarVinculoPlano = db.raw.sql`
          INSERT INTO "PerfilPermissao" (
            "id",
            "perfilAcessoId",
            "permissaoId",
            "createdAt"
          )
          VALUES (
            ${vinculoIdParametro},
            ${perfilIdParametro},
            ${permissaoIdParametro},
            ${criadoEmParametro}
          )
          RETURNING "id"
        `
          .returnsRow({
            id: db.sql.public.PerfilPermissao.columns.id,
          })
          .build();

        const vinculoCriado = await runtime.query(criarVinculoPlano);

        if (!vinculoCriado[0]) {
          throw new Error(
            `Não foi possível vincular a permissão ${permissaoId}`,
          );
        }
      }
    }

    // ------------------------------------------
    // BUSCAR PERMISSÕES DEPOIS DA ATUALIZAÇÃO
    // ------------------------------------------

    const permissoesNovas = await buscarPermissoesPerfil(id);

    const chavesNovas = permissoesNovas.map((permissao) => permissao.chave);

    // ------------------------------------------
    // REGISTRAR HISTÓRICO
    // ------------------------------------------

    const usuarioHistoricoParametro = param(administrador.usuarioId, {
      codecId: db.sql.public.HistoricoPerfil.columns.usuarioId.codecId,
    });

    const perfilHistoricoParametro = param(id, {
      codecId: db.sql.public.HistoricoPerfil.columns.perfilAcessoId.codecId,
    });

    const acaoParametro = param("ATUALIZACAO", {
      codecId: db.sql.public.HistoricoPerfil.columns.acao.codecId,
    });

    const descricaoHistoricoParametro = param(
      `O perfil "${perfilAtual.nome}" foi atualizado.`,
      {
        codecId: db.sql.public.HistoricoPerfil.columns.descricao.codecId,
      },
    );

    const dadosAnteriores = {
      ...perfilAtual,
      permissoes: chavesAnteriores,
    };

    const dadosNovos = {
      ...novoPerfil,
      permissoes: chavesNovas,
    };

    const anteriorParametro = param(JSON.stringify(dadosAnteriores), {
      codecId: db.sql.public.HistoricoPerfil.columns.dadosAnteriores.codecId,
    });

    const novoParametro = param(JSON.stringify(dadosNovos), {
      codecId: db.sql.public.HistoricoPerfil.columns.dadosNovos.codecId,
    });

    const criarHistoricoPlano = db.raw.sql`
      INSERT INTO "HistoricoPerfil" (
        "perfilAcessoId",
        "usuarioId",
        "acao",
        "descricao",
        "dadosAnteriores",
        "dadosNovos"
      )
      VALUES (
        ${perfilHistoricoParametro},
        ${usuarioHistoricoParametro},
        ${acaoParametro},
        ${descricaoHistoricoParametro},
        ${anteriorParametro},
        ${novoParametro}
      )
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.HistoricoPerfil.columns.id,
      })
      .build();

    const historicoCriado = await runtime.query(criarHistoricoPlano);

    if (!historicoCriado[0]) {
      return respostaErro(
        "Perfil atualizado, mas não foi possível registrar o histórico",
        500,
      );
    }

    return Response.json({
      mensagem: "Perfil atualizado com sucesso",
      perfil: novoPerfil,
      permissoes: chavesNovas,
    });
  } catch (erro) {
    console.error("ERRO AO ATUALIZAR PERFIL:", erro);

    if (erro instanceof Error) {
      console.error("MENSAGEM:", erro.message);
      console.error("STACK:", erro.stack);
    }

    return respostaErro("Erro interno ao atualizar perfil", 500);
  }
}

// ==========================================
// DELETE - EXCLUIR PERFIL
// ==========================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return respostaErro("Acesso negado", 403);
    }

    const { id } = await params;

    if (!validarId(id)) {
      return respostaErro("ID de perfil inválido", 400);
    }

    const idParametro = param(id, {
      codecId: db.sql.public.PerfilAcesso.columns.id.codecId,
    });

    // ------------------------------------------
    // BUSCAR PERFIL
    // ------------------------------------------

    const buscarPerfilPlano = db.raw.sql`
      SELECT
        "id",
        "nome",
        "descricao",
        "ativo",
        "permissoesVizualizacao",
        "observacoes"
      FROM "PerfilAcesso"
      WHERE "id" = ${idParametro}
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
        nome: db.sql.public.PerfilAcesso.columns.nome,
        descricao: db.sql.public.PerfilAcesso.columns.descricao,
        ativo: db.sql.public.PerfilAcesso.columns.ativo,
        permissoesVizualizacao:
          db.sql.public.PerfilAcesso.columns.permissoesVizualizacao,
        observacoes: db.sql.public.PerfilAcesso.columns.observacoes,
      })
      .build();

    const perfisEncontrados = await runtime.query(buscarPerfilPlano);
    const perfil = perfisEncontrados[0];

    if (!perfil) {
      return respostaErro("Perfil não encontrado", 404);
    }

    // ------------------------------------------
    // VERIFICAR USUÁRIOS VINCULADOS
    // ------------------------------------------

    const usuariosVinculadosPlano = db.raw.sql`
      SELECT "id"
      FROM "Usuario"
      WHERE "perfilAcessoId" = ${idParametro}
      LIMIT 1
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const usuariosVinculados = await runtime.query(usuariosVinculadosPlano);

    if (usuariosVinculados[0]) {
      return respostaErro(
        "Este perfil está vinculado a usuários e não pode ser excluído.",
        409,
      );
    }

    // ------------------------------------------
    // REGISTRAR HISTÓRICO DA EXCLUSÃO
    // ------------------------------------------

    const usuarioHistoricoParametro = param(administrador.usuarioId, {
      codecId: db.sql.public.HistoricoPerfil.columns.usuarioId.codecId,
    });

    const perfilHistoricoParametro = param(id, {
      codecId: db.sql.public.HistoricoPerfil.columns.perfilAcessoId.codecId,
    });

    const acaoParametro = param("EXCLUSAO", {
      codecId: db.sql.public.HistoricoPerfil.columns.acao.codecId,
    });

    const descricaoParametro = param(
      `O perfil "${perfil.nome}" foi excluído.`,
      {
        codecId: db.sql.public.HistoricoPerfil.columns.descricao.codecId,
      },
    );

    const dadosParametro = param(JSON.stringify(perfil), {
      codecId: db.sql.public.HistoricoPerfil.columns.dadosAnteriores.codecId,
    });

    const historicoPlano = db.raw.sql`
      INSERT INTO "HistoricoPerfil" (
        "perfilAcessoId",
        "usuarioId",
        "acao",
        "descricao",
        "dadosAnteriores"
      )
      VALUES (
        ${perfilHistoricoParametro},
        ${usuarioHistoricoParametro},
        ${acaoParametro},
        ${descricaoParametro},
        ${dadosParametro}
      )
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.HistoricoPerfil.columns.id,
      })
      .build();

    const historicoCriado = await runtime.query(historicoPlano);

    if (!historicoCriado[0]) {
      return respostaErro(
        "Não foi possível registrar o histórico da exclusão",
        500,
      );
    }

    // ------------------------------------------
    // EXCLUIR PERFIL
    // ------------------------------------------

    const excluirPerfilPlano = db.raw.sql`
      DELETE FROM "PerfilAcesso"
      WHERE "id" = ${idParametro}
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
      })
      .build();

    const excluido = await runtime.query(excluirPerfilPlano);

    if (!excluido[0]) {
      return respostaErro("Não foi possível excluir o perfil", 500);
    }

    return Response.json({
      mensagem: "Perfil excluído com sucesso",
      id: excluido[0].id,
    });
  } catch (erro) {
    console.error("ERRO AO EXCLUIR PERFIL:", erro);

    return respostaErro("Erro interno ao excluir perfil", 500);
  }
}
