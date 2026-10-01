#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract';
import startContract from '../../snapshots/69bb581df0cc828fc1f1b8d131587b0c63e5b659fcfc457eeae7b5d9268c5401/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract';
import endContract from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
      this.addUnique({
        schema: 'public',
        table: 'Sessao',
        constraint: 'Sessao_token_key',
        columns: ['token'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Sessao',
        index: 'Sessao_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
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
