"use client";

import { Usuario } from "@/types/Usuario";
import {
  X,
  UserRound,
  MapPin,
  BriefcaseBusiness,
  LoaderCircle,
  Save,
  ShieldCheck,
  Trash,
} from "lucide-react";
import { ReactNode, useState } from "react";

export type InfoUsuarioProps = {
  fecharModal: () => void;
  usuario: Usuario;
  atualizarUsuario: (usuario: Usuario) => void;
  removerUsuario: (id: number) => void;
};

const inputClass =
  "w-full h-11 rounded-xl border border-white/[0.08] bg-[#0d0d19]/80 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-blue-400/30 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/15";

type FieldProps = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, className = "", children }: FieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-slate-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

type SectionProps = {
  titulo: string;
  descricao: string;
  icone: ReactNode;
  children: ReactNode;
};

function Section({ titulo, descricao, icone, children }: SectionProps) {
  return (
    <section className="grid grid-cols-1 gap-6 border-b border-white/[0.07] py-8 first:pt-0 last:border-b-0 last:pb-0 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-400">
          {icone}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{titulo}</h3>
          <p className="mt-1 max-w-[190px] text-xs leading-relaxed text-slate-500">
            {descricao}
          </p>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

function dataParaInput(valor: string | null | undefined) {
  return valor ? valor.slice(0, 10) : "";
}

export default function InfoUsuario({
  fecharModal,
  usuario,
  atualizarUsuario,
  removerUsuario,
}: InfoUsuarioProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [telefone, setTelefone] = useState(usuario.telefone ?? "");
  const [cpf, setCpf] = useState(usuario.cpf ?? "");

  const [dataNascimento, setDataNascimento] = useState(
    dataParaInput(usuario.dataNascimento),
  );

  const [cep, setCep] = useState(usuario.cep ?? "");
  const [endereco, setEndereco] = useState(usuario.endereco ?? "");
  const [numero, setNumero] = useState(usuario.numero ?? "");
  const [bairro, setBairro] = useState(usuario.bairro ?? "");
  const [cidade, setCidade] = useState(usuario.cidade ?? "");
  const [estado, setEstado] = useState(usuario.estado ?? "");
  const [status, setStatus] = useState(usuario.status);

  const [cargo, setCargo] = useState(usuario.cargo ?? "");
  const [departamento, setDepartamento] = useState(usuario.departamento ?? "");

  const [dataAdmissao, setDataAdmissao] = useState(
    dataParaInput(usuario.dataAdmissao),
  );

  const [excluindo, setExcluindo] = useState(false);

  const [perfil, setPerfil] = useState<Usuario["perfil"]>(usuario.perfil);

  const [carregandoCep, setCarregandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [salvando, setSalvando] = useState(false);

  const iniciais = usuario.nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (!cepLimpo) {
      setErroCep("");
      return;
    }

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

  function formatarCPF(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  async function salvarAlteracoes() {
    if (salvando) return;

    setSalvando(true);

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
          perfil,
          status,
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
        perfil,
        status,
      });

      fecharModal();
      alert("Usuário atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  }

  async function deletarUsuario(id: number) {
    if (excluindo) return;

    if (usuario.administradorPrincipal) {
      alert("Não é possível excluir o administrador principal.");
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o usuário "${usuario.nome}"? Essa ação não poderá ser desfeita.`,
    );

    if (!confirmar) return;

    setExcluindo(true);

    try {
      const resposta = await fetch(`/api/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const texto = await resposta.text();

      let resultado: { erro?: string; mensagem?: string } = {};

      try {
        resultado = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error("O servidor retornou uma resposta inválida.");
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.mensagem ||
            `Erro ao excluir usuário. Código: ${resposta.status}`,
        );
      }

      removerUsuario(id);
      fecharModal();

      alert(resultado.mensagem || "Usuário excluído com sucesso!");
    } catch (erro) {
      console.error("Erro ao deletar usuário:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível excluir o usuário.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11111f] text-white shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
        {/* Cabeçalho */}
        <header className="relative flex items-center justify-between gap-4 overflow-hidden border-b border-white/[0.07] px-6 py-5 sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="relative flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-sm font-bold text-blue-300 shadow-inner">
              {iniciais}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-white">
                {usuario.nome}
              </h2>

              <p className="mt-1 truncate text-xs text-slate-400">
                Gerenciamento de informações do funcionário
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => deletarUsuario(usuario.id)}
              disabled={excluindo || usuario.administradorPrincipal}
              title={
                usuario.administradorPrincipal
                  ? "O administrador principal não pode ser excluído."
                  : "Excluir usuário"
              }
              aria-label="Excluir usuário"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {excluindo ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Trash size={18} />
              )}
            </button>
            <button
              onClick={fecharModal}
              aria-label="Fechar"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="overflow-y-auto px-6 py-8 sm:px-8">
          <Section
            titulo="Dados pessoais"
            descricao="Informações de identificação e contato do funcionário."
            icone={<UserRound size={19} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="usuario-nome" label="Nome completo">
                <input
                  id="usuario-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do funcionário"
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-email" label="E-mail">
                <input
                  id="usuario-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-telefone" label="Telefone">
                <input
                  id="usuario-telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-cpf" label="CPF">
                <input
                  id="usuario-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatarCPF(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-nascimento" label="Data de nascimento">
                <input
                  id="usuario-nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-status" label="Status do usuário">
                <select
                  id="usuario-status"
                  value={status ? "true" : "false"}
                  onChange={(e) => setStatus(e.target.value === "true")}
                  className={inputClass}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section
            titulo="Endereço"
            descricao="Localização e informações de residência do funcionário."
            icone={<MapPin size={19} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
              <Field id="usuario-cep" label="CEP" className="sm:col-span-2">
                <input
                  id="usuario-cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    setErroCep("");
                  }}
                  onBlur={buscarCep}
                  className={inputClass}
                />

                {carregandoCep && (
                  <p className="flex items-center gap-2 text-xs text-blue-400">
                    <LoaderCircle size={13} className="animate-spin" />
                    Consultando CEP...
                  </p>
                )}

                {erroCep && <p className="text-xs text-red-400">{erroCep}</p>}
              </Field>

              <Field
                id="usuario-endereco"
                label="Endereço"
                className="sm:col-span-4"
              >
                <input
                  id="usuario-endereco"
                  type="text"
                  placeholder="Rua, avenida..."
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                id="usuario-numero"
                label="Número"
                className="sm:col-span-2"
              >
                <input
                  id="usuario-numero"
                  type="text"
                  placeholder="Nº"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                id="usuario-bairro"
                label="Bairro"
                className="sm:col-span-4"
              >
                <input
                  id="usuario-bairro"
                  type="text"
                  placeholder="Bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                id="usuario-cidade"
                label="Cidade"
                className="sm:col-span-4"
              >
                <input
                  id="usuario-cidade"
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                id="usuario-estado"
                label="Estado"
                className="sm:col-span-2"
              >
                <input
                  id="usuario-estado"
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          <Section
            titulo="Informações profissionais"
            descricao="Dados relacionados à função e ao vínculo com a empresa."
            icone={<BriefcaseBusiness size={19} />}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="usuario-cargo" label="Cargo">
                <input
                  id="usuario-cargo"
                  type="text"
                  placeholder="Ex.: Analista de TI"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-departamento" label="Departamento">
                <input
                  id="usuario-departamento"
                  type="text"
                  placeholder="Ex.: Tecnologia da Informação"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field id="usuario-admissao" label="Data de admissão">
                <input
                  id="usuario-admissao"
                  type="date"
                  value={dataAdmissao}
                  onChange={(e) => setDataAdmissao(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Permissões de acesso */}
          <Section
            titulo="Permissões de acesso"
            descricao="Define quais áreas e funcionalidades o usuário poderá administrar."
            icone={<ShieldCheck size={19} />}
          >
            <div className="space-y-3">
              <Field id="usuario-perfil" label="Perfil do usuário">
                <select
                  id="usuario-perfil"
                  value={perfil}
                  onChange={(e) =>
                    setPerfil(e.target.value as Usuario["perfil"])
                  }
                  disabled={usuario.administradorPrincipal}
                  className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value="FUNCIONARIO">Funcionário</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </Field>

              {usuario.administradorPrincipal ? (
                <p className="text-xs leading-relaxed text-amber-400">
                  Este é o administrador principal da empresa. Seu nível de
                  acesso não pode ser alterado.
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-slate-500">
                  Administradores têm acesso ao painel administrativo.
                  Funcionários possuem acesso limitado às permissões concedidas.
                </p>
              )}
            </div>
          </Section>
        </div>

        {/* Rodapé */}
        <footer className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-[#0d0d19]/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="hidden text-xs text-slate-500 sm:block">
            As alterações serão aplicadas ao perfil do funcionário.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={fecharModal}
              disabled={salvando}
              className="h-10 rounded-xl border border-white/[0.09] px-5 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={salvarAlteracoes}
              disabled={salvando}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
