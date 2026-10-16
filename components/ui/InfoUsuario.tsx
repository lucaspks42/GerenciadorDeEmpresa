import { Usuario } from "@/types/Usuario";
import { X } from "lucide-react";
import { use, useState } from "react";

export type InfoUsuarioProps = {
  fecharModal: () => void;
  usuario: Usuario;
  atualizarUsuario: (usuario: Usuario) => void;
};

export default function InfoUsuario({
  fecharModal,
  usuario,
  atualizarUsuario,
}: InfoUsuarioProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [telefone, setTelefone] = useState(usuario.telefone);

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop:blur-sm p-6">
      <div className="w-full max-w-6xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{usuario.nome}</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Informações do funcionario
            </p>
          </div>

          <button
            onClick={fecharModal}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-accent transition-colors"
          >
            <X />
          </button>
        </header>

        <div className="p-8 gap-5 grid grid-cols-3 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Telefone</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
