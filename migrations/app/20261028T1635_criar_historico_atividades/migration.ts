#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract';
import startContract from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eadce7355c40ac7f8afaf51a74c647890d592edb63521b9982cb3c1845a2a03c/contract';
import endContract from '../../snapshots/eadce7355c40ac7f8afaf51a74c647890d592edb63521b9982cb3c1845a2a03c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'HistoricoAtividade',
        columns: [
          col('acao', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('dadosAnteriores', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('dadosNovos', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('descricao', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('entidade', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('entidadeId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ip', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('modulo', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('status', 'character varying(30)', {
            notNull: true,
            default: lit('SUCESSO'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('usuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('usuarioNome', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoAtividade',
        index: 'HistoricoAtividade_acao_idx_aaf04231',
        columns: ['acao'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoAtividade',
        index: 'HistoricoAtividade_criadoEm_idx_f1f7cf71',
        columns: ['criadoEm'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoAtividade',
        index: 'HistoricoAtividade_modulo_idx_4244472c',
        columns: ['modulo'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoAtividade',
        index: 'HistoricoAtividade_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoAtividade',
        index: 'HistoricoAtividade_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
