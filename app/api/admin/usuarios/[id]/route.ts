import { exigirAdministrador } from "@/lib/auth";
import { db } from "@/src/prisma/db";
import { param } from "@prisma/orm-postgres/relational-core";
import { Temporal } from "@js-temporal/polyfill";

const runtime = db.runtime();

function converterData(valor: unknown): Temporal.Instant | null | undefined {
  if (valor === undefined) return undefined;
  if (valor === null || valor === "") return null;

  if (typeof valor !== "string") return undefined;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return undefined;

  try {
    const data = Temporal.Instant.from(`${valor}T00:00:00Z`);

    if (data.toString().slice(0, 10) !== valor) {
      return undefined;
    }

    return data;
  } catch {
    return undefined;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuario = await exigirAdministrador();

    if (!usuario) {
      return Response.json({ erro: "Acesso negado" }, { status: 403 });
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
    } = dados;

    const { id } = await params;
    const usuarioId = Number(id);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return Response.json({ erro: "ID inválido" }, { status: 400 });
    }

    // Validação dos campos obrigatórios
    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      !nome.trim() ||
      !email.trim()
    ) {
      return Response.json(
        { erro: "Nome e email precisam estar preenchidos" },
        { status: 400 },
      );
    }

    // Validação dos campos de texto opcionais
    const camposTexto = [
      telefone,
      cpf,
      cep,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      cargo,
      departamento,
    ];

    if (
      camposTexto.some(
        (campo) =>
          campo !== null && campo !== undefined && typeof campo !== "string",
      )
    ) {
      return Response.json(
        { erro: "Um ou mais campos possuem formato inválido" },
        { status: 400 },
      );
    }

    // Limpeza dos dados
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const telefoneLimpo = telefone?.trim() || null;

    const cpfLimpo = cpf?.replace(/\D/g, "") || null;
    const cepLimpo = cep?.replace(/\D/g, "") || null;

    const enderecoLimpo = endereco?.trim() || null;
    const numeroLimpo = numero?.trim() || null;
    const bairroLimpo = bairro?.trim() || null;
    const cidadeLimpa = cidade?.trim() || null;
    const estadoLimpo = estado?.trim().toUpperCase() || null;
    const cargoLimpo = cargo?.trim() || null;
    const departamentoLimpo = departamento?.trim() || null;

    // Validação do CPF e CEP
    if (cpfLimpo !== null && cpfLimpo.length !== 11) {
      return Response.json(
        { erro: "O CPF precisa conter 11 números" },
        { status: 400 },
      );
    }

    if (cepLimpo !== null && cepLimpo.length !== 8) {
      return Response.json(
        { erro: "O CEP precisa conter 8 números" },
        { status: 400 },
      );
    }

    // Conversão das datas
    const nascimentoConvertido = converterData(dataNascimento);
    const admissaoConvertida = converterData(dataAdmissao);

    if (
      nascimentoConvertido === undefined ||
      admissaoConvertida === undefined
    ) {
      return Response.json(
        { erro: "Uma ou mais datas são inválidas" },
        { status: 400 },
      );
    }

    // Verifica se o usuário existe
    const consultaUsuario = db.raw.sql`
      SELECT "id"
      FROM "Usuario"
      WHERE "id" = ${usuarioId}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const [usuarioEncontrado] = await runtime.query(consultaUsuario);

    if (!usuarioEncontrado) {
      return Response.json({ erro: "Usuário não encontrado" }, { status: 404 });
    }

    // Verifica se outro usuário utiliza o mesmo email
    const consultaEmail = db.raw.sql`
      SELECT "id"
      FROM "Usuario"
      WHERE LOWER("email") = ${emailLimpo}
      AND "id" != ${usuarioId}
    `
      .returnsRow({
        id: db.sql.public.Usuario.columns.id,
      })
      .build();

    const [emailExistente] = await runtime.query(consultaEmail);

    if (emailExistente) {
      return Response.json(
        { erro: "Este email já está sendo utilizado por outro usuário" },
        { status: 409 },
      );
    }

    // Verifica se outro usuário utiliza o mesmo CPF
    if (cpfLimpo) {
      const consultaCpf = db.raw.sql`
        SELECT "id"
        FROM "Usuario"
        WHERE "cpf" = ${cpfLimpo}
        AND "id" != ${usuarioId}
      `
        .returnsRow({
          id: db.sql.public.Usuario.columns.id,
        })
        .build();

      const [cpfExistente] = await runtime.query(consultaCpf);

      if (cpfExistente) {
        return Response.json(
          { erro: "Este CPF já está cadastrado para outro usuário" },
          { status: 409 },
        );
      }
    }

    // Parâmetros das datas usando os codecs das colunas
    const nascimentoParametro = param(nascimentoConvertido, {
      codecId: db.sql.public.Usuario.columns.dataNascimento.codecId,
    });

    const admissaoParametro = param(admissaoConvertida, {
      codecId: db.sql.public.Usuario.columns.dataAdmissao.codecId,
    });

    const telefoneParametro = param(telefoneLimpo, {
      codecId: db.sql.public.Usuario.columns.telefone.codecId,
    });

    const cpfParametro = param(cpfLimpo, {
      codecId: db.sql.public.Usuario.columns.cpf.codecId,
    });

    const cepParametro = param(cepLimpo, {
      codecId: db.sql.public.Usuario.columns.cep.codecId,
    });

    const enderecoParametro = param(enderecoLimpo, {
      codecId: db.sql.public.Usuario.columns.endereco.codecId,
    });

    const numeroParametro = param(numeroLimpo, {
      codecId: db.sql.public.Usuario.columns.numero.codecId,
    });

    const bairroParametro = param(bairroLimpo, {
      codecId: db.sql.public.Usuario.columns.bairro.codecId,
    });

    const cidadeParametro = param(cidadeLimpa, {
      codecId: db.sql.public.Usuario.columns.cidade.codecId,
    });

    const estadoParametro = param(estadoLimpo, {
      codecId: db.sql.public.Usuario.columns.estado.codecId,
    });

    const cargoParametro = param(cargoLimpo, {
      codecId: db.sql.public.Usuario.columns.cargo.codecId,
    });

    const departamentoParametro = param(departamentoLimpo, {
      codecId: db.sql.public.Usuario.columns.departamento.codecId,
    });

    // Atualiza os dados do usuário
    const plano = db.raw.sql`
  UPDATE "Usuario"
  SET
    "nome" = ${nomeLimpo},
    "email" = ${emailLimpo},
    "telefone" = ${telefoneParametro},
    "cpf" = ${cpfParametro},
    "dataNascimento" = ${nascimentoParametro},
    "cep" = ${cepParametro},
    "endereco" = ${enderecoParametro},
    "numero" = ${numeroParametro},
    "bairro" = ${bairroParametro},
    "cidade" = ${cidadeParametro},
    "estado" = ${estadoParametro},
    "cargo" = ${cargoParametro},
    "departamento" = ${departamentoParametro},
    "dataAdmissao" = ${admissaoParametro}
  WHERE "id" = ${usuarioId}
`
      .affectedCount()
      .build();

    await runtime.execute(plano);

    return Response.json(
      {
        mensagem: "Usuário atualizado com sucesso",
      },
      { status: 200 },
    );
  } catch (erro) {
    console.error("ERRO NO PATCH DO USUARIO:", erro);

    return Response.json(
      { erro: "Erro ao atualizar usuário" },
      { status: 500 },
    );
  }
}
