"use client";

import { usePathname } from "next/navigation";
import { useSearch } from "../context/SearchContext";
import { InputGroupDemo } from "./InputGroupDemo";

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
  }

  return (
    <header className="w-full border-b border-border h-16 px-10 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{titulo}</h1>

      <div className="w-96">
        <InputGroupDemo
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
