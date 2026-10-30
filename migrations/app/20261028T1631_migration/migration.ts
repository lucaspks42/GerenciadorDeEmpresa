#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract';
import endContract from '../../snapshots/78f72c04c83ceca6d4ad4f32064271c095a99e415b3c0ca2a4f78792243cb0db/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract';
import startContract from '../../snapshots/93a02b35f6c8bf323ebb37f0b901c58b5ecbca3833cf8fd1245e9a4fbf591e5a/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  placeholder,
  primaryKey,
} from '@prisma/orm-postgres/migration';

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
      this.createTable({
        schema: 'public',
        table: 'SolicitacaoCadastro',
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
          col('status', 'text', {
            notNull: true,
            default: lit('PENDENTE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'SolicitacaoCadastro_status_check_a1b2d3c8',
            "\"status\" IN ('PENDENTE', 'APROVADO', 'RECUSADO')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('administradorPrincipal', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
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
      this.addColumn({
        schema: 'public',
        table: 'Usuario',
        column: col('telefone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
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
      this.addUnique({
        schema: 'public',
        table: 'Empresa',
        constraint: 'Empresa_cnpj_key',
        columns: ['cnpj'],
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
      this.addCheckConstraint({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_perfil_check_1159265b',
        expression: "\"perfil\" IN ('ADMINISTRADOR', 'FUNCIONARIO')",
      }),
      this.addUnique({
        schema: 'public',
        table: 'Usuario',
        constraint: 'Usuario_cpf_key',
        columns: ['cpf'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContaBancariaEmpresa',
        index: 'ContaBancariaEmpresa_empresaId_idx_2ace4994',
        columns: ['empresaId'],
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
        table: 'ContaBancariaEmpresa',
        foreignKey: {
          name: 'ContaBancariaEmpresa_empresaId_fkey',
          columns: ['empresaId'],
          references: { schema: 'public', table: 'Empresa', columns: ['id'] },
          onDelete: 'cascade',
        },
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
