"use client";

import { createContext, useContext, useState } from "react";
import type { Cliente } from "@/types/Cliente";

type SearchContextType = {
  buscar: string;
  setBuscar: (valor: string) => void;
  clienteSelecionado: Cliente | null;
  setClienteSelecionado: (cliente: Cliente | null) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [buscar, setBuscar] = useState("");

  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );

  return (
    <SearchContext.Provider
      value={{
        buscar,
        setBuscar,
        clienteSelecionado,
        setClienteSelecionado,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch deve ser usado dentro de SearchProvider");
  }

  return context;
}
