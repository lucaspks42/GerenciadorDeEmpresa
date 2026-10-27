#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8a2f610575585c0ffb0fdf197c51f37730e4ae2b3b9bddde3a6f4735421ea6c4/contract';
import endContract from '../../snapshots/8a2f610575585c0ffb0fdf197c51f37730e4ae2b3b9bddde3a6f4735421ea6c4/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract';
import startContract from '../../snapshots/c69c33a66a39d0ffc3a23a41366a1c7b7b1b434b194b771d788c505c9c34e3a2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'HistoricoPerfil',
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
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('perfilAcessoId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('usuarioId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Modulo',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('nome', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('slug', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'PerfilAcesso',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('nome', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('observacoes', 'character varying(300)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 300 } },
          }),
          col('permissoesVizualizacao', 'character varying(30)', {
            notNull: true,
            default: lit('todos'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'PerfilPermissao',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('perfilAcessoId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('permissaoId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Permissao',
        columns: [
          col('chave', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('moduloId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('nome', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('perfilAcessoId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('status', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Modulo',
        constraint: 'Modulo_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PerfilAcesso',
        constraint: 'PerfilAcesso_nome_key',
        columns: ['nome'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PerfilPermissao',
        constraint: 'PerfilPermissao_perfilAcessoId_permissaoId_key',
        columns: ['perfilAcessoId', 'permissaoId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Permissao',
        constraint: 'Permissao_chave_key',
        columns: ['chave'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoPerfil',
        index: 'HistoricoPerfil_criadoEm_idx_f1f7cf71',
        columns: ['criadoEm'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoPerfil',
        index: 'HistoricoPerfil_perfilAcessoId_idx_66e1fefe',
        columns: ['perfilAcessoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'HistoricoPerfil',
        index: 'HistoricoPerfil_usuarioId_idx_5f01c7d6',
        columns: ['usuarioId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PerfilPermissao',
        index: 'PerfilPermissao_perfilAcessoId_idx_66e1fefe',
        columns: ['perfilAcessoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PerfilPermissao',
        index: 'PerfilPermissao_permissaoId_idx_32efd59e',
        columns: ['permissaoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Permissao',
        index: 'Permissao_moduloId_idx_d014a124',
        columns: ['moduloId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Usuario',
        index: 'Usuario_perfilAcessoId_idx_66e1fefe',
        columns: ['perfilAcessoId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PerfilPermissao',
        foreignKey: {
          name: 'PerfilPermissao_perfilAcessoId_fkey',
          columns: ['perfilAcessoId'],
          references: { schema: 'public', table: 'PerfilAcesso', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PerfilPermissao',
        foreignKey: {
          name: 'PerfilPermissao_permissaoId_fkey',
          columns: ['permissaoId'],
          references: { schema: 'public', table: 'Permissao', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Permissao',
        foreignKey: {
          name: 'Permissao_moduloId_fkey',
          columns: ['moduloId'],
          references: { schema: 'public', table: 'Modulo', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Usuario',
        foreignKey: {
          name: 'Usuario_perfilAcessoId_fkey',
          columns: ['perfilAcessoId'],
          references: { schema: 'public', table: 'PerfilAcesso', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
