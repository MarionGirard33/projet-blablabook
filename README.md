# 📚 BlablaBook

**BlablaBook** is an open-source personal book management platform for tracking your reading journey.  
It allows you to mark books as read, currently reading, or to-read, in a **containerized and easily deployable** environment (Docker).

---

## 📚 Table of Contents

1. [🎯 Project Objective](#-project-objective)
2. [⚙️ Technologies Used](#️-technologies-used)
3. [🧱 Local Installation and Execution](#-local-installation-and-execution)
4. [🔧 Useful Commands](#-useful-commands)
5. [🧭 Project Structure](#-project-structure)

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

This will start:

- **Backend (NestJS)** on `http://localhost:3000`
- **Frontend (React + Vite)** on `http://localhost:5173`
- **PostgreSQL** on `localhost:5432`
- **Adminer** on `http://localhost:8080`

### 5️⃣ Run the database seed (required for initial data)

Open a new terminal and execute:

```bash
docker exec -it backend sh
# Inside the container:
npx ts-node src/seed.ts
exit
```

### 6️⃣ Access the services

| Service               | URL                                                    |
| --------------------- | ------------------------------------------------------ |
| Frontend              | [http://localhost:5173](http://localhost:5173)         |
| Backend API           | [http://localhost:3000](http://localhost:3000)         |
| Swagger Documentation | [http://localhost:3000/api](http://localhost:3000/api) |
| Adminer               | [http://localhost:8080](http://localhost:8080)         |

### 7️⃣ Verify functionality

**➤ Check the API**  
Open in browser: [http://localhost:3000/api](http://localhost:3000/api)  
Explore the interactive Swagger documentation.

**➤ Check the frontend**  
Go to: [http://localhost:5173](http://localhost:5173)  
The React interface should display correctly.

**➤ Check Adminer**  
Go to: [http://localhost:8080](http://localhost:8080)  
Login with:

- **Host:** `postgres`
- **Username:** `postgres`
- **Password:** `postgres`
- **Database:** `blablabook`

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
│   │   ├── users/       # Users management
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
