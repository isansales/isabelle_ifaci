# IFACI - Sistema Supervisório Industrial


A["🌐 Frontend <br> Next.js + React"] -->|"API REST"| B["⚙️ Backend <br> Node.js + Express"]

B --> C["🏭 Dispositivos Industriais"]

C --> D["🌡️ Temperatura"]
C --> E["💨 Pressão"]
C --> F["💧 Umidade"]
C --> G["📡 Sensor de Presença"]
C --> H["🔒 Relé de Segurança"]
```

---

# 📖 Sobre o Projeto

```mermaid
mindmap
  root((IFACI))
    IoT
    Automação Industrial
    Monitoramento em Tempo Real
    API REST
    Dashboard Supervisório
    Indústria 4.0
```

---

# 🧠 Funcionalidades

```mermaid
flowchart TD

A["📦 Sistema"] --> B["✅ Cadastro de Dispositivos"]
A --> C["📊 Monitoramento em Tempo Real"]
A --> D["🌐 Controle de Conexão"]
A --> E["🔒 Relé de Segurança"]
A --> F["📡 Sensores Industriais"]
```

---

# 🛠️ Tecnologias Utilizadas

```mermaid
graph TD

A["💻 Tecnologias"]

A --> B["⚛️ React"]
A --> C["▲ Next.js"]
A --> D["🟦 TypeScript"]
A --> E["🎨 Tailwind CSS"]

A --> F["🟢 Node.js"]
A --> G["🚂 Express"]

A --> H["🐙 Git"]
A --> I["📮 Postman"]
A --> J["🧩 VS Code"]
```

---

# 📂 Estrutura do Projeto

```mermaid
graph TD

A["📁 IFACI"]

A --> B["📁 frontend"]
A --> C["📁 api"]

B --> D["📁 app"]
B --> E["📁 components"]
B --> F["📁 public"]

C --> G["📄 server.js"]
C --> H["📄 package.json"]
```

---

# ▶️ Como Executar

## ⚙️ Backend

```bash
cd api
npm install
npm start
```

API:
```bash
http://localhost:8081
```

---

## 🎨 Frontend

```bash
cd frontend/my-app
npm install
npm run dev
```

Aplicação:
```bash
http://localhost:3000
```

---

# 🔗 Endpoints

```mermaid
graph LR

A["GET /devices"] --> B["Buscar dispositivos"]

C["POST /devices"] --> D["Criar dispositivo"]

E["PUT /devices/:id"] --> F["Atualizar dispositivo"]

G["PATCH /devices/:id/conexao"] --> H["Alterar conexão"]

I["DELETE /devices/:id"] --> J["Remover dispositivo"]
```

---

# 📦 Exemplo JSON

```json
{
  "id": "EQP-001",
  "nome": "Sensor Industrial",
  "statusDispositivo": "online",
  "conexaoAtiva": true,
  "travaLiberada": false,
  "sensores": {
    "temperatura": 25,
    "pressao": 2.4,
    "umidade": 50,
    "sensorPresenca": true
  }
}
```

---

# 🎯 Objetivo

```mermaid
journey
    title Objetivos do Projeto
    section Desenvolvimento
      API REST: 5: Isabelle
      Frontend Responsivo: 5: Isabelle
      Integração IoT: 4: Isabelle
      Monitoramento Industrial: 5: Isabelle
```

---

# 👩‍💻 Autor

```mermaid
graph TD

A["👩‍💻 Isabelle Nastri Sales"]
A --> B["🏫 SENAI"]
A --> C["📚 Interfaces Industriais"]
A --> D["⚙️ Projeto Acadêmico"]
```

---

# 📄 Licença

```mermaid
flowchart LR

A["📚 Projeto Educacional"] --> B["Uso Acadêmico"]
```
