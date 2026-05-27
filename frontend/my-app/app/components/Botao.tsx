interface IBotao {
  nome: string;
  estilo: keyof typeof estilos;
  onClick: () => void;
  disabled?: boolean;
}

const estilos = {
  deletar: "bg-red-600 hover:bg-red-500 text-white font-semibold",
  confirmar: "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold",
  secundario: "bg-slate-700 hover:bg-slate-600 text-white font-semibold",
};

export default function Botao({ nome, estilo, onClick, disabled = false }: IBotao) {
  const estiloAtivo = estilos[estilo];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl shadow-sm px-4 py-2 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed ${estiloAtivo}`}
    >
      {nome}
    </button>
  );
}
