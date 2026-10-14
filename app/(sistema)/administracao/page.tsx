"use client";

import ContadoresPendente from "@/components/ui/ContadoresPendente";
import ModalPermissao from "@/components/ui/ModalPermicoes";
import ModalUsuario from "@/components/ui/ModalUsuario";

import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoShieldOutline } from "react-icons/io5";

export default function Administracao() {
  const [modalAberto, setModalAberto] = useState(false);

  const fecharModal = () => {
    setModalAberto(false);
  };

  const [usuario, setUsuario] = useState(false);

  const fecharUsuario = () => {
    setUsuario(false);
  };

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground">
      {modalAberto && <ModalPermissao onClose={fecharModal} />}
      {usuario && <ModalUsuario onClose={fecharUsuario} />}

      <div className="px-12 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Administração</h1>

          <p className="mt-2 text-muted-foreground">
            Gerencie usuários, funcionários e permissões do sistema.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="min-h-44 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
            <div className="flex h-full flex-col justify-between">
              <CiUser className="text-4xl text-primary" />

              <div>
                <p className="text-2xl font-semibold">Pendentes</p>

                <div className="mt-1 text-sm text-muted-foreground">
                  <ContadoresPendente />
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-44 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
            <div className="flex h-full flex-col justify-between">
              <CiUser className="text-4xl text-primary" />

              <div>
                <p className="text-2xl font-semibold">Funcionários</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  3 funcionários cadastrados
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-44 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40">
            <div className="flex h-full flex-col justify-between">
              <IoShieldOutline className="text-4xl text-primary" />

              <div>
                <p className="text-2xl font-semibold">Permissões</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Controle de acesso
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Acesso rápido</h2>

          <div className="grid  gap-5">
            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="rounded-xl bg-primary/10 p-3">
                <IoShieldOutline className="text-3xl text-primary" />
              </div>

              <div>
                <p className="font-semibold">
                  Solicitações de acesso ao sistema
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Visualize o acessos de usuários ao sistema.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUsuario(true)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="rounded-xl bg-primary/10 p-3">
                <CiUser className="text-3xl text-primary" />
              </div>

              <div>
                <p className="font-semibold">Funcionarios</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Controle o acesso dos funcionários.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
