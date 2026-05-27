interface ICard {
  title?: string;
  size?: keyof typeof tamanhos;
  style?: keyof typeof estilos;
  children?: React.ReactNode;
}

const tamanhos = {
  sm: "w-full",
  md: "w-full",
} as const;

const estilos = {
  white: "bg-white text-slate-900 border border-slate-200",
  auto: "bg-transparent",
  gray: "bg-slate-100 text-slate-900 border border-slate-200",
} as const;

export default function Card({
  title,
  size = "md",
  style = "white",
  children,
}: ICard) {
  const tamanhoAtivo = tamanhos[size];
  const estiloAtivo = estilos[style];

  return (
    <div className={`rounded-2xl shadow-sm p-5 ${tamanhoAtivo} ${estiloAtivo}`}>
      {title ? <h2 className="text-lg font-bold mb-4">{title}</h2> : null}
      {children}
    </div>
  );
}
