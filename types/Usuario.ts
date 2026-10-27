export type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  dataNascimento: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cargo: string | null;
  departamento: string | null;
  dataAdmissao: string | null;

  // Tipo básico da conta.
  perfil: "ADMINISTRADOR" | "FUNCIONARIO";

  // Perfil personalizado de acesso.
  perfilAcessoId: string | null;

  administradorPrincipal: boolean;
  status: boolean;
};
