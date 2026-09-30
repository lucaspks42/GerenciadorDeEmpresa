#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e/contract';
import startContract from '../../snapshots/91e7f9f035806fa2789a4d726ef7724cad434fd6b00014d47ebf12d6e6bb784e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e6aaad2994d9de11d8c8633b54e31b5f98786626f2b16863153c3957e0e22227/contract';
import endContract from '../../snapshots/e6aaad2994d9de11d8c8633b54e31b5f98786626f2b16863153c3957e0e22227/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

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
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('valor', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
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
