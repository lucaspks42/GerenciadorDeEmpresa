"use client";

import { Usuario } from "@/types/Usuario";
import { X } from "lucide-react";
import { useState } from "react";

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
  const [telefone, setTelefone] = useState(usuario.telefone ?? "");
  const [cpf, setCpf] = useState(usuario.cpf ?? "");
  const [dataNascimento, setDataNascimento] = useState(
    usuario.dataNascimento ?? "",
  );
  const [cep, setCep] = useState(usuario.cep ?? "");
  const [endereco, setEndereco] = useState(usuario.endereco ?? "");
  const [numero, setNumero] = useState(usuario.numero ?? "");
  const [bairro, setBairro] = useState(usuario.bairro ?? "");
  const [cidade, setCidade] = useState(usuario.cidade ?? "");
  const [estado, setEstado] = useState(usuario.estado ?? "");
  const [cargo, setCargo] = useState(usuario.cargo ?? "");
  const [departamento, setDepartamento] = useState(usuario.departamento ?? "");
  const [dataAdmissao, setDataAdmissao] = useState(usuario.dataAdmissao ?? "");

  const [carregandoCep, setCarregandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setErroCep("Informe um CEP válido.");
      return;
    }

    setCarregandoCep(true);
    setErroCep("");

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );

      const dados = await resposta.json();

      if (!resposta.ok || dados.erro) {
        setErroCep("CEP não encontrado.");
        return;
      }

      setEndereco(dados.logradouro || "");
      setBairro(dados.bairro || "");
      setCidade(dados.localidade || "");
      setEstado(dados.uf || "");
    } catch (erro) {
      console.error("Erro ao consultar CEP:", erro);
      setErroCep("Não foi possível consultar o CEP.");
    } finally {
      setCarregandoCep(false);
    }
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return `(${numeros}`;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  async function salvarAlteracoes() {
    try {
      const resposta = await fetch(`/api/admin/usuarios/${usuario.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone: telefone.trim() || null,
          cpf: cpf.trim() || null,
          dataNascimento: dataNascimento || null,
          cep: cep.trim() || null,
          endereco: endereco.trim() || null,
          numero: numero.trim() || null,
          bairro: bairro.trim() || null,
          cidade: cidade.trim() || null,
          estado: estado.trim() || null,
          cargo: cargo.trim() || null,
          departamento: departamento.trim() || null,
          dataAdmissao: dataAdmissao || null,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        alert(
          resultado.erro || resultado.mensagem || "Erro ao atualizar usuário",
        );
        return;
      }

      atualizarUsuario({
        ...usuario,
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim() || null,
        cpf: cpf.trim() || null,
        dataNascimento: dataNascimento || null,
        cep: cep.trim() || null,
        endereco: endereco.trim() || null,
        numero: numero.trim() || null,
        bairro: bairro.trim() || null,
        cidade: cidade.trim() || null,
        estado: estado.trim() || null,
        cargo: cargo.trim() || null,
        departamento: departamento.trim() || null,
        dataAdmissao: dataAdmissao || null,
      });

      fecharModal();

      alert("Usuário atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop:blur-sm p-6">
      <div className="w-full max-w-6xl max-h-[90vh] bg-card text-card-foreground border border-border rounded-2xl flex flex-col shadow-2xl">
        <header className="border-b border-border px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{usuario.nome}</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Informações do funcionário
            </p>
          </div>

          <button
            onClick={fecharModal}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-accent transition-colors"
          >
            <X />
          </button>
        </header>

        <div className="p-8 gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Telefone</label>
            <input
              type="tel"
              placeholder="Informe o telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">CPF</label>
            <input
              type="text"
              placeholder="Informe o CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">
              Data de Nascimento
            </label>
            <input
              type="date"
              placeholder="Data de nascimento"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">CEP</label>
            <input
              type="text"
              placeholder="Digite aqui o CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={buscarCep}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />

            {carregandoCep && (
              <p className="text-xs text-muted-foreground">
                Consultando CEP...
              </p>
            )}

            {erroCep && <p className="text-xs text-red-500">{erroCep}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Endereço</label>
            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Numero</label>
            <input
              type="text"
              placeholder="Numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Bairro</label>
            <input
              type="text"
              placeholder="bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Cidade</label>
            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Estado</label>
            <input
              type="text"
              placeholder="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Cargo</label>
            <input
              type="text"
              placeholder="Digite aqui o cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">
              Departamento
            </label>
            <input
              type="text"
              placeholder="Digite aqui o departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">
              Data Admissão
            </label>
            <input
              type="date"
              placeholder="Digite aqui o cargo"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
              className="border border-border bg-background text-foreground rounded-xl p-3 outline-none"
            />
          </div>
        </div>

        <footer className="border-t border-border px-8 py-5 flex justify-end gap-3">
          <button
            onClick={fecharModal}
            className="px-5 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={salvarAlteracoes}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Salvar alterações
          </button>
        </footer>
      </div>
    </main>
  );
}
