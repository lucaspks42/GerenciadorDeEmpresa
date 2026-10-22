"use client";

import { ShieldCheck } from "lucide-react";
import { Input } from "../../buttons/input";
import { useSearch } from "@/components/context/SearchContext";
import { useState } from "react";
import ModalPerfil from "./components/ModalPerfil";

type PerfisAcessoProps = {
  onGerenciarPermissoes: () => void;
};

export default function PerfisAcesso({
  onGerenciarPermissoes,
}: PerfisAcessoProps) {
  const { buscar, setBuscar } = useSearch();
  const [modalAberto, setModalAberto] = useState(false);
  const fecharModal = () => setModalAberto(false);
  return (
    <main>
      {modalAberto && <ModalPerfil onClose={fecharModal} />}
      <div className="p-6 gap-10">
        <h2 className="text-lg font-semibold text-white">Perfis cadastrados</h2>
        {/* Barra de pesquisa */}
        <div>
          <div className="w-full">
            <Input
              value={buscar}
              onChange={(e) => {
                console.log("DIGITOU:", e.target.value);
                setBuscar(e.target.value);
              }}
              placeholder="Pesquisar perfil..."
            />
          </div>
        </div>

        <div className="py-4">
          <button
            onClick={() => setModalAberto(true)}
            className="w-full cursor-pointer rounded-xl border border-blue-400/20 bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-500"
          >
            +Novo Perfil
          </button>
        </div>
      </div>
    </main>
  );
}
