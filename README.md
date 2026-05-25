# 📚 BlablaBook

**BlablaBook** is an open-source personal book management platform for tracking your reading journey.  
It allows you to mark books as read, currently reading, or to-read, in a **containerized and easily deployable** environment (Docker).

---

## 📚 Table of Contents

- [📚 BlablaBook](#-blablabook)
  - [📚 Table of Contents](#-table-of-contents)
  - [🎯 Project Objective](#-project-objective)
  - [⚙️ Technologies Used](#️-technologies-used)
  - [🧱 Local Installation and Execution](#-local-installation-and-execution)
    - [1️⃣ Prerequisites](#1️⃣-prerequisites)
    - [2️⃣ Clone the repository](#2️⃣-clone-the-repository)
    - [3️⃣ Create a .env file](#3️⃣-create-a-env-file)
    - [4️⃣ Start the project](#4️⃣-start-the-project)
    - [5️⃣ Access the services](#5️⃣-access-the-services)
    - [6️⃣ Verify functionality](#6️⃣-verify-functionality)
  - [🔧 Useful Commands](#-useful-commands)
  - [🧭 Project Structure](#-project-structure)
  - [🧪 Test Plan](#-test-plan)
    - [🔹 Category Module Validation](#-category-module-validation)
    - [⚡ Load Testing (Artillery)](#-load-testing-artillery)

---

## 🎯 Project Objective

The goal of **BlablaBook** is to provide a simple and intuitive personal library management solution, allowing users to:

- **add books** to their personal library via the OpenLibrary API;
- **track reading status**: "Read", "Currently Reading", "To Read";
- **search books** by title in their collection;

---

## ⚙️ Technologies Used

| Technology                  | Role                                   |
| --------------------------- | -------------------------------------- |
| **Docker & Docker Compose** | Containerization and orchestration     |
| **React + TypeScript**      | Modern, typed frontend framework       |
| **Vite**                    | Ultra-fast build tool                  |
| **Zustand**                 | Lightweight state management           |
| **Tanstack Query**          | Data fetching and caching              |
| **Tanstack Router**         | Type-safe routing                      |
| **Zod**                     | Schema validation                      |
| **Axios**                   | HTTP client                            |
| **Tailwind CSS**            | Utility-first CSS framework            |
| **Shadcn/ui**               | Pre-built UI components                |
| **NestJS**                  | Structured Node.js backend framework   |
| **PostgreSQL**              | Relational database                    |
| **Drizzle ORM**             | Modern, typed ORM                      |
| **Swagger**                 | Automatic API documentation            |
| **Adminer**                 | SQL administration interface           |
| **OpenLibrary API**         | Book data source                       |
| **Vitest**                  | Frontend testing                       |
| **Jest**                    | Backend testing                        |
| **Lighthouse**              | Performance and accessibility auditing |
| **Artillery**               | Load testing                           |
| **GitHub Actions**          | CI/CD                                  |

---

## 🧱 Local Installation and Execution

### 1️⃣ Prerequisites

- Docker installed on your system

### 2️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd projet-blablabook
```

### 3️⃣ Create a .env file

Create a `.env` file at the project root based on `.env.example`.

### 4️⃣ Start the project

```bash
docker-compose up
```

### 🌱 Seed the database (books)

This populates the `book` table and links them to the test user's list.

```bash
cd backend
docker compose exec backend npx ts-node src/seed.ts
```

### 5️⃣ Access the services

| Service               | URL                                                    |
| --------------------- | ------------------------------------------------------ |
| Frontend              | [http://localhost:5173](http://localhost:5173)         |
| Backend API           | [http://localhost:3000](http://localhost:3000)         |
| Swagger Documentation | [http://localhost:3000/api](http://localhost:3000/api) |
| Adminer               | [http://localhost:8080](http://localhost:8080)         |

### 6️⃣ Verify functionality

**➤ Check the API**  
Open in browser: [http://localhost:3000/api](http://localhost:3000/api)  
Explore the interactive Swagger documentation.

**➤ Check the frontend**  
Go to: [http://localhost:5173](http://localhost:5173)  
The React interface should display correctly.

**➤ Check Adminer**  
Go to: [http://localhost:8080](http://localhost:8080)

---

## 🔧 Useful Commands

| Command                            | Description                      |
| ---------------------------------- | -------------------------------- |
| `docker-compose up`                | Start the project                |
| `docker-compose up -d`             | Start in detached mode           |
| `docker-compose down`              | Stop containers                  |
| `docker-compose down -v`           | Remove containers and volumes    |
| `docker-compose logs -f`           | Display continuous logs          |
| `docker exec -it backend sh`       | Open shell in backend container  |
| `docker exec -it frontend sh`      | Open shell in frontend container |
| `docker ps`                        | List active containers           |
| `docker-compose restart <service>` | Restart a specific service       |

---

## 🧭 Project Structure

```
.
├── backend/              # NestJS API source code
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── books/       # Books management
│   │   ├── user/        # Users management
│   │   ├── db/          # Database config and Drizzle schema
│   │   └── main.ts      # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Application pages
│   │   ├── api/         # API calls
│   │   ├── stores/      # Zustand stores
│   │   └── routes/      # Tanstack Router configuration
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker Compose configuration
├── docker-compose.prod.yml # Production configuration
└── README.md
```

---

## 🧪 Test Plan

The project follows a testing strategy to ensure data integrity and API reliability.

### 🔹 Category Module Validation

| Test Case                            | Expected Result                               | Status |
| :----------------------------------- | :-------------------------------------------- | :----- |
| **Get All Categories**               | 200: Returns the list of active categories    | 🟢     |
| **Get Category by valid ID**         | 200: Returns the specific category object     | 🟢     |
| **Get Category by non-existent ID**  | 404: Error "Category with ID X not found"     | 🔴     |
| **Invalid ID format** (e.g., `/abc`) | 400: Validation error (ParseIntPipe)          | 🔴     |
| **Find or Create (Exists)**          | Returns existing category without duplication | 🟢     |
| **Find or Create (New)**             | Persists new category in DB and returns it    | 🟢     |

> **Note:** Backend tests are performed using **Jest** with a fully mocked Drizzle ORM to isolate business logic from the database layer.

### ⚡ Load Testing (Artillery)

All Artillery tests are centralized in `backend/load-tests/artillery-test.yml`.
The file defines multiple phases:

- **Smoke** — quick sanity check (60s @ 10 req/s). Recommended for CI/dev (fast and deterministic).
- **Soak** — sustained load (5 min @ 20 req/s) to detect memory leaks or resource regressions.
- **Stress** — ramp-up (`rampTo`) to identify breaking points and limits.

Prerequisites

```bash
npm install -g artillery
```

- Run all phases (smoke + soak + stress) — use in local development when you need a full verification:

```bash
cd backend
npx artillery run ./load-tests/artillery-test.yml --output load-tests/reports/full-report.json
npx artillery report load-tests/reports/full-report.json --output load-tests/reports/full-report.html
```

Report location

- Generated JSON/HTML reports are saved under `backend/load-tests/reports/`.

CI

- The CI pipeline (`.github/workflows/cicd-dev.yml`) runs only the _smoke_ phase (via `--overrides`) to keep pipelines fast. Generated reports are uploaded as workflow artifacts (Actions → run → Artifacts).

---

## **Deployment**

This section describes the steps to create the required accounts (Supabase, Surge, Render), apply migrations, seed the production database, and deploy the services.

- **Prerequisites**: a Supabase account, a Render account for the backend, a Surge account (or another static host such as Render/Netlify), and access to the Git repository.

### **1. Supabase (database)**

- **Create a project**: go to app.supabase.com → New project. Note the Postgres `Connection string` (Settings → Database → Connection string).
- **Get the connection URL**: use the full `Connection string (URI)` value (format `postgresql://...`). Store it in `SUPABASE_URL`.

To apply migrations from your machine:

```bash
cd backend
npx drizzle-kit push --schema ./src/db/schema.ts --url "$SUPABASE_URL" --dialect postgresql
```

### **2. Seed the database (production)**

- The backend includes a production-specific seed script: [backend/src/seed-prod.ts](backend/src/seed-prod.ts#L1-L120). It forces `NODE_ENV=prod` and uses `SUPABASE_URL` as the source.
- Run the seed (from `backend`):

```bash
# make sure SUPABASE_URL points to Supabase
npm run seed:prod
```

### **3. Backend — Render**

- **Create a Web Service**: Render dashboard → New → Web Service → connect your repository.
- **Build & Start**:
  - Build command: `npm install && npm run build`
  - Start command: `npm run start:prod`
- **Environment variables**: add `DATABASE_URL` (value: Supabase URI) and `NODE_ENV=prod`. Render provides `PORT` automatically.

### **4. Frontend — Surge (static site)**

- **Create an account**: https://surge.sh and install the CLI (`npm i -g surge` or `npx surge`).
- **Build + deployment** Deploy the frontend on Render (Static Site) and set `VITE_BACKEND_URL` in the service environment variables.
