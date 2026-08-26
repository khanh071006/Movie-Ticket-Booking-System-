# 💻 Frontend - React Application

This directory contains the user interface for the Movie Ticket Booking System. It provides two distinct experiences: a public portal for customers to browse movies and book tickets, and a comprehensive administrative dashboard for managing cinema operations.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript 6.0, Vite 8.0
- **Styling**: TailwindCSS 4.2
- **Routing**: React Router 7.14
- **HTTP Client**: Axios 1.13
- **Data Visualization**: Recharts 3.8
- **UI Components**: Swiper (Carousels), Lucide React (Icons), QRCode React

---

## 🏗️ Project Structure

The frontend is strictly organized into functional domains:

```text
src/
├── api/             # Centralized Axios client & API method wrappers
├── components/      # Shared layout components (AppBar, Sidebar, PublicLayout, etc.)
├── features/        # Business logic & utilities (e.g., auth session management)
├── guards/          # React Router layout wrappers for Role-Based Routing
├── pages/           # Page-level components
│   ├── public/      # Homepage, Booking flow, User Profile
│   ├── admin/       # SuperAdmin/Manager/Staff dashboards & CRUD tables
│   ├── auth/        # Login and Registration forms
│   └── error/       # 403 Forbidden, 404 Not Found
└── routes/          # Centralized route definitions (router.tsx)
```

---

## 🔐 State & Authentication

### JWT Management
- The application stores the JWT access token in `localStorage`.
- `session.ts` provides strict parsing logic. It decodes the JWT to verify the `exp` (expiration) claim before trusting the token.
- **Auto-Logout**: If the token is expired, the session is cleared automatically to prevent "ghost" logins.

### Axios Interceptor
All HTTP requests route through a custom Axios instance (`axiosClient.ts`).
- An interceptor attaches the `Authorization: Bearer <token>` header to all outgoing requests.
- If the backend responds with a `401 Unauthorized` (e.g., token expired server-side), the interceptor catches the error, forcefully clears the local session, and redirects the user to `/login`.

### Route Guards
Security is enforced at the routing layer using Guard components (`SuperAdminGuard`, `ManagerGuard`, `StaffGuard`).
These components decode the token's `scope` and verify the presence of required roles. If a user tries to access `/superadmin/dashboard` with a `STAFF` token, they are instantly redirected to a `403 Forbidden` page.

---

## ✨ Key UI Features

- **Interactive Seat Map**: Visually distinguishes between Standard, VIP, and Sweetbox seats. Real-time polling reflects seats that are already booked or disabled.
- **Dynamic Pricing Calculator**: The UI instantly recalculates the total checkout price by combining the Base Ticket Price + Cinema-specific Seat Surcharges + Snacks.
- **QR Code E-Tickets**: Renders scannable QR codes for completed bookings, allowing Staff to scan and verify tickets at the cinema entrance.
- **Revenue Dashboards**: Implements `Recharts` to display visual line/bar graphs of revenue split by date, movie, and cinema branch.

---

## 🚀 Setup & Run

1. Ensure you have Node.js (version 20+) installed.
2. Install the dependencies:
```bash
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```

*Note: The frontend runs on `http://localhost:5173` by default and expects the backend to be running on `http://localhost:8080`. API base URLs can be overridden using `.env` variables if necessary.*
