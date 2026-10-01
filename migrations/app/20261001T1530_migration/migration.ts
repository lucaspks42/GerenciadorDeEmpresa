#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract';
import endContract from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e/contract';
import startContract from '../../snapshots/91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropTable({ schema: 'public', table: 'User' }),
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
      this.addForeignKey({
        schema: 'public',
        table: 'Pagamento',
        foreignKey: {
          name: 'Pagamento_clienteId_fkey',
          columns: ['clienteId'],
          references: { schema: 'public', table: 'Cliente', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
