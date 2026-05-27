const express = require("express");
const cors = require("cors");

const api = express();
const PORT = 8081;

api.use(cors());
api.use(express.json());

let devices = [
  {
    id: "EQP-001",
    nome: "Sensor Temperatura",
    statusDispositivo: "online",
    conexaoAtiva: true,
    travaLiberada: false,
    ultimaAtualizacao: new Date().toISOString(),
    sensores: {
      temperatura: 25,
      pressao: 2.4,
      umidade: 50,
      sensorPresenca: true,
      releSeguranca: false
    }
  }
];

api.get("/", (req, res) => {
  res.json({
    msg: "API IFACI rodando",
    devices: "/devices"
  });
});

api.get("/devices", (req, res) => {
  return res.json(devices);
});

api.get("/devices/:id", (req, res) => {
  const device = devices.find((d) => d.id === req.params.id);

  if (!device) {
    return res.status(404).json({
      msg: "Dispositivo não encontrado"
    });
  }

  return res.json(device);
});

api.post("/devices", (req, res) => {
  const novo = req.body;

  if (!novo || !novo.id || !novo.nome) {
    return res.status(400).json({
      msg: "Informe pelo menos id e nome do dispositivo"
    });
  }

  const existe = devices.find((d) => d.id === novo.id);

  if (existe) {
    return res.status(409).json({
      msg: "Já existe um dispositivo com esse ID"
    });
  }

  const novoDevice = {
    id: String(novo.id),
    nome: novo.nome,
    statusDispositivo: novo.statusDispositivo || "offline",
    conexaoAtiva: novo.conexaoAtiva ?? false,
    travaLiberada: novo.travaLiberada ?? false,
    ultimaAtualizacao: new Date().toISOString(),
    sensores: novo.sensores || {}
  };

  devices.push(novoDevice);

  return res.status(201).json({
    msg: "Dispositivo criado com sucesso",
    device: novoDevice
  });
});

api.put("/devices/:id", (req, res) => {
  const index = devices.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      msg: "Dispositivo não encontrado"
    });
  }

  devices[index] = {
    ...devices[index],
    ...req.body,
    id: req.params.id,
    ultimaAtualizacao: new Date().toISOString()
  };

  return res.json({
    msg: "Dispositivo atualizado",
    device: devices[index]
  });
});

api.patch("/devices/:id/trava", (req, res) => {
  const device = devices.find((d) => d.id === req.params.id);

  if (!device) {
    return res.status(404).json({
      msg: "Dispositivo não encontrado"
    });
  }

  device.travaLiberada = !device.travaLiberada;
  device.ultimaAtualizacao = new Date().toISOString();

  return res.json({
    msg: "Trava alterada",
    device
  });
});

api.patch("/devices/:id/conexao", (req, res) => {
  const device = devices.find((d) => d.id === req.params.id);

  if (!device) {
    return res.status(404).json({
      msg: "Dispositivo não encontrado"
    });
  }

  device.conexaoAtiva = !device.conexaoAtiva;
  device.statusDispositivo = device.conexaoAtiva ? "online" : "offline";
  device.ultimaAtualizacao = new Date().toISOString();

  return res.json({
    msg: "Conexão alterada",
    device
  });
});

api.delete("/devices/:id", (req, res) => {
  const index = devices.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      msg: "Dispositivo não encontrado"
    });
  }

  const removido = devices.splice(index, 1)[0];

  return res.json({
    msg: "Dispositivo removido",
    device: removido
  });
});

api.delete("/destroy", (req, res) => {
  devices = [];

  return res.json({
    msg: "Todos os dispositivos apagados"
  });
});

const server = api.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando na porta ${PORT}`);
});

server.on("error", (err) => {
  console.error("Erro ao iniciar servidor:", err);
});