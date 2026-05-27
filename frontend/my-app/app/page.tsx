"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DeviceStatus = "online" | "offline" | "alerta";

interface Dispositivo {
  id: string;
  nome: string;
  statusDispositivo: DeviceStatus;
  conexaoAtiva: boolean;
  travaLiberada: boolean;
  ultimaAtualizacao?: string;
  sensores: {
    temperatura: number;
    pressao: number;
    umidade: number;
    sensorPresenca: boolean;
    releSeguranca: boolean;
  };
}

const API_URL = "http://localhost:8081";

const formatarDispositivo = (item: any, index: number): Dispositivo => ({
  id: item.id || `EQP-${String(index + 1).padStart(3, "0")}`,
  nome: item.nome || `Equipamento ${index + 1}`,
  statusDispositivo:
    item.statusDispositivo || (item.conexaoAtiva ? "online" : "offline"),
  conexaoAtiva: Boolean(item.conexaoAtiva),
  travaLiberada: Boolean(item.travaLiberada),
  ultimaAtualizacao: item.ultimaAtualizacao || new Date().toISOString(),
  sensores: {
    temperatura: Number(item.sensores?.temperatura ?? 0),
    pressao: Number(item.sensores?.pressao ?? 0),
    umidade: Number(item.sensores?.umidade ?? 0),
    sensorPresenca: Boolean(item.sensores?.sensorPresenca),
    releSeguranca: Boolean(item.sensores?.releSeguranca),
  },
});

export default function Home() {
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [acao, setAcao] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/devices`);
      const json = await res.json();
      setDevices(Array.isArray(json) ? json.map(formatarDispositivo) : []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resumo = useMemo(() => {
    return {
      total: devices.length,
      online: devices.filter((d) => d.conexaoAtiva).length,
      reles: devices.filter((d) => d.travaLiberada).length,
    };
  }, [devices]);

  const alternarConexao = async (device: Dispositivo) => {
    setAcao(`conexao-${device.id}`);
    await fetch(`${API_URL}/devices/${device.id}/conexao`, { method: "PATCH" });

    setDevices((lista) =>
      lista.map((item) => {
        if (item.id !== device.id) return item;
        const novaConexao = !item.conexaoAtiva;

        return {
          ...item,
          conexaoAtiva: novaConexao,
          statusDispositivo: novaConexao ? "online" : "offline",
          ultimaAtualizacao: new Date().toISOString(),
        };
      })
    );

    setAcao(null);
  };

  const alternarRele = async (id: string) => {
    setAcao(`rele-${id}`);
    await fetch(`${API_URL}/devices/${id}/trava`, { method: "PATCH" });

    setDevices((lista) =>
      lista.map((item) =>
        item.id === id
          ? {
              ...item,
              travaLiberada: !item.travaLiberada,
              ultimaAtualizacao: new Date().toISOString(),
            }
          : item
      )
    );

    setAcao(null);
  };

  const excluir = async (id: string) => {
    if (!confirm(`Excluir dispositivo ${id}?`)) return;

    setAcao(`delete-${id}`);
    await fetch(`${API_URL}/devices/${id}`, { method: "DELETE" });
    setDevices((lista) => lista.filter((item) => item.id !== id));
    setAcao(null);
  };

  const limparTudo = async () => {
    if (!confirm("Deseja apagar todos os dispositivos?")) return;

    setAcao("limpar");
    await fetch(`${API_URL}/destroy`, { method: "DELETE" });
    setDevices([]);
    setAcao(null);
  };

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <section className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">
            IFACI • Interfaces Industriais
          </p>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950">
                Painel de Equipamentos
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Visualização dos dispositivos cadastrados, sensores, conexões e
                relés de segurança.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={carregar}
                disabled={loading}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                Atualizar
              </button>

              <button
                onClick={limparTudo}
                disabled={acao === "limpar"}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Limpar
              </button>
            </div>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total de dispositivos</p>
            <p className="mt-2 text-4xl font-black">{resumo.total}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Conexões ativas</p>
            <p className="mt-2 text-4xl font-black">{resumo.online}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Relés ligados</p>
            <p className="mt-2 text-4xl font-black">{resumo.reles}</p>
          </div>
        </div>

        {loading && devices.length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Carregando dispositivos...
          </div>
        )}

        {!loading && devices.length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Nenhum dispositivo encontrado.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {devices.map((device) => (
            <article
              key={device.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                <div>
                  <h2 className="text-2xl font-black">{device.nome}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    ID do dispositivo:{" "}
                    <span className="font-bold text-slate-800">{device.id}</span>
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
                    device.conexaoAtiva
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {device.conexaoAtiva ? "Online" : "Offline"}
                </span>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">Temperatura</p>
                  <p className="mt-2 text-3xl font-black">
                    {device.sensores.temperatura.toFixed(1)} °C
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">Pressão</p>
                  <p className="mt-2 text-3xl font-black">
                    {device.sensores.pressao.toFixed(1)} bar
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">Umidade</p>
                  <p className="mt-2 text-3xl font-black">
                    {device.sensores.umidade.toFixed(0)} %
                  </p>
                </div>
              </div>

              <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Sensor de presença</p>
                  <p className="mt-2 text-xl font-black">
                    {device.sensores.sensorPresenca ? "Ativo" : "Inativo"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Relé de segurança</p>
                  <p className="mt-2 text-xl font-black">
                    {device.travaLiberada ? "Ligado" : "Desligado"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate-500">
                  Atualizado em:{" "}
                  <span className="font-semibold text-slate-700">
                    {device.ultimaAtualizacao
                      ? new Date(device.ultimaAtualizacao).toLocaleString("pt-BR")
                      : "Sem registro"}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => alternarConexao(device)}
                    disabled={acao === `conexao-${device.id}`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
                  >
                    {device.conexaoAtiva ? "Desconectar" : "Conectar"}
                  </button>

                  <button
                    onClick={() => alternarRele(device.id)}
                    disabled={acao === `rele-${device.id}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    {device.travaLiberada ? "Desligar relé" : "Ligar relé"}
                  </button>

                  <button
                    onClick={() => excluir(device.id)}
                    disabled={acao === `delete-${device.id}`}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}