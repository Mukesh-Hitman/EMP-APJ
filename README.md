# Employee Management System (EMP-APJ)

A modern full-stack Employee Management System built with **React 18 + Vite** on the frontend and **Node.js (Express) + Prisma ORM + SQLite** on the backend.

---

## 🎨 Modernized Features

- **Modern SaaS UI/UX**:
  - Clean card elevation, glassmorphism modal dialog (`backdrop-filter: blur(4px)`), and modern color palette.
  - User avatar initials circles computed dynamically from employee names.
  - Live metric cards with capacity percentages and custom icon bubbles.
  - Glowing status dot indicators for Active and Inactive members.
  - Interactive search toolbar with instant reset.
  - Toast notification banners confirming creation, update, and deletion events.
- **Prisma ORM Data Layer**:
  - Replaced all raw SQL queries with **Prisma ORM** (`@prisma/client`).
  - Schema-driven SQLite database persistence (`dev.db`).
  - Safe against SQL injection, with automatic field formatting and type safety.
- **Workflow & Safeguards**:
  - Case-insensitive status handling (`Active`, `active`, `ACTIVE`).
  - Duplicate email prevention (`409 Conflict`).
  - Dual-layer validation (instant inline form validation + Express middleware).
  - Delete confirmation safeguard.

---

## 🚀 Commands to Run Locally

You will need **two terminal windows**:

### 1. Start the Backend API Server (Port 5000)

Open Terminal 1:
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies (only needed the first time)
npm install

# 3. Generate Prisma client & ensure database is in sync
npx prisma db push

# 4. Start the Express API server
npm start
```
> The API server will listen at **`http://localhost:5000`**.

---

### 2. Start the Frontend Client (Port 5173)

Open Terminal 2:
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (only needed the first time)
npm install

# 3. Start the Vite development server
npm run dev
```
> Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Running Automated Tests

The application includes **50 comprehensive automated tests** across the entire stack:

### Run Backend Tests (Jest + Supertest + Prisma — 35 tests)
```bash
cd backend
npm test
```

### Run Frontend Tests (Vitest + React Testing Library — 15 tests)
```bash
cd frontend
npm test
```

---

## 📖 Project Documentation & Architecture
For the complete technical blueprint, database schema, data contracts, and revision logs, refer to:
- [`PROJECT_REFERENCE.md`](./PROJECT_REFERENCE.md)
