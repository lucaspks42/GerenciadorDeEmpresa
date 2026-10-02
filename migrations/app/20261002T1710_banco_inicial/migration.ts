#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract';
import endContract from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Cliente',
        columns: [
          col('diaVencimento', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('empresa', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('telefone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('valorMensalidade', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
          col('valorProduto', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Pagamento',
        columns: [
          col('clienteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('dataVencimento', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('diaVencimento', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('Pendente'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('valor', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Sessao',
        columns: [
          col('expiraEm', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('token', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usuarioId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Tarefa',
        columns: [
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('aFazer'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('titulo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Usuario',
        columns: [
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('senha', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Sessao',
        constraint: 'Sessao_token_key',
        columns: ['token'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Pagamento',
        index: 'Pagamento_clienteId_idx_7ae16308',
        columns: ['clienteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Sessao',
        index: 'Sessao_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Pagamento',
        foreignKey: {
          name: 'Pagamento_clienteId_fkey',
          columns: ['clienteId'],
          references: { schema: 'public', table: 'Cliente', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Sessao',
        foreignKey: {
          name: 'Sessao_usuarioId_fkey',
          columns: ['usuarioId'],
          references: { schema: 'public', table: 'Usuario', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
