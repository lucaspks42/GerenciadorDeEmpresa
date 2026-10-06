"use client";

import { usePathname } from "next/navigation";
import { useSearch } from "../context/SearchContext";
import { Input } from "./Input";

export default function Header() {
  const pathname = usePathname();

  const { buscar, setBuscar } = useSearch();

  let titulo = "Dashboard";

  if (pathname === "/clientes") {
    titulo = "Clientes";
  } else if (pathname === "/pagamentos") {
    titulo = "Pagamentos";
  } else if (pathname === "/tarefas") {
    titulo = "Tarefas";
  } else if (pathname === "/administração") {
    titulo = "Painel Administrativo";
  }

  return (
    <header className="w-full border-b border-border h-16 px-10 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{titulo}</h1>

      <div className="w-96">
        <Input
          value={buscar}
          onChange={(e) => {
            console.log("DIGITOU:", e.target.value);
            setBuscar(e.target.value);
          }}
        />
      </div>
    </header>
  );
}
