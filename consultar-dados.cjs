const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("tarefas.db");

console.log("\n===== CLIENTES =====");
console.log(
  db
    .prepare(
      `
    SELECT id, nome, empresa
    FROM clientes
    ORDER BY id
  `,
    )
    .all(),
);

console.log("\n===== CLIENTES REFERENCIADOS NOS PAGAMENTOS =====");
console.log(
  db
    .prepare(
      `
    SELECT cliente_id, COUNT(*) AS quantidade
    FROM pagamentos
    GROUP BY cliente_id
    ORDER BY cliente_id
  `,
    )
    .all(),
);

console.log("\n===== PAGAMENTOS SEM CLIENTE =====");
console.log(
  db
    .prepare(
      `
    SELECT p.id, p.cliente_id, p.valor, p.data_vencimento, p.status
    FROM pagamentos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    WHERE c.id IS NULL
    ORDER BY p.id
  `,
    )
    .all(),
);

db.close();
