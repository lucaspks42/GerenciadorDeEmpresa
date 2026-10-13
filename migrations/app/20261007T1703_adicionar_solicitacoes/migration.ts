import type { Contract as End } from "../../snapshots/2b4c41ab3b19b3ca7c067cc359e339bf6d131439a7f84a1641b3c1ffc61db5ee/contract";
import endContract from "../../snapshots/2b4c41ab3b19b3ca7c067cc359e339bf6d131439a7f84a1641b3c1ffc61db5ee/contract.json" with { type: "json" };

import type { Contract as Start } from "../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract";
import startContract from "../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract.json" with { type: "json" };

import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: "public",
        table: "SolicitacaoCadastro",
        columns: [
          col("id", "SERIAL", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("nome", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("email", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("senha", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("status", "text", {
            notNull: true,
            default: lit("PENDENTE"),
            codecRef: { codecId: "pg/text@1" },
          }),
          col("criadoEm", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-temporal@1" },
          }),
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "SolicitacaoCadastro_status_check_a1b2d3c8",
            "\"status\" IN ('PENDENTE', 'APROVADO', 'RECUSADO')",
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
