import { Cliente } from "@/types/Cliente";
import { useEffect, useState } from "react";

export default function ContadoresClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function buscarCliente() {
      const resposta = await fetch("/api/clientes");
      const dados = await resposta.json();

      setClientes(dados);
    }

    buscarCliente();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-5">
      <p className="text-3xl font-bold text-foreground">{clientes.length}</p>
    </div>
  );
}
