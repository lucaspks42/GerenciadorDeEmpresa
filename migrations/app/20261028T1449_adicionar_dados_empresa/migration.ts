#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract';
import endContract from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8a2f610575585c0ffb0fdf197c51f37730e4ae2b3b9bddde3a6f4735421ea6c4/contract';
import startContract from '../../snapshots/8a2f610575585c0ffb0fdf197c51f37730e4ae2b3b9bddde3a6f4735421ea6c4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ContaBancariaEmpresa',
        columns: [
          col('agencia', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('atualizadoEm', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('banco', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('conta', 'character varying(40)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 40 } },
          }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('empresaId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('principal', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('tipo', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Empresa',
        columns: [
          col('atualizadoEm', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('bairro', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('cep', 'character varying(9)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 9 } },
          }),
          col('chavePix', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('cidade', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('cnaePrincipal', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('cnpj', 'character varying(18)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 18 } },
          }),
          col('complemento', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('corApoio', 'character varying(7)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 7 } },
          }),
          col('corPrincipal', 'character varying(7)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 7 } },
          }),
          col('corSecundaria', 'character varying(7)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 7 } },
          }),
          col('cpfResponsavel', 'character varying(14)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 14 } },
          }),
          col('crcContador', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('crt', 'character varying(5)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('dataAbertura', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'character varying(1000)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 1000 } },
          }),
          col('documentoTitular', 'character varying(18)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 18 } },
          }),
          col('emailComercial', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('emailContabilidade', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('emailFinanceiro', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('emailPrincipal', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('estado', 'character varying(80)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 80 } },
          }),
          col('facebook', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('id', 'int4', { notNull: true, default: lit(1), codecRef: { codecId: 'pg/int4@1' } }),
          col('indicadorICMS', 'character varying(5)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 5 } },
          }),
          col('inscricaoEstadual', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('inscricaoMunicipal', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('instagram', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('linkedin', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('logoUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('logradouro', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('naturezaJuridica', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('nomeFantasia', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('numero', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('pais', 'character varying(80)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 80 } },
          }),
          col('pontoReferencia', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('porteEmpresarial', 'character varying(50)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('razaoSocial', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('regimeApuracao', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('regimeTributario', 'character varying(40)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 40 } },
          }),
          col('responsavelContabil', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('responsavelFinanceiro', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('responsavelLegal', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('site', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('situacaoCadastral', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('slogan', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('telefonePrincipal', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('telefoneSecundario', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('tipoCertificado', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('tipoEstabelecimento', 'character varying(40)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 40 } },
          }),
          col('tipoPix', 'character varying(30)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
          col('titularConta', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('validadeCertificado', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('whatsapp', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Empresa',
        constraint: 'Empresa_cnpj_key',
        columns: ['cnpj'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContaBancariaEmpresa',
        index: 'ContaBancariaEmpresa_empresaId_idx_2ace4994',
        columns: ['empresaId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContaBancariaEmpresa',
        foreignKey: {
          name: 'ContaBancariaEmpresa_empresaId_fkey',
          columns: ['empresaId'],
          references: { schema: 'public', table: 'Empresa', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
