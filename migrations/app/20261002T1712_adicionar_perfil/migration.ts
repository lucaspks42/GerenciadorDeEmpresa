#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract';
import endContract from '../../snapshots/516b08bb31dccca9578140e046205fa85f3e8827d6b44ef86c7f439f536e6949/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract';
import startContract from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('perfil', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Usuario-perfil', {
        check: () => placeholder('backfill-Usuario-perfil:check'),
        run: () => placeholder('backfill-Usuario-perfil:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Usuario', column: 'perfil' }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_perfil_check_1159265b',
        expression: "\"perfil\" IN ('ADMINISTRADOR', 'FUNCIONARIO')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
