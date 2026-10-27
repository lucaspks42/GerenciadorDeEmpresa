import { BadgeCheck, Layers } from "lucide-react";

type CabecalhoProps = {
  icon: React.ElementType;
  titulo: string;
  descricao: string;
};

function Cabecalho({ icon: Icon, titulo, descricao }: CabecalhoProps) {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
        <Icon size={19} className="text-blue-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-100">{titulo}</h3>
        <p className="mt-1 text-xs text-slate-500">{descricao}</p>
      </div>
    </div>
  );
}

export default function IdentificacaoEmpresa() {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  return (
    <div className="flex flex-col gap-5">
      <section className={classeCard}>
        <Cabecalho
          icon={BadgeCheck}
          titulo="Identificação empresarial"
          descricao="Informações básicas e dados de registro da empresa."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Razão social</label>
            <input
              type="text"
              placeholder="Ex: Empresa LTDA"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Nome fantasia</label>
            <input
              type="text"
              placeholder="Nome comercial"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>CNPJ</label>
            <input
              type="text"
              placeholder="00.000.000/0000-00"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Data de abertura</label>
            <input type="date" className={classeInput} />
          </div>

          <div>
            <label className={classeLabel}>Inscrição estadual</label>
            <input
              type="text"
              placeholder="Número da inscrição estadual"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Inscrição municipal</label>
            <input
              type="text"
              placeholder="Número da inscrição municipal"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      <section className={classeCard}>
        <Cabecalho
          icon={Layers}
          titulo="Classificação empresarial"
          descricao="Defina o enquadramento e a situação cadastral."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Natureza jurídica</label>
            <select className={classeInput} name="naturezaJuridica">
              <option>Sociedade Limitada (LTDA)</option>
              <option>Empresário Individual</option>
              <option>EIRELI</option>
              <option>MEI</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>Porte empresarial</label>
            <select className={classeInput} name="porteEmpresarial">
              <option value="">Selecione o porte</option>
              <option>Microempresa</option>
              <option>Empresa de Pequeno Porte</option>
              <option>Médio Porte</option>
              <option>Grande Porte</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>Situação cadastral</label>
            <select className={classeInput} name="situacaoCadastral">
              <option value="">Selecione a situação</option>
              <option>Ativa</option>
              <option>Inativa</option>
              <option>Suspensa</option>
            </select>
          </div>

          <div>
            <label className={classeLabel}>CNAE principal</label>
            <input
              type="text"
              placeholder="Código da atividade principal"
              className={classeInput}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
