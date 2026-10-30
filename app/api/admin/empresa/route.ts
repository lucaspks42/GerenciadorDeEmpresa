import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";
import { Temporal } from "@js-temporal/polyfill";

const runtime = db.runtime();

const ID_EMPRESA = 1;

function textoOpcional(valor: unknown): string | null {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  if (typeof valor !== "string") {
    throw new Error("Campo de texto inválido");
  }

  return valor.trim() || null;
}

function dataOpcional(valor: unknown): Temporal.Instant | null {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  if (typeof valor !== "string") {
    throw new Error("Data inválida");
  }

  try {
    return Temporal.Instant.from(`${valor.slice(0, 10)}T00:00:00Z`);
  } catch {
    throw new Error("Data inválida");
  }
}

function objetoValido(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export async function GET() {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const buscarEmpresaPlano = db.raw.sql`
      SELECT *
      FROM "Empresa"
      WHERE "id" = ${param(ID_EMPRESA, {
        codecId: db.sql.public.Empresa.columns.id.codecId,
      })}
      LIMIT 1
    `
      .returnsRow({
        id: db.sql.public.Empresa.columns.id,
        razaoSocial: db.sql.public.Empresa.columns.razaoSocial,
        nomeFantasia: db.sql.public.Empresa.columns.nomeFantasia,
        cnpj: db.sql.public.Empresa.columns.cnpj,
        dataAbertura: db.sql.public.Empresa.columns.dataAbertura,
        inscricaoEstadual: db.sql.public.Empresa.columns.inscricaoEstadual,
        inscricaoMunicipal: db.sql.public.Empresa.columns.inscricaoMunicipal,
        naturezaJuridica: db.sql.public.Empresa.columns.naturezaJuridica,
        porteEmpresarial: db.sql.public.Empresa.columns.porteEmpresarial,
        situacaoCadastral: db.sql.public.Empresa.columns.situacaoCadastral,
        cnaePrincipal: db.sql.public.Empresa.columns.cnaePrincipal,

        cep: db.sql.public.Empresa.columns.cep,
        pais: db.sql.public.Empresa.columns.pais,
        estado: db.sql.public.Empresa.columns.estado,
        cidade: db.sql.public.Empresa.columns.cidade,
        bairro: db.sql.public.Empresa.columns.bairro,
        numero: db.sql.public.Empresa.columns.numero,
        logradouro: db.sql.public.Empresa.columns.logradouro,
        complemento: db.sql.public.Empresa.columns.complemento,
        pontoReferencia: db.sql.public.Empresa.columns.pontoReferencia,
        tipoEstabelecimento: db.sql.public.Empresa.columns.tipoEstabelecimento,

        telefonePrincipal: db.sql.public.Empresa.columns.telefonePrincipal,
        telefoneSecundario: db.sql.public.Empresa.columns.telefoneSecundario,
        whatsapp: db.sql.public.Empresa.columns.whatsapp,
        emailPrincipal: db.sql.public.Empresa.columns.emailPrincipal,
        emailFinanceiro: db.sql.public.Empresa.columns.emailFinanceiro,
        emailComercial: db.sql.public.Empresa.columns.emailComercial,
        site: db.sql.public.Empresa.columns.site,
        instagram: db.sql.public.Empresa.columns.instagram,
        facebook: db.sql.public.Empresa.columns.facebook,
        linkedin: db.sql.public.Empresa.columns.linkedin,

        regimeTributario: db.sql.public.Empresa.columns.regimeTributario,
        regimeApuracao: db.sql.public.Empresa.columns.regimeApuracao,
        crt: db.sql.public.Empresa.columns.crt,
        indicadorICMS: db.sql.public.Empresa.columns.indicadorICMS,
        responsavelContabil: db.sql.public.Empresa.columns.responsavelContabil,
        crcContador: db.sql.public.Empresa.columns.crcContador,
        emailContabilidade: db.sql.public.Empresa.columns.emailContabilidade,
        tipoCertificado: db.sql.public.Empresa.columns.tipoCertificado,
        validadeCertificado: db.sql.public.Empresa.columns.validadeCertificado,

        titularConta: db.sql.public.Empresa.columns.titularConta,
        documentoTitular: db.sql.public.Empresa.columns.documentoTitular,
        tipoPix: db.sql.public.Empresa.columns.tipoPix,
        chavePix: db.sql.public.Empresa.columns.chavePix,

        logoUrl: db.sql.public.Empresa.columns.logoUrl,
        corPrincipal: db.sql.public.Empresa.columns.corPrincipal,
        corSecundaria: db.sql.public.Empresa.columns.corSecundaria,
        corApoio: db.sql.public.Empresa.columns.corApoio,
        slogan: db.sql.public.Empresa.columns.slogan,
        responsavelLegal: db.sql.public.Empresa.columns.responsavelLegal,
        cpfResponsavel: db.sql.public.Empresa.columns.cpfResponsavel,
        responsavelFinanceiro:
          db.sql.public.Empresa.columns.responsavelFinanceiro,
        descricao: db.sql.public.Empresa.columns.descricao,
        criadoEm: db.sql.public.Empresa.columns.criadoEm,
        atualizadoEm: db.sql.public.Empresa.columns.atualizadoEm,
      })
      .build();

    const empresas = await runtime.query(buscarEmpresaPlano);
    const empresa = empresas[0] ?? null;

    const buscarContasPlano = db.raw.sql`
      SELECT
        "id",
        "empresaId",
        "banco",
        "agencia",
        "conta",
        "tipo",
        "principal"
      FROM "ContaBancariaEmpresa"
      WHERE "empresaId" = ${param(ID_EMPRESA, {
        codecId: db.sql.public.ContaBancariaEmpresa.columns.empresaId.codecId,
      })}
      ORDER BY "principal" DESC, "banco" ASC
    `
      .returnsRow({
        id: db.sql.public.ContaBancariaEmpresa.columns.id,
        empresaId: db.sql.public.ContaBancariaEmpresa.columns.empresaId,
        banco: db.sql.public.ContaBancariaEmpresa.columns.banco,
        agencia: db.sql.public.ContaBancariaEmpresa.columns.agencia,
        conta: db.sql.public.ContaBancariaEmpresa.columns.conta,
        tipo: db.sql.public.ContaBancariaEmpresa.columns.tipo,
        principal: db.sql.public.ContaBancariaEmpresa.columns.principal,
      })
      .build();

    const contasBancarias = await runtime.query(buscarContasPlano);

    return Response.json({
      empresa,
      contasBancarias,
    });
  } catch (erro) {
    console.error("ERRO AO BUSCAR DADOS DA EMPRESA:", erro);

    return Response.json(
      { erro: "Erro interno ao buscar dados da empresa" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const administrador = await exigirAdministrador();

    if (!administrador) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
    }

    const dados: unknown = await request.json();

    if (!objetoValido(dados)) {
      return Response.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const empresa = objetoValido(dados.empresa) ? dados.empresa : dados;

    const contasBancarias = dados.contasBancarias ?? [];

    if (
      !Array.isArray(contasBancarias) ||
      !contasBancarias.every(objetoValido)
    ) {
      return Response.json(
        { erro: "Lista de contas bancárias inválida" },
        { status: 400 },
      );
    }

    if (contasBancarias.length > 20) {
      return Response.json(
        { erro: "O limite é de 20 contas bancárias" },
        { status: 400 },
      );
    }

    const contasValidadas = contasBancarias.map((conta) => {
      const banco = textoOpcional(conta.banco);
      const agencia = textoOpcional(conta.agencia);
      const numeroConta = textoOpcional(conta.conta);
      const tipo = textoOpcional(conta.tipo);

      if (!banco || !tipo) {
        throw new Error("Banco e tipo de conta são obrigatórios");
      }

      if (banco.length > 100 || tipo.length > 30) {
        throw new Error("Dados bancários excedem o limite permitido");
      }

      if (
        (agencia && agencia.length > 30) ||
        (numeroConta && numeroConta.length > 40)
      ) {
        throw new Error("Agência ou conta inválida");
      }

      if (
        conta.principal !== undefined &&
        typeof conta.principal !== "boolean"
      ) {
        throw new Error("Indicador de conta principal inválido");
      }

      return {
        banco,
        agencia,
        conta: numeroConta,
        tipo,
        principal: conta.principal === true,
      };
    });

    if (contasValidadas.filter((conta) => conta.principal).length > 1) {
      return Response.json(
        { erro: "Somente uma conta pode ser principal" },
        { status: 400 },
      );
    }

    const camposTexto = [
      "razaoSocial",
      "nomeFantasia",
      "cnpj",
      "inscricaoEstadual",
      "inscricaoMunicipal",
      "naturezaJuridica",
      "porteEmpresarial",
      "situacaoCadastral",
      "cnaePrincipal",
      "cep",
      "pais",
      "estado",
      "cidade",
      "bairro",
      "numero",
      "logradouro",
      "complemento",
      "pontoReferencia",
      "tipoEstabelecimento",
      "telefonePrincipal",
      "telefoneSecundario",
      "whatsapp",
      "emailPrincipal",
      "emailFinanceiro",
      "emailComercial",
      "site",
      "instagram",
      "facebook",
      "linkedin",
      "regimeTributario",
      "regimeApuracao",
      "crt",
      "indicadorICMS",
      "responsavelContabil",
      "crcContador",
      "emailContabilidade",
      "tipoCertificado",
      "titularConta",
      "documentoTitular",
      "tipoPix",
      "chavePix",
      "logoUrl",
      "corPrincipal",
      "corSecundaria",
      "corApoio",
      "slogan",
      "responsavelLegal",
      "cpfResponsavel",
      "responsavelFinanceiro",
      "descricao",
    ] as const;

    const valores: Record<string, string | null> = {};

    for (const campo of camposTexto) {
      valores[campo] = textoOpcional(empresa[campo]);
    }

    if (valores.razaoSocial && valores.razaoSocial.length > 200) {
      return Response.json(
        { erro: "Razão social muito longa" },
        { status: 400 },
      );
    }

    if (valores.nomeFantasia && valores.nomeFantasia.length > 150) {
      return Response.json(
        { erro: "Nome fantasia muito longo" },
        { status: 400 },
      );
    }

    if (valores.descricao && valores.descricao.length > 1000) {
      return Response.json({ erro: "Descrição muito longa" }, { status: 400 });
    }

    const cnpj = valores.cnpj?.replace(/\D/g, "") ?? null;

    if (cnpj && cnpj.length !== 14) {
      return Response.json({ erro: "CNPJ inválido" }, { status: 400 });
    }

    const dataAbertura = dataOpcional(empresa.dataAbertura);
    const validadeCertificado = dataOpcional(empresa.validadeCertificado);

    const agora = Temporal.Now.instant();

    const colunas = {
      id: db.sql.public.Empresa.columns.id,
      razaoSocial: db.sql.public.Empresa.columns.razaoSocial,
      nomeFantasia: db.sql.public.Empresa.columns.nomeFantasia,
      cnpj: db.sql.public.Empresa.columns.cnpj,
      inscricaoEstadual: db.sql.public.Empresa.columns.inscricaoEstadual,
      inscricaoMunicipal: db.sql.public.Empresa.columns.inscricaoMunicipal,
      naturezaJuridica: db.sql.public.Empresa.columns.naturezaJuridica,
      porteEmpresarial: db.sql.public.Empresa.columns.porteEmpresarial,
      situacaoCadastral: db.sql.public.Empresa.columns.situacaoCadastral,
      cnaePrincipal: db.sql.public.Empresa.columns.cnaePrincipal,
      cep: db.sql.public.Empresa.columns.cep,
      pais: db.sql.public.Empresa.columns.pais,
      estado: db.sql.public.Empresa.columns.estado,
      cidade: db.sql.public.Empresa.columns.cidade,
      bairro: db.sql.public.Empresa.columns.bairro,
      numero: db.sql.public.Empresa.columns.numero,
      logradouro: db.sql.public.Empresa.columns.logradouro,
      complemento: db.sql.public.Empresa.columns.complemento,
      pontoReferencia: db.sql.public.Empresa.columns.pontoReferencia,
      tipoEstabelecimento: db.sql.public.Empresa.columns.tipoEstabelecimento,
      telefonePrincipal: db.sql.public.Empresa.columns.telefonePrincipal,
      telefoneSecundario: db.sql.public.Empresa.columns.telefoneSecundario,
      whatsapp: db.sql.public.Empresa.columns.whatsapp,
      emailPrincipal: db.sql.public.Empresa.columns.emailPrincipal,
      emailFinanceiro: db.sql.public.Empresa.columns.emailFinanceiro,
      emailComercial: db.sql.public.Empresa.columns.emailComercial,
      site: db.sql.public.Empresa.columns.site,
      instagram: db.sql.public.Empresa.columns.instagram,
      facebook: db.sql.public.Empresa.columns.facebook,
      linkedin: db.sql.public.Empresa.columns.linkedin,
      regimeTributario: db.sql.public.Empresa.columns.regimeTributario,
      regimeApuracao: db.sql.public.Empresa.columns.regimeApuracao,
      crt: db.sql.public.Empresa.columns.crt,
      indicadorICMS: db.sql.public.Empresa.columns.indicadorICMS,
      responsavelContabil: db.sql.public.Empresa.columns.responsavelContabil,
      crcContador: db.sql.public.Empresa.columns.crcContador,
      emailContabilidade: db.sql.public.Empresa.columns.emailContabilidade,
      tipoCertificado: db.sql.public.Empresa.columns.tipoCertificado,
      titularConta: db.sql.public.Empresa.columns.titularConta,
      documentoTitular: db.sql.public.Empresa.columns.documentoTitular,
      tipoPix: db.sql.public.Empresa.columns.tipoPix,
      chavePix: db.sql.public.Empresa.columns.chavePix,
      logoUrl: db.sql.public.Empresa.columns.logoUrl,
      corPrincipal: db.sql.public.Empresa.columns.corPrincipal,
      corSecundaria: db.sql.public.Empresa.columns.corSecundaria,
      corApoio: db.sql.public.Empresa.columns.corApoio,
      slogan: db.sql.public.Empresa.columns.slogan,
      responsavelLegal: db.sql.public.Empresa.columns.responsavelLegal,
      cpfResponsavel: db.sql.public.Empresa.columns.cpfResponsavel,
      responsavelFinanceiro:
        db.sql.public.Empresa.columns.responsavelFinanceiro,
      descricao: db.sql.public.Empresa.columns.descricao,
      dataAbertura: db.sql.public.Empresa.columns.dataAbertura,
      validadeCertificado: db.sql.public.Empresa.columns.validadeCertificado,
      criadoEm: db.sql.public.Empresa.columns.criadoEm,
      atualizadoEm: db.sql.public.Empresa.columns.atualizadoEm,
    };

    const parametros = camposTexto.map((campo) =>
      param(campo === "cnpj" ? cnpj : valores[campo], {
        codecId: colunas[campo].codecId,
      }),
    );

    const p = Object.fromEntries(
      camposTexto.map((campo, indice) => [campo, parametros[indice]]),
    ) as Record<(typeof camposTexto)[number], ReturnType<typeof param>>;

    const idParametro = param(ID_EMPRESA, {
      codecId: colunas.id.codecId,
    });

    const dataAberturaParametro = param(dataAbertura, {
      codecId: colunas.dataAbertura.codecId,
    });

    const validadeCertificadoParametro = param(validadeCertificado, {
      codecId: colunas.validadeCertificado.codecId,
    });

    const criadoEmParametro = param(agora, {
      codecId: colunas.criadoEm.codecId,
    });

    const atualizadoEmParametro = param(agora, {
      codecId: colunas.atualizadoEm.codecId,
    });

    const salvarEmpresaPlano = db.raw.sql`
      INSERT INTO "Empresa" (
        "id",
        "razaoSocial", "nomeFantasia", "cnpj", "dataAbertura",
        "inscricaoEstadual", "inscricaoMunicipal", "naturezaJuridica",
        "porteEmpresarial", "situacaoCadastral", "cnaePrincipal",
        "cep", "pais", "estado", "cidade", "bairro", "numero",
        "logradouro", "complemento", "pontoReferencia", "tipoEstabelecimento",
        "telefonePrincipal", "telefoneSecundario", "whatsapp",
        "emailPrincipal", "emailFinanceiro", "emailComercial",
        "site", "instagram", "facebook", "linkedin",
        "regimeTributario", "regimeApuracao", "crt", "indicadorICMS",
        "responsavelContabil", "crcContador", "emailContabilidade",
        "tipoCertificado", "validadeCertificado",
        "titularConta", "documentoTitular", "tipoPix", "chavePix",
        "logoUrl", "corPrincipal", "corSecundaria", "corApoio",
        "slogan", "responsavelLegal", "cpfResponsavel",
        "responsavelFinanceiro", "descricao", "criadoEm", "atualizadoEm"
      )
      VALUES (
        ${idParametro},
        ${p.razaoSocial}, ${p.nomeFantasia}, ${p.cnpj}, ${dataAberturaParametro},
        ${p.inscricaoEstadual}, ${p.inscricaoMunicipal}, ${p.naturezaJuridica},
        ${p.porteEmpresarial}, ${p.situacaoCadastral}, ${p.cnaePrincipal},
        ${p.cep}, ${p.pais}, ${p.estado}, ${p.cidade}, ${p.bairro}, ${p.numero},
        ${p.logradouro}, ${p.complemento}, ${p.pontoReferencia}, ${p.tipoEstabelecimento},
        ${p.telefonePrincipal}, ${p.telefoneSecundario}, ${p.whatsapp},
        ${p.emailPrincipal}, ${p.emailFinanceiro}, ${p.emailComercial},
        ${p.site}, ${p.instagram}, ${p.facebook}, ${p.linkedin},
        ${p.regimeTributario}, ${p.regimeApuracao}, ${p.crt}, ${p.indicadorICMS},
        ${p.responsavelContabil}, ${p.crcContador}, ${p.emailContabilidade},
        ${p.tipoCertificado}, ${validadeCertificadoParametro},
        ${p.titularConta}, ${p.documentoTitular}, ${p.tipoPix}, ${p.chavePix},
        ${p.logoUrl}, ${p.corPrincipal}, ${p.corSecundaria}, ${p.corApoio},
        ${p.slogan}, ${p.responsavelLegal}, ${p.cpfResponsavel},
        ${p.responsavelFinanceiro}, ${p.descricao},
        ${criadoEmParametro}, ${atualizadoEmParametro}
      )
      ON CONFLICT ("id") DO UPDATE SET
        "razaoSocial" = EXCLUDED."razaoSocial",
        "nomeFantasia" = EXCLUDED."nomeFantasia",
        "cnpj" = EXCLUDED."cnpj",
        "dataAbertura" = EXCLUDED."dataAbertura",
        "inscricaoEstadual" = EXCLUDED."inscricaoEstadual",
        "inscricaoMunicipal" = EXCLUDED."inscricaoMunicipal",
        "naturezaJuridica" = EXCLUDED."naturezaJuridica",
        "porteEmpresarial" = EXCLUDED."porteEmpresarial",
        "situacaoCadastral" = EXCLUDED."situacaoCadastral",
        "cnaePrincipal" = EXCLUDED."cnaePrincipal",
        "cep" = EXCLUDED."cep",
        "pais" = EXCLUDED."pais",
        "estado" = EXCLUDED."estado",
        "cidade" = EXCLUDED."cidade",
        "bairro" = EXCLUDED."bairro",
        "numero" = EXCLUDED."numero",
        "logradouro" = EXCLUDED."logradouro",
        "complemento" = EXCLUDED."complemento",
        "pontoReferencia" = EXCLUDED."pontoReferencia",
        "tipoEstabelecimento" = EXCLUDED."tipoEstabelecimento",
        "telefonePrincipal" = EXCLUDED."telefonePrincipal",
        "telefoneSecundario" = EXCLUDED."telefoneSecundario",
        "whatsapp" = EXCLUDED."whatsapp",
        "emailPrincipal" = EXCLUDED."emailPrincipal",
        "emailFinanceiro" = EXCLUDED."emailFinanceiro",
        "emailComercial" = EXCLUDED."emailComercial",
        "site" = EXCLUDED."site",
        "instagram" = EXCLUDED."instagram",
        "facebook" = EXCLUDED."facebook",
        "linkedin" = EXCLUDED."linkedin",
        "regimeTributario" = EXCLUDED."regimeTributario",
        "regimeApuracao" = EXCLUDED."regimeApuracao",
        "crt" = EXCLUDED."crt",
        "indicadorICMS" = EXCLUDED."indicadorICMS",
        "responsavelContabil" = EXCLUDED."responsavelContabil",
        "crcContador" = EXCLUDED."crcContador",
        "emailContabilidade" = EXCLUDED."emailContabilidade",
        "tipoCertificado" = EXCLUDED."tipoCertificado",
        "validadeCertificado" = EXCLUDED."validadeCertificado",
        "titularConta" = EXCLUDED."titularConta",
        "documentoTitular" = EXCLUDED."documentoTitular",
        "tipoPix" = EXCLUDED."tipoPix",
        "chavePix" = EXCLUDED."chavePix",
        "logoUrl" = EXCLUDED."logoUrl",
        "corPrincipal" = EXCLUDED."corPrincipal",
        "corSecundaria" = EXCLUDED."corSecundaria",
        "corApoio" = EXCLUDED."corApoio",
        "slogan" = EXCLUDED."slogan",
        "responsavelLegal" = EXCLUDED."responsavelLegal",
        "cpfResponsavel" = EXCLUDED."cpfResponsavel",
        "responsavelFinanceiro" = EXCLUDED."responsavelFinanceiro",
        "descricao" = EXCLUDED."descricao",
        "atualizadoEm" = EXCLUDED."atualizadoEm"
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.Empresa.columns.id,
      })
      .build();

    const empresaSalva = await runtime.query(salvarEmpresaPlano);

    if (!empresaSalva[0]) {
      throw new Error("Não foi possível salvar os dados da empresa");
    }

    const idEmpresaConta = param(ID_EMPRESA, {
      codecId: db.sql.public.ContaBancariaEmpresa.columns.empresaId.codecId,
    });

    const excluirContasPlano = db.raw.sql`
      DELETE FROM "ContaBancariaEmpresa"
      WHERE "empresaId" = ${idEmpresaConta}
      RETURNING "id"
    `
      .returnsRow({
        id: db.sql.public.ContaBancariaEmpresa.columns.id,
      })
      .build();

    await runtime.query(excluirContasPlano);

    for (const conta of contasValidadas) {
      const agoraConta = Temporal.Now.instant();

      const criarContaPlano = db.raw.sql`
        INSERT INTO "ContaBancariaEmpresa" (
          "id",
          "empresaId",
          "banco",
          "agencia",
          "conta",
          "tipo",
          "principal",
          "criadoEm",
          "atualizadoEm"
        )
        VALUES (
          ${param(crypto.randomUUID(), {
            codecId: db.sql.public.ContaBancariaEmpresa.columns.id.codecId,
          })},
          ${idEmpresaConta},
          ${param(conta.banco, {
            codecId: db.sql.public.ContaBancariaEmpresa.columns.banco.codecId,
          })},
          ${param(conta.agencia, {
            codecId: db.sql.public.ContaBancariaEmpresa.columns.agencia.codecId,
          })},
          ${param(conta.conta, {
            codecId: db.sql.public.ContaBancariaEmpresa.columns.conta.codecId,
          })},
          ${param(conta.tipo, {
            codecId: db.sql.public.ContaBancariaEmpresa.columns.tipo.codecId,
          })},
          ${param(conta.principal, {
            codecId:
              db.sql.public.ContaBancariaEmpresa.columns.principal.codecId,
          })},
          ${param(agoraConta, {
            codecId:
              db.sql.public.ContaBancariaEmpresa.columns.criadoEm.codecId,
          })},
          ${param(agoraConta, {
            codecId:
              db.sql.public.ContaBancariaEmpresa.columns.atualizadoEm.codecId,
          })}
        )
        RETURNING "id"
      `
        .returnsRow({
          id: db.sql.public.ContaBancariaEmpresa.columns.id,
        })
        .build();

      await runtime.query(criarContaPlano);
    }

    return Response.json({
      mensagem: "Dados da empresa salvos com sucesso",
    });
  } catch (erro) {
    console.error("ERRO AO SALVAR DADOS DA EMPRESA:", erro);

    return Response.json(
      {
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro interno ao salvar dados da empresa",
      },
      { status: 500 },
    );
  }
}
