import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "tarefas.db");

const db = new DatabaseSync(dbPath);

// Tabela de clientes
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    valor_mensalidade REAL,
    dia_vencimento INTEGER
  )
`);

// Verifica as colunas existentes em clientes
const colunasClientesExistentes = db
  .prepare("PRAGMA table_info(clientes)")
  .all() as {
  name: string;
}[];

const nomesColunasClientes = colunasClientesExistentes.map(
  (coluna) => coluna.name,
);

// Adiciona valor_mensalidade caso não exista
if (!nomesColunasClientes.includes("valor_mensalidade")) {
  db.exec(`
    ALTER TABLE clientes
    ADD COLUMN valor_mensalidade REAL
  `);
}

// Adiciona dia_vencimento caso não exista
if (!nomesColunasClientes.includes("dia_vencimento")) {
  db.exec(`
    ALTER TABLE clientes
    ADD COLUMN dia_vencimento INTEGER
  `);
}

// Tabela de pagamentos
db.exec(`
  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    dia_vencimento INTEGER,
    data_vencimento TEXT,
    status TEXT DEFAULT 'Pendente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  )
`);

// Verifica as colunas existentes em pagamentos
const colunasPagamentosExistentes = db
  .prepare("PRAGMA table_info(pagamentos)")
  .all() as {
  name: string;
}[];

const nomesColunasPagamentos = colunasPagamentosExistentes.map(
  (coluna) => coluna.name,
);

// Adiciona data_vencimento caso não exista
if (!nomesColunasPagamentos.includes("data_vencimento")) {
  db.exec(`
    ALTER TABLE pagamentos
    ADD COLUMN data_vencimento TEXT
  `);
}

// Adiciona status caso não exista
if (!nomesColunasPagamentos.includes("status")) {
  db.exec(`
    ALTER TABLE pagamentos
    ADD COLUMN status TEXT DEFAULT 'Pendente'
  `);
}

// Mostra as estruturas no terminal
const colunasClientes = db.prepare("PRAGMA table_info(clientes)").all();

const colunasPagamentos = db.prepare("PRAGMA table_info(pagamentos)").all();

console.log("Colunas clientes:", colunasClientes);
console.log("Colunas pagamentos:", colunasPagamentos);

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
