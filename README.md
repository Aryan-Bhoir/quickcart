# 🛒 QuickCart

A full-stack, high-performance eCommerce web application built with **FastAPI**, **React (Vite)**, and **PostgreSQL**.

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication with bcrypt password hashing.
- 🛍️ **Product Catalog**: Browse and view products with pricing and stock details.
- 🛒 **Shopping Cart**: Real-time cart management (add, update quantities, remove items).
- 📦 **Order Management**: Checkout flow, order creation, and past order history.
- 👑 **Admin Dashboard**: Role-protected routes for managing inventory and viewing store orders.
- ⚡ **Lightning Fast Frontend**: Built with React 19 & Vite for instant HMR and snappy user experience.
- 📖 **Interactive API Documentation**: Auto-generated Swagger UI and ReDoc.

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** — Modern, high-performance Python web framework
- **SQLAlchemy 2.0** — SQL Toolkit and Object-Relational Mapper (ORM)
- **PostgreSQL** — Relational database with `psycopg3` driver
- **Pydantic v2** — Data validation and settings management
- **Python-JOSE & Passlib** — JWT tokens and password hashing

### Frontend
- **React 19** — User interface library
- **Vite** — Next-generation frontend tooling & build tool
- **React Router v7** — Client-side declarative routing with route protection
- **Axios** — HTTP client with automatic JWT token interceptors

---

## 📂 Project Structure

```text
ecommerce-project/
├── backend/
│   ├── app/
│   │   ├── core/            # Database and security configurations
│   │   ├── dependencies/    # Dependency injection (Auth, DB session)
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── routers/         # API route handlers (auth, cart, order, product)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic layer
│   │   └── main.py          # FastAPI application entrypoint
│   ├── .env.example         # Example environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── pages/           # Application views (Products, Cart, Orders, Admin, Auth)
│   │   ├── services/        # API client and interceptors
│   │   ├── App.jsx          # Route configuration
│   │   └── main.jsx         # App mounting
│   ├── package.json         # Frontend dependencies and scripts
│   └── vite.config.js       # Vite configuration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- **PostgreSQL** running locally or in the cloud

---

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL credentials and a secure secret key:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:yourpassword@localhost:5432/ecommerce_db
   SECRET_KEY=your-super-secret-key
   ```

5. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   The backend API will be available at `http://127.0.0.1:8001`.  
   Interactive API docs (Swagger): `http://127.0.0.1:8001/docs`.

---

### 2. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   The frontend app will be running at `http://localhost:5173`.

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login and receive JWT access token | Public |
| `GET` | `/products` | List all available products | Public |
| `POST` | `/products` | Add a new product | Admin |
| `GET` | `/cart` | Retrieve user shopping cart | Authenticated |
| `POST` | `/cart` | Add item to cart | Authenticated |
| `POST` | `/orders` | Place an order from cart | Authenticated |
| `GET` | `/orders` | View user order history | Authenticated |

---

## 📄 License

This project is licensed under the MIT License - feel free to use and modify it for your own projects.
