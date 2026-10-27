import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";
import { Temporal } from "@js-temporal/polyfill";

const runtime = db.runtime();

const permissoesVisualizacaoPermitidas = [
  "todos",
  "proprios",
  "setor",
  "atribuidos",
];

function textoOpcional(valor: unknown): string | null {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  if (typeof valor !== "string") {
    throw new Error("Campo de texto inválido");
  }

  return valor.trim() || null;
}

// ==========================================
// LISTAR PERFIS
// ==========================================

export async function GET() {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const buscarPerfisPlano = db.raw.sql`
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
      ORDER BY "nome" ASC
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

    const perfis = await runtime.query(buscarPerfisPlano);

    return Response.json(perfis);
  } catch (erro) {
    console.error("ERRO AO LISTAR PERFIS:", erro);

    return Response.json(
      { erro: "Erro interno ao listar perfis" },
      { status: 500 },
    );
  }
}

// ==========================================
// CADASTRAR PERFIL
// ==========================================

export async function POST(request: Request) {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const dados: unknown = await request.json();

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return Response.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const {
      nome,
      descricao,
      ativo,
      permissoesVizualizacao,
      observacoes,
      permissoes,
    } = dados as Record<string, unknown>;

    if (typeof nome !== "string" || !nome.trim()) {
      return Response.json(
        { erro: "O nome do perfil é obrigatório" },
        { status: 400 },
      );
    }

    const nomeNormalizado = nome.trim();

    if (nomeNormalizado.length > 100) {
      return Response.json(
        { erro: "O nome deve ter no máximo 100 caracteres" },
        { status: 400 },
      );
    }

    if (
      descricao !== undefined &&
      descricao !== null &&
      (typeof descricao !== "string" || descricao.trim().length > 500)
    ) {
      return Response.json({ erro: "Descrição inválida" }, { status: 400 });
    }

    if (ativo !== undefined && typeof ativo !== "boolean") {
      return Response.json({ erro: "Status inválido" }, { status: 400 });
    }

    const visualizacao = permissoesVizualizacao ?? "todos";

    if (
      typeof visualizacao !== "string" ||
      !permissoesVisualizacaoPermitidas.includes(visualizacao)
    ) {
      return Response.json(
        { erro: "Regra de visualização inválida" },
        { status: 400 },
      );
    }

    if (
      observacoes !== undefined &&
      observacoes !== null &&
      (typeof observacoes !== "string" || observacoes.trim().length > 300)
    ) {
      return Response.json({ erro: "Observações inválidas" }, { status: 400 });
    }

    if (
      permissoes !== undefined &&
      (!Array.isArray(permissoes) ||
        !permissoes.every(
          (chave) => typeof chave === "string" && chave.trim().length > 0,
        ))
    ) {
      return Response.json(
        { erro: "A lista de permissões é inválida" },
        { status: 400 },
      );
    }

    const chavesPermissoes = [
      ...new Set((permissoes as string[] | undefined) ?? []),
    ];

    // Verificar nome duplicado.
    const nomeParametro = param(nomeNormalizado, {
      codecId: db.sql.public.PerfilAcesso.columns.nome.codecId,
    });

    const duplicadoPlano = db.raw.sql`
      SELECT "id"
      FROM "PerfilAcesso"
      WHERE LOWER("nome") = LOWER(${nomeParametro})
      LIMIT 1
    `
      .returnsRow({
        id: db.sql.public.PerfilAcesso.columns.id,
      })
      .build();

    const duplicados = await runtime.query(duplicadoPlano);

    if (duplicados[0]) {
      return Response.json(
        { erro: "Já existe um perfil com esse nome" },
        { status: 409 },
      );
    }

    // Validar todas as chaves antes de criar o perfil.
    const permissoesEncontradas: string[] = [];

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
        return Response.json(
          { erro: `Permissão não encontrada: ${chave}` },
          { status: 400 },
        );
      }

      permissoesEncontradas.push(resultado[0].id);
    }

    const agora = Temporal.Now.instant();
    const id = crypto.randomUUID();

    const idParametro = param(id, {
      codecId: db.sql.public.PerfilAcesso.columns.id.codecId,
    });

    const descricaoParametro = param(textoOpcional(descricao), {
      codecId: db.sql.public.PerfilAcesso.columns.descricao.codecId,
    });

    const ativoParametro = param(ativo ?? true, {
      codecId: db.sql.public.PerfilAcesso.columns.ativo.codecId,
    });

    const visualizacaoParametro = param(visualizacao, {
      codecId:
        db.sql.public.PerfilAcesso.columns.permissoesVizualizacao.codecId,
    });

    const observacoesParametro = param(textoOpcional(observacoes), {
      codecId: db.sql.public.PerfilAcesso.columns.observacoes.codecId,
    });

    const dataParametro = param(agora, {
      codecId: db.sql.public.PerfilAcesso.columns.createdAt.codecId,
    });

    const atualizarDataParametro = param(agora, {
      codecId: db.sql.public.PerfilAcesso.columns.updatedAt.codecId,
    });

    const criarPerfilPlano = db.raw.sql`
      INSERT INTO "PerfilAcesso" (
        "id",
        "nome",
        "descricao",
        "ativo",
        "permissoesVizualizacao",
        "observacoes",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${idParametro},
        ${nomeParametro},
        ${descricaoParametro},
        ${ativoParametro},
        ${visualizacaoParametro},
        ${observacoesParametro},
        ${dataParametro},
        ${atualizarDataParametro}
      )
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

    const perfisCriados = await runtime.query(criarPerfilPlano);
    const perfilCriado = perfisCriados[0];

    if (!perfilCriado) {
      return Response.json(
        { erro: "Não foi possível cadastrar o perfil" },
        { status: 500 },
      );
    }

    // Criar os vínculos das permissões selecionadas.
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

      await runtime.query(criarVinculoPlano);
    }

    return Response.json(
      {
        mensagem: "Perfil cadastrado com sucesso",
        perfil: perfilCriado,
        permissoes: chavesPermissoes,
      },
      { status: 201 },
    );
  } catch (erro) {
    console.error("ERRO AO CADASTRAR PERFIL:", erro);

    if (erro instanceof Error) {
      console.error("MENSAGEM:", erro.message);
      console.error("STACK:", erro.stack);
    }

    return Response.json(
      {
        erro: "Erro interno ao cadastrar perfil",
        detalhe: erro instanceof Error ? erro.message : String(erro),
      },
      { status: 500 },
    );
  }
}
