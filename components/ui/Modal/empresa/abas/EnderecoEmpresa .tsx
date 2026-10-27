import { MapPin, Store } from "lucide-react";

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

export default function EnderecoEmpresa() {
  const classeInput =
    "w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#090914] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10";

  const classeLabel =
    "mb-2 block text-xs font-medium tracking-wide text-slate-400";

  const classeCard =
    "rounded-2xl border border-white/[0.08] bg-[#10101d]/80 p-5 sm:p-6";

  return (
    <div className="flex flex-col gap-5">
      {/* LOCALIZAÇÃO */}
      <section className={classeCard}>
        <Cabecalho
          icon={MapPin}
          titulo="Localização"
          descricao="Endereço completo da sede ou unidade empresarial."
        />

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>CEP</label>
            <input
              type="text"
              placeholder="00000-000"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>País</label>
            <input type="text" placeholder="Brasil" className={classeInput} />
          </div>

          <div>
            <label className={classeLabel}>Estado</label>
            <input
              type="text"
              placeholder="Ex: Santa Catarina"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Cidade</label>
            <input
              type="text"
              placeholder="Nome da cidade"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Bairro</label>
            <input
              type="text"
              placeholder="Nome do bairro"
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Número</label>
            <input
              type="text"
              placeholder="Número do imóvel"
              className={classeInput}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={classeLabel}>Logradouro</label>
            <input
              type="text"
              placeholder="Rua, avenida, rodovia..."
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Complemento</label>
            <input
              type="text"
              placeholder="Sala, bloco, conjunto..."
              className={classeInput}
            />
          </div>

          <div>
            <label className={classeLabel}>Ponto de referência</label>
            <input
              type="text"
              placeholder="Referência próxima"
              className={classeInput}
            />
          </div>
        </div>
      </section>

      {/* ESTABELECIMENTO */}
      <section className={classeCard}>
        <Cabecalho
          icon={Store}
          titulo="Tipo de estabelecimento"
          descricao="Identifique a categoria desta unidade empresarial."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={classeLabel}>Tipo de unidade</label>
            <select
              className={classeInput}
              name="tipoEstabelecimento"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              <option value="matriz">Matriz</option>
              <option value="filial">Filial</option>
              <option value="administrativa">Unidade administrativa</option>
              <option value="deposito">Depósito</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
