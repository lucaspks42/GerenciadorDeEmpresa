export type ContaBancariaEmpresa = {
  id: number;
  banco: string;
  agencia: string;
  conta: string;
  tipo: string;
  principal: boolean;
};

export type EmpresaFormData = {
  // Identificação
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  dataAbertura: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  naturezaJuridica: string;
  porteEmpresarial: string;
  situacaoCadastral: string;
  cnaePrincipal: string;

  // Endereço
  cep: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  numero: string;
  logradouro: string;
  complemento: string;
  pontoReferencia: string;
  tipoEstabelecimento: string;

  // Contato
  telefonePrincipal: string;
  telefoneSecundario: string;
  whatsapp: string;
  emailPrincipal: string;
  emailFinanceiro: string;
  emailComercial: string;
  site: string;
  instagram: string;
  facebook: string;
  linkedin: string;

  // Dados fiscais
  regimeTributario: string;
  regimeApuracao: string;
  crt: string;
  indicadorICMS: string;
  responsavelContabil: string;
  crcContador: string;
  emailContabilidade: string;
  tipoCertificado: string;
  validadeCertificado: string;

  // Dados financeiros
  titularConta: string;
  documentoTitular: string;
  tipoPix: string;
  chavePix: string;

  // Identidade visual
  logo: string;
  corPrincipal: string;
  corSecundaria: string;
  corApoio: string;
  slogan: string;

  // Responsáveis
  responsavelLegal: string;
  cpfResponsavel: string;
  responsavelFinanceiro: string;

  // Descrição
  descricaoEmpresa: string;
};

export const empresaInicial: EmpresaFormData = {
  // Identificação
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  dataAbertura: "",
  inscricaoEstadual: "",
  inscricaoMunicipal: "",
  naturezaJuridica: "",
  porteEmpresarial: "",
  situacaoCadastral: "",
  cnaePrincipal: "",

  // Endereço
  cep: "",
  pais: "Brasil",
  estado: "",
  cidade: "",
  bairro: "",
  numero: "",
  logradouro: "",
  complemento: "",
  pontoReferencia: "",
  tipoEstabelecimento: "",

  // Contato
  telefonePrincipal: "",
  telefoneSecundario: "",
  whatsapp: "",
  emailPrincipal: "",
  emailFinanceiro: "",
  emailComercial: "",
  site: "",
  instagram: "",
  facebook: "",
  linkedin: "",

  // Dados fiscais
  regimeTributario: "",
  regimeApuracao: "",
  crt: "",
  indicadorICMS: "",
  responsavelContabil: "",
  crcContador: "",
  emailContabilidade: "",
  tipoCertificado: "naoPossui",
  validadeCertificado: "",

  // Dados financeiros
  titularConta: "",
  documentoTitular: "",
  tipoPix: "cnpj",
  chavePix: "",

  // Identidade visual
  logo: "",
  corPrincipal: "#3B82F6",
  corSecundaria: "#6366F1",
  corApoio: "#0EA5E9",
  slogan: "",

  // Responsáveis
  responsavelLegal: "",
  cpfResponsavel: "",
  responsavelFinanceiro: "",

  // Descrição
  descricaoEmpresa: "",
};

export const contaBancariaInicial: ContaBancariaEmpresa = {
  id: 1,
  banco: "",
  agencia: "",
  conta: "",
  tipo: "Corrente",
  principal: true,
};
