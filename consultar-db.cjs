const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("tarefas.db");

const tabelas = db
  .prepare(
    "SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY name",
  )
  .all();

console.log(tabelas);

db.close();
