import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "tarefas.db");

const db = new DatabaseSync(dbPath);

export default db;
