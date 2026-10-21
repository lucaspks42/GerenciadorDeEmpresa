#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1820bf2e34cad36faf8fd257085676696d3f99f455bc5881e9e296f515e9e7a3/contract';
import startContract from '../../snapshots/1820bf2e34cad36faf8fd257085676696d3f99f455bc5881e9e296f515e9e7a3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract';
import endContract from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('administradorPrincipal', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
