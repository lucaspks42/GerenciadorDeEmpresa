#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract';
import endContract from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e6aaad2994d9de11d8c8633b54e31b5f98786626f2b16863153c3957e0e22227/contract';
import startContract from '../../snapshots/e6aaad2994d9de11d8c8633b54e31b5f98786626f2b16863153c3957e0e22227/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
      this.setDefault({
        schema: 'public',
        table: 'Pagamento',
        column: 'status',
        defaultSql: "DEFAULT 'Pendente'",
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
