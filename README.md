# 📅 Agendamento - MVP  
**Micro‑SaaS de agendamento online** para profissionais liberais (barbeiros, manicures, esteticistas, personal trainers, etc).

> Problema que resolve: **organizar horários e receber reservas 24/7 sem depender de mensagens no WhatsApp**.  
O profissional cria **slots de atendimento** e compartilha um **link público personalizado (slug)** para que clientes agendem em poucos cliques.

---

## ✨ Visão Geral

O **Agendamento - MVP** permite que um profissional:

- Crie e gerencie horários disponíveis (slots)
- Compartilhe uma página pública de agendamento via link
- Acompanhe reservas em um dashboard

Enquanto o cliente:

- Acessa um link público
- Visualiza horários disponíveis
- Agenda com rapidez e praticidade

---

## 🚀 Funcionalidades

### 👨‍💼 Para o Profissional
- ✅ Cadastro e login com **senha criptografada (Bcrypt)**
- ✅ **Autenticação JWT**
- ✅ Criação e gerenciamento de **slots de horários**
- ✅ Dashboard para visualizar **reservas e agenda**
- ✅ Link público personalizado via **URL slug**  
  Ex.: `https://seu-dominio.com/profissional/joao-barber`

### 🧑‍💻 Para o Cliente
- ✅ Página pública de agendamento por link
- ✅ Visualização de horários disponíveis em tempo real
- ✅ Agendamento rápido e intuitivo
- ✅ Experiência mobile-friendly (UI moderna)

---

## 🧱 Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-333?style=for-the-badge&logo=node.js&logoColor=3C873A) | Runtime |
| ![TypeScript](https://img.shields.io/badge/TypeScript-333?style=for-the-badge&logo=typescript&logoColor=3178C6) | Tipagem / produtividade |
| ![Express](https://img.shields.io/badge/Express.js-333?style=for-the-badge&logo=express&logoColor=white) | API REST |
| ![Prisma](https://img.shields.io/badge/Prisma-333?style=for-the-badge&logo=prisma&logoColor=2D3748) | ORM |
| ![MySQL](https://img.shields.io/badge/MySQL-333?style=for-the-badge&logo=mysql&logoColor=4479A1) | Banco de dados |
| ![JWT](https://img.shields.io/badge/JWT-333?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | Autenticação |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-333?style=for-the-badge&logo=hackthebox&logoColor=white) | Hash de senha |

### Frontend
| Tecnologia | Uso |
|---|---|
| ![React](https://img.shields.io/badge/React-333?style=for-the-badge&logo=react&logoColor=61DAFB) | UI |
| ![Vite](https://img.shields.io/badge/Vite-333?style=for-the-badge&logo=vite&logoColor=646CFF) | Build / Dev Server |
| ![TypeScript](https://img.shields.io/badge/TypeScript-333?style=for-the-badge&logo=typescript&logoColor=3178C6) | Tipagem |
| ![Axios](https://img.shields.io/badge/Axios-333?style=for-the-badge&logo=axios&logoColor=5A29E4) | HTTP Client |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-333?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8) | Estilização |
| ![React Router](https://img.shields.io/badge/React_Router-333?style=for-the-badge&logo=reactrouter&logoColor=CA4245) | Rotas |

---

## 🧭 Como rodar o projeto localmente

> Recomendado: **Node.js LTS** e **MySQL** instalado/rodando.

### 1) Clone o repositório
```bash
git clone https://github.com/VINICIUS0098876/Agendamento-MVP.git
cd Agendamento-MVP
```

---

## ⚙️ Backend (API)

### 2) Acesse a pasta do backend
> Ajuste o nome da pasta conforme a estrutura do seu repo (ex.: `backend`, `server`, `api`).
```bash
cd backend
```

### 3) Instale as dependências
```bash
npm install
```

### 4) Configure variáveis de ambiente
Crie um arquivo `.env` na pasta do backend (exemplo):

```env
# Server
PORT=3333

# Database
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/agendamento_mvp"

# Auth
JWT_SECRET="sua_chave_super_secreta"
JWT_EXPIRES_IN="1d"
```

### 5) Rode as migrations e gere o Prisma Client
```bash
npx prisma migrate dev
npx prisma generate
```

### 6) Inicie o servidor
```bash
npm run dev
```

✅ API rodando em: `http://localhost:3333` (exemplo)

---

## 💻 Frontend (Web)

### 7) Acesse a pasta do frontend
> Ajuste o nome da pasta conforme a estrutura (ex.: `frontend`, `web`, `client`).
```bash
cd ../frontend
```

### 8) Instale as dependências
```bash
npm install
```

### 9) Configure variáveis de ambiente do Frontend
Crie um `.env` no frontend (exemplo):

```env
VITE_API_URL="http://localhost:3333"
```

### 10) Inicie o frontend
```bash
npm run dev
```

✅ Frontend rodando em: `http://localhost:5173` (padrão do Vite)

---

## 🗂️ Estrutura de pastas (simplificada)

> Pode variar conforme sua organização. Exemplo comum para esse tipo de projeto:

```text
Agendamento-MVP/
├─ backend/
│  ├─ prisma/
│  ├─ src/
│  │  ├─ modules/
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ services/
│  │  └─ server.ts
│  ├─ package.json
│  └─ tsconfig.json
│
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ services/   (axios)
│  │  ├─ routes/
│  │  └─ main.tsx
│  ├─ index.html
│  ├─ vite.config.ts
│  └─ package.json
│
└─ README.md
```

---

## 🔐 Segurança (resumo)
- 🔒 Senhas armazenadas com **hash (Bcrypt)**
- 🪪 Sessões stateless via **JWT**
- 🧩 Separação entre **área autenticada (profissional)** e **página pública (cliente)**

---

## 🧪 Próximos passos (ideias)
- 📆 Integração com Google Calendar
- 🔔 Notificações por e-mail/WhatsApp
- 💳 Pagamento para confirmação do agendamento (Stripe/Mercado Pago)
- 👥 Multi-usuário por estabelecimento

---

## 🤝 Contribuição
Sugestões e PRs são bem-vindos!

1. Faça um fork
2. Crie sua branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m "feat: minha feature"`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença
Defina aqui a licença do projeto (ex.: MIT).  
Se ainda não houver, você pode adicionar um arquivo `LICENSE`.

---

### 📌 Autor
**VINICIUS0098876**  
Repositório: https://github.com/VINICIUS0098876/Agendamento-MVP
