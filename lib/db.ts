import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "tarefas.db");

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

export default db;