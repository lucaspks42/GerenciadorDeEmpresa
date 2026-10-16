export type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: "ADMINISTRADOR" | "FUNCIONARIO";
};
