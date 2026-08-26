# 🍿 Movie Ticket Booking System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

A comprehensive **Fullstack Web Application** for online movie ticket booking, featuring a customer-facing portal with real-time seat selection and VNPay payment integration, alongside a multi-role admin dashboard for cinema management, revenue reporting, and QR code ticket scanning.

## 📖 Project Documentation

This project uses a monorepo structure, cleanly separating the client and server applications. For detailed technical information, please refer to the specific documentation for each layer:

- ➡️ **[Backend Documentation (Spring Boot)](./backend/README.md)**: Details on Dynamic PBAC, Pessimistic Locking, Database Schema, and VNPay Integration.
- ➡️ **[Frontend Documentation (React)](./frontend/README.md)**: Details on Component Structure, Route Guards, JWT Session Management, and UI Features.

## 📂 Monorepo Structure

```text
Movie_Ticket_Booking_System/
├── backend/          # Spring Boot Application (REST APIs, Security, Business Logic)
├── frontend/         # React Application (UI, State Management, API Integration)
├── .agents/          # Custom AI skills for local development
└── .gitignore
```

## 🚀 Quick Start

### Global Prerequisites
- **Java 21+**
- **Node.js 20+**
- **PostgreSQL 16+**

### 1. Database Setup
Create a PostgreSQL database named `movie_booking_db`.

### 2. Start the Backend
Navigate to the `backend` directory, configure your database credentials in `src/main/resources/application-local.properties`, and run:
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Start the Frontend
Navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```

---
*Built with ❤️ for educational and portfolio purposes.*
