#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/06a0a4b956aafea6f0c2dd6339faf5c31801411fd3e776a741dc215a8893c84e/contract";
import endContract from "../../snapshots/06a0a4b956aafea6f0c2dd6339faf5c31801411fd3e776a741dc215a8893c84e/contract.json" with { type: "json" };
import type { Contract as Start } from "../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract";
import startContract from "../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json" with { type: "json" };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  placeholder,
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
          col("criadoEm", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: { codecId: "pg/timestamptz-temporal@1" },
          }),
          col("email", "text", {
            notNull: true,
            codecRef: { codecId: "pg/text@1" },
          }),
          col("id", "SERIAL", {
            notNull: true,
            codecRef: { codecId: "pg/int4@1" },
          }),
          col("nome", "text", {
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
        ],
        constraints: [
          primaryKey(["id"]),
          checkExpression(
            "SolicitacaoCadastro_status_check_a1b2d3c8",
            "\"status\" IN ('PENDENTE', 'APROVADO', 'RECUSADO')",
          ),
        ],
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("administradorPrincipal", "bool", {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: "pg/bool@1" },
        }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("bairro", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("cargo", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("cep", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("cidade", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("cpf", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("dataAdmissao", "timestamptz", {
          codecRef: { codecId: "pg/timestamptz-temporal@1" },
        }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("dataNascimento", "timestamptz", {
          codecRef: { codecId: "pg/timestamptz-temporal@1" },
        }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("departamento", "text", {
          codecRef: { codecId: "pg/text@1" },
        }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("endereco", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("estado", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("numero", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("status", "bool", {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: "pg/bool@1" },
        }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("telefone", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.addColumn({
        schema: "public",
        table: "Usuario",
        column: col("perfil", "text", { codecRef: { codecId: "pg/text@1" } }),
      }),
      this.dataTransform(
        endContract as unknown as End,
        "backfill-Usuario-perfil",
        {
          check: () => placeholder("backfill-Usuario-perfil:check"),
          run: () => placeholder("backfill-Usuario-perfil:run"),
        },
      ),
      this.setNotNull({ schema: "public", table: "Usuario", column: "perfil" }),
      this.addCheckConstraint({
        schema: "public",
        table: "Usuario",
        constraint: "Usuario_perfil_check_1159265b",
        expression: "\"perfil\" IN ('ADMINISTRADOR', 'FUNCIONARIO')",
      }),
      this.addUnique({
        schema: "public",
        table: "Usuario",
        constraint: "Usuario_cpf_key",
        columns: ["cpf"],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
