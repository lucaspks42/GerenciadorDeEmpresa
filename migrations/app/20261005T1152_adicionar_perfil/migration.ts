#!/usr/bin/env -S node

import type { Contract as End } from "../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract";
import endContractJson from "../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract.json" with { type: "json" };

import type { Contract as Start } from "../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract";
import startContractJson from "../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json" with { type: "json" };

import { Migration, MigrationCLI, col } from "@prisma/orm-postgres/migration";

import postgresAdapter from "@prisma/orm-postgres/adapter/runtime";
import { sql } from "@prisma/orm-postgres/builder/runtime";
import {
  createExecutionContext,
  createSqlExecutionStack,
} from "@prisma/orm-postgres/family-runtime";
import postgresTarget, {
  PostgresContractSerializer,
} from "@prisma/orm-postgres/target/runtime";

const stack = createSqlExecutionStack({
  target: postgresTarget,
  adapter: postgresAdapter,
});

const endContract = new PostgresContractSerializer().deserializeContract<End>(
  endContractJson,
);

const db = sql<End>({
  context: createExecutionContext({
    contract: endContract,
    stack,
  }),
  rawCodecInferer: stack.adapter.rawCodecInferer,
});

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContractJson;
  override readonly endContractJson = endContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("perfil", "text", {
          codecRef: { codecId: "pg/text@1" },
        }),
      }),

      this.dataTransform(endContract, "backfill-Usuario-perfil", {
        check: () =>
          db.public.Usuario.select("id")
            .where((f, fns) => fns.eq(f.perfil, null))
            .limit(1),

        run: () =>
          db.public.Usuario.update({
            perfil: "ADMINISTRADOR",
          }).where((f, fns) => fns.eq(f.perfil, null)),
      }),

      this.setNotNull({
        schema: "public",
        table: "Usuario",
        column: "perfil",
      }),

      this.addCheckConstraint({
        schema: "public",
        table: "Usuario",
        constraint: "Usuario_perfil_check_1159265b",
        expression: "\"perfil\" IN ('ADMINISTRADOR', 'FUNCIONARIO')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
