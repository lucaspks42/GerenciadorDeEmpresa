#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/06a0a4b956aafea6f0c2dd6339faf5c31801411fd3e776a741dc215a8893c84e/contract';
import endContract from '../../snapshots/06a0a4b956aafea6f0c2dd6339faf5c31801411fd3e776a741dc215a8893c84e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract';
import startContract from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('status', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
