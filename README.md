# 📅 Scheduling - MVP - UNDER MAINTENANCE!
**Online scheduling Micro‑SaaS** for independent professionals (barbers, nail artists, estheticians, personal trainers, etc.).

> Problem it solves: **organize appointments and receive bookings 24/7 without relying on WhatsApp messages**.  
The professional creates **availability slots** and shares a **personalized public link (slug)** so clients can book in just a few clicks.

---

## ✨ Overview

**Scheduling - MVP** enables a professional to:

- Create and manage available time slots (slots)
- Share a public scheduling page via link
- Track bookings in a dashboard

While the client:

- Accesses a public link
- Views available times
- Books quickly and conveniently

---

## 🚀 Features

### 👨‍💼 For the Professional
- ✅ Sign up and log in with **encrypted password (Bcrypt)**
- ✅ **JWT Authentication**
- ✅ Create and manage **time slots**
- ✅ Dashboard to view **bookings and schedule**
- ✅ Personalized public link via **URL slug**  
  Example: `https://your-domain.com/professional/joao-barber`

### 🧑‍💻 For the Client
- ✅ Public booking page via link
- ✅ Real-time view of available times
- ✅ Fast and intuitive booking
- ✅ Mobile-friendly experience (modern UI)

---

## 🧱 Tech Stack

### Backend
| Technology | Use |
|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-333?style=for-the-badge&logo=node.js&logoColor=3C873A) | Runtime |
| ![TypeScript](https://img.shields.io/badge/TypeScript-333?style=for-the-badge&logo=typescript&logoColor=3178C6) | Typing / productivity |
| ![Express](https://img.shields.io/badge/Express.js-333?style=for-the-badge&logo=express&logoColor=white) | REST API |
| ![Prisma](https://img.shields.io/badge/Prisma-333?style=for-the-badge&logo=prisma&logoColor=2D3748) | ORM |
| ![MySQL](https://img.shields.io/badge/MySQL-333?style=for-the-badge&logo=mysql&logoColor=4479A1) | Database |
| ![JWT](https://img.shields.io/badge/JWT-333?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | Authentication |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-333?style=for-the-badge&logo=hackthebox&logoColor=white) | Password hashing |

### Frontend
| Technology | Use |
|---|---|
| ![React](https://img.shields.io/badge/React-333?style=for-the-badge&logo=react&logoColor=61DAFB) | UI |
| ![Vite](https://img.shields.io/badge/Vite-333?style=for-the-badge&logo=vite&logoColor=646CFF) | Build / Dev Server |
| ![TypeScript](https://img.shields.io/badge/TypeScript-333?style=for-the-badge&logo=typescript&logoColor=3178C6) | Typing |
| ![Axios](https://img.shields.io/badge/Axios-333?style=for-the-badge&logo=axios&logoColor=5A29E4) | HTTP Client |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-333?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-333?style=for-the-badge&logo=reactrouter&logoColor=CA4245) | Routing |

---

## 🧭 How to run the project locally

> Recommended: **Node.js LTS** and **MySQL** installed/running.

### 1) Clone the repository
```bash
git clone https://github.com/VINICIUS0098876/Agendamento-MVP.git
cd Agendamento-MVP
```

---

## ⚙️ Backend (API)

### 2) Go to the backend folder
> Adjust the folder name according to your repo structure (e.g., `backend`, `server`, `api`).
```bash
cd backend
```

### 3) Install dependencies
```bash
npm install
```

### 4) Configure environment variables
Create a `.env` file in the backend folder (example):

```env
# Server
PORT=3333

# Database
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/agendamento_mvp"

# Auth
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="1d"
```

### 5) Run migrations and generate Prisma Client
```bash
npx prisma migrate dev
npx prisma generate
```

### 6) Start the server
```bash
npm run dev
```

✅ API running at: `http://localhost:3333` (example)

---

## 💻 Frontend (Web)

### 7) Go to the frontend folder
> Adjust the folder name according to your structure (e.g., `frontend`, `web`, `client`).
```bash
cd ../frontend
```

### 8) Install dependencies
```bash
npm install
```

### 9) Configure frontend environment variables
Create a `.env` file in the frontend (example):

```env
VITE_API_URL="http://localhost:3333"
```

### 10) Start the frontend
```bash
npm run dev
```

✅ Frontend running at: `http://localhost:5173` (Vite default)

---

## 🗂️ Folder structure (simplified)

> May vary depending on your organization. Common example for this type of project:

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

## 🔐 Security (summary)
- 🔒 Passwords stored with **hashing (Bcrypt)**
- 🪪 Stateless sessions via **JWT**
- 🧩 Separation between **authenticated area (professional)** and **public page (client)**

---

## 🧪 Next steps (ideas)
- 📆 Google Calendar integration
- 🔔 Notifications via email/WhatsApp
- 💳 Payment to confirm booking (Stripe/Mercado Pago)
- 👥 Multi-user per business/location

---

## 🤝 Contributing
Suggestions and PRs are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License
Define the project license here (e.g., MIT).  
If you don't have one yet, you can add a `LICENSE` file.

---

### 📌 Author
**VINICIUS0098876**  
Repository: https://github.com/VINICIUS0098876/Agendamento-MVP
