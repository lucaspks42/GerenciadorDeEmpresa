#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1820bf2e34cad36faf8fd257085676696d3f99f455bc5881e9e296f515e9e7a3/contract';
import endContract from '../../snapshots/1820bf2e34cad36faf8fd257085676696d3f99f455bc5881e9e296f515e9e7a3/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2b4c41ab3b19b3ca7c067cc359e339bf6d131439a7f84a1641b3c1ffc61db5ee/contract';
import startContract from '../../snapshots/2b4c41ab3b19b3ca7c067cc359e339bf6d131439a7f84a1641b3c1ffc61db5ee/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('bairro', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('cargo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('cep', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('cidade', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('cpf', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('dataAdmissao', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('dataNascimento', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('departamento', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('endereco', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('estado', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('numero', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('telefone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_cpf_key',
        columns: ['cpf'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
