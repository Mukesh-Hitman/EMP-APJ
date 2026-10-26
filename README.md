# Employee Management System (EMP-APJ)

A simple, functional full-stack Employee Management System built with **React (Vite)** on the frontend and **Node.js (Express) + SQLite (`sql.js`)** on the backend. Designed with a clear, workflow-focused architecture and robust automated test suites.

---

## 🚀 Commands to Run Locally

You need two terminal windows: one for the **Backend** and one for the **Frontend**.

### 1. Start the Backend API (Port 5000)

Open Terminal 1:
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (only needed the first time)
npm install

# Start the server
npm start
```
> The API will start and listen at **`http://localhost:5000`**.

---

### 2. Start the Frontend Application (Port 5173)

Open Terminal 2:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (only needed the first time)
npm install

# Start the Vite development server
npm run dev
```
> Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Running Automated Tests

Both the backend and frontend have comprehensive test suites (49 total tests).

### Run Backend Tests (Jest + Supertest - 34 tests)
```bash
cd backend
npm test
```

### Run Frontend Tests (Vitest + Testing Library - 15 tests)
```bash
cd frontend
npm test
```

---

## 📋 Features

### 1. Employee Management
- **Add Employee**: Create records with `Name`, `Email`, `Department`, `Designation`, and `Status` (`Active` / `Inactive`).
- **View Employees**: View an interactive list of all records in a responsive table.
- **Edit Employee**: Modify details of existing employees.
- **Delete Employee**: Remove employees with a confirmation prompt.
- **Search & Filter**:
  - Real-time search by employee name (debounced).
  - Filter by department (*Engineering, Marketing, Sales, HR, Finance, Operations*).
  - Filter by status (*Active, Inactive*).
- **Validation & Duplicate Protection**:
  - Rejects duplicate email addresses with `409 Conflict`.
  - Validates required fields, email format, and field length constraints on both client and server.

### 2. Real-Time Dashboard
- Displays **Total Employees**, **Active Employees**, and **Inactive Employees** count cards.
- Counts are calculated directly from actual database records and automatically stay in sync across all additions, edits, and deletions.

---

## 🛠️ Tech Stack & Decisions

- **Backend**: **Node.js + Express.js**
  - Lightweight, modular REST architecture.
- **Database**: **SQLite via `sql.js`**
  - Pure JavaScript/WebAssembly SQLite engine that requires no native C++ compilation tools on Windows.
  - Automatically persists changes to `employees.db` on disk.
  - Fast in-memory database (`:memory:`) during test execution.
- **Frontend**: **React 18 + Vite**
  - Fast HMR development, clean component hierarchy, and zero UI library bloat.
- **Automated Testing**:
  - Backend: **Jest** & **Supertest** for full endpoint integration testing.
  - Frontend: **Vitest** & **React Testing Library** for component rendering and user interaction testing.

---

## 📖 Project Documentation & Architecture
For a deep dive into the internal structure, schemas, and workflow details, refer to:
- [`PROJECT_REFERENCE.md`](./PROJECT_REFERENCE.md)

