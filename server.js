const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const dispositivos = [
  {
    id: "EQP-001",
    nome: "Prensa Hidráulica A1",
    statusDispositivo: "online",
    conexaoAtiva: true,
    travaLiberada: false,
    ultimaAtualizacao: new Date().toISOString(),
    sensores: {
      temperatura: 32.4,
      pressao: 5.8,
      umidade: 48,
      sensorPresenca: true,
      releSeguranca: false,
    },
  },
  {
    id: "EQP-002",
    nome: "Esteira Inteligente B3",
    statusDispositivo: "alerta",
    conexaoAtiva: true,
    travaLiberada: false,
    ultimaAtualizacao: new Date().toISOString(),
    sensores: {
      temperatura: 41.1,
      pressao: 3.2,
      umidade: 52,
      sensorPresenca: false,
      releSeguranca: true,
    },
  },
];

const atualizarTimestamp = (dispositivo) => {
  dispositivo.ultimaAtualizacao = new Date().toISOString();
};

const buscarDispositivo = (id) =>
  dispositivos.find((item) => item.id === id);

app.get("/", (req, res) => {
  res.send(dispositivos);
});

app.get("/devices", (req, res) => {
  res.send(dispositivos);
});

app.get("/devices/:id", (req, res) => {
  const dispositivo = buscarDispositivo(req.params.id);

  if (!dispositivo) {
    return res.status(404).send({ erro: "Dispositivo não encontrado." });
  }

  res.send(dispositivo);
});

// Mantém compatibilidade com o fluxo já existente do Node-RED.
// Aceita payloads antigos ou payloads no formato novo.
app.post("/iot", (req, res) => {
  const body = req.body;

  if (body?.id && body?.sensores) {
    const existente = buscarDispositivo(body.id);

    if (existente) {
      Object.assign(existente, body, {
        sensores: {
          ...existente.sensores,
          ...body.sensores,
        },
      });
      atualizarTimestamp(existente);
      return res.send({ mensagem: "Dispositivo atualizado com sucesso.", dispositivo: existente });
    }

    const novoDispositivo = {
      ...body,
      nome: body.nome || `Dispositivo ${body.id}`,
      statusDispositivo: body.statusDispositivo || "online",
      conexaoAtiva: body.conexaoAtiva ?? true,
      travaLiberada: body.travaLiberada ?? false,
      sensores: {
        temperatura: 0,
        pressao: 0,
        umidade: 0,
        sensorPresenca: false,
        releSeguranca: false,
        ...body.sensores,
      },
      ultimaAtualizacao: new Date().toISOString(),
    };

    dispositivos.push(novoDispositivo);
    return res.status(201).send({ mensagem: "Dispositivo criado com sucesso.", dispositivo: novoDispositivo });
  }

  // Compatibilidade com o formato antigo: { Sensor, Codigo, Status }
  const codigo = body?.Codigo || `EQP-${String(dispositivos.length + 1).padStart(3, "0")}`;
  const nomeSensor = body?.Sensor || "Sensor genérico";
  const status = Boolean(body?.Status);

  const novoDispositivo = {
    id: codigo,
    nome: `Dispositivo ${codigo}`,
    statusDispositivo: status ? "online" : "offline",
    conexaoAtiva: status,
    travaLiberada: false,
    ultimaAtualizacao: new Date().toISOString(),
    sensores: {
      temperatura: nomeSensor.toLowerCase().includes("temper") ? 24.6 : 0,
      pressao: nomeSensor.toLowerCase().includes("press") ? 2.5 : 0,
      umidade: nomeSensor.toLowerCase().includes("umid") ? 55 : 0,
      sensorPresenca: status,
      releSeguranca: false,
    },
  };

  dispositivos.push(novoDispositivo);
  res.status(201).send({ mensagem: "Dados criados com sucesso!", dispositivo: novoDispositivo });
});

app.patch("/devices/:id/trava", (req, res) => {
  const dispositivo = buscarDispositivo(req.params.id);

  if (!dispositivo) {
    return res.status(404).send({ erro: "Dispositivo não encontrado." });
  }

  dispositivo.travaLiberada = !dispositivo.travaLiberada;
  atualizarTimestamp(dispositivo);

  res.send({ mensagem: "Estado da trava atualizado.", dispositivo });
});

app.patch("/devices/:id/conexao", (req, res) => {
  const dispositivo = buscarDispositivo(req.params.id);

  if (!dispositivo) {
    return res.status(404).send({ erro: "Dispositivo não encontrado." });
  }

  dispositivo.conexaoAtiva = !dispositivo.conexaoAtiva;
  dispositivo.statusDispositivo = dispositivo.conexaoAtiva ? "online" : "offline";
  atualizarTimestamp(dispositivo);

  res.send({ mensagem: "Estado da conexão atualizado.", dispositivo });
});

app.delete("/destroy", (req, res) => {
  dispositivos.splice(0, dispositivos.length);
  res.send("Dados excluídos com sucesso!");
});

app.delete("/destroy/:id", (req, res) => {
  const id = req.params.id;
  const index = dispositivos.findIndex((item) => item.id === id || String(dispositivos.indexOf(item)) === id);

  if (index === -1) {
    return res.status(404).send({ erro: "Item não encontrado." });
  }

  dispositivos.splice(index, 1);
  res.send(`Item ${id} deletado com sucesso!`);
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
