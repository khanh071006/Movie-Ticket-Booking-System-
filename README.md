# 🍿 Movie Ticket Booking System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![VNPay](https://img.shields.io/badge/VNPay-Sandbox-0066FF?style=for-the-badge)

A comprehensive **Fullstack Web Application** for online movie ticket booking, featuring a customer-facing portal with real-time seat selection and VNPay payment integration, alongside a multi-role admin dashboard for cinema management, revenue reporting, and QR code ticket scanning.

---

## ✨ Key Features

### 🎬 Customer Portal
- **Movie Browsing** — Explore movies with posters, trailers, cast members, genres, and detailed descriptions.
- **Showtime Lookup** — View available showtimes filtered by movie, cinema, and date.
- **Real-time Seat Selection** — Interactive seat map with live availability status per showtime.
- **Online Payment** — Secure checkout via **VNPay** sandbox gateway with automatic booking confirmation.
- **Booking History & E-Ticket** — View past bookings and generate QR code e-tickets from the profile page.
- **User Registration with OTP** — Email-based OTP verification for new account registration.

### 🏢 Admin Dashboard (Multi-role)
- **SuperAdmin** — Full system control: manage cinemas, movies, accounts, rooms, showtimes, categories, seat types, ticket types, snacks, and view revenue reports.
- **Manager** — Cinema-scoped management: manage staff, movies, rooms, showtimes, and pricing for their assigned cinema only.
- **Staff** — Operational tools: view showtimes, scan QR code tickets for check-in.

### 🔐 Enterprise Security Architecture
- **Dynamic PBAC (Permission-Based Access Control)** — Permissions are stored in the database (`permissions` + `role_permissions` tables) and loaded into JWT tokens at login. All write endpoints are protected with `@PreAuthorize("hasAuthority('...')")`, enabling runtime permission changes without code redeployment.
- **Stateless JWT Authentication** — OAuth2 Resource Server with HMAC-SHA256 signed tokens. No server-side session storage.
- **Multi-tenancy Isolation** — Managers and Staff are scoped to their `cinemaId`. Data queries are automatically filtered to prevent cross-cinema access.
- **Frontend Token Validation** — JWT expiration is checked client-side on every request. Expired tokens are automatically cleared, redirecting users to the login page.

### ⚡ Concurrency & Data Integrity
- **Pessimistic Locking** — `@Lock(LockModeType.PESSIMISTIC_WRITE)` on seat queries during booking to prevent double-booking race conditions.
- **Transactional Booking Flow** — The entire seat selection → price calculation → booking creation pipeline runs inside a single `@Transactional` boundary.

### 💰 Flexible Pricing Engine
- **Cinema-specific Pricing** — Each cinema can configure its own ticket prices (by ticket type) and seat surcharges (by seat type).
- **Dynamic Price Calculation** — Final ticket price = base ticket type price + seat type surcharge, resolved per cinema at booking time.

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language runtime |
| Spring Boot | 4.0.5 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | ORM & database access |
| OAuth2 Resource Server | — | JWT token validation |
| PostgreSQL | 18 | Relational database |
| ZXing | 3.5.3 | QR code generation |
| Spring Mail | — | SMTP email (OTP verification) |
| Bean Validation | — | Request DTO validation |
| Maven | — | Build tool |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI library |
| TypeScript | 6.0 | Type-safe JavaScript |
| Vite | 8.0 | Build tool & dev server |
| TailwindCSS | 4.2 | Utility-first CSS framework |
| React Router | 7.14 | Client-side routing |
| Axios | 1.13 | HTTP client |
| Recharts | 3.8 | Revenue dashboard charts |
| Lucide React | 1.8 | Icon library |
| Swiper | 12.2 | Carousel / slider component |
| QRCode React | 4.2 | QR code rendering |
| date-fns | 4.4 | Date formatting utilities |

---

## 📂 Project Structure

```text
Movie_Ticket_Booking_System/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/.../
│   │   ├── config/                   # SecurityConfig, CORS, JWT beans
│   │   ├── exception/                # Global exception handler
│   │   ├── features/                 # Feature-based modules
│   │   │   ├── account/              # User account CRUD & multi-tenancy
│   │   │   ├── auth/                 # Login, Register, OTP verification
│   │   │   ├── booking/              # Booking creation with pessimistic locking
│   │   │   ├── cinema/               # Cinema management
│   │   │   ├── cinema_pricing/       # Per-cinema ticket & seat pricing
│   │   │   ├── movie/                # Movie CRUD with cast, genre, director
│   │   │   ├── payment/              # VNPay integration (create URL, callback)
│   │   │   ├── report/               # Revenue reports (by date, movie, cinema)
│   │   │   ├── role/                 # Role, Permission, RolePermission entities
│   │   │   ├── room/                 # Room management
│   │   │   ├── seat/                 # Seat entity & seat locking
│   │   │   ├── showtime/             # Showtime scheduling
│   │   │   ├── snack/                # Snack catalog
│   │   │   └── ...                   # Other domain modules
│   │   └── security/                 # CustomUserDetailsService, SecurityUtil, JWT
│   ├── src/main/resources/
│   │   ├── application.properties    # Common config
│   │   └── application-local.properties  # Local DB, JWT secret, VNPay keys
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── api/                      # Axios HTTP client & API methods
│   │   ├── components/               # Shared layouts (Public, SuperAdmin, Manager, Staff)
│   │   ├── features/auth/            # Login/Register logic, JWT session utils
│   │   ├── guards/                   # Route guards (SuperAdmin, Manager, Staff, Guest)
│   │   ├── pages/
│   │   │   ├── public/               # HomePage, MoviesPage, BookingPage, PaymentReturn...
│   │   │   ├── admin/                # Dashboard, Account/Cinema/Room/Showtime management...
│   │   │   ├── auth/                 # LoginPage, RegisterPage
│   │   │   └── error/                # 403 Forbidden, 404 Not Found
│   │   ├── routes/router.tsx         # Centralized route definitions
│   │   └── types/                    # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
├── .agents/                          # AI Agent customization skills
└── .gitignore
```

---

## 🏗 Architecture Overview

### Authentication & Authorization Flow

```
User Login → CustomUserDetailsService loads Roles + Permissions from DB
           → Permissions injected as GrantedAuthority into SecurityContext
           → SecurityUtil encodes authorities into JWT "scope" claim
           → JWT returned to client, stored in localStorage
           → Every API request sends JWT in Authorization header
           → Spring OAuth2 Resource Server decodes JWT
           → @PreAuthorize("hasAuthority('MOVIE_CREATE')") checks scope
           → Access granted or 403 Forbidden
```

### Booking & Payment Flow

```
Customer selects seats → POST /api/v1/bookings
  → @Transactional begins
  → SeatRepository.findByIdsWithLock() — PESSIMISTIC_WRITE
  → Validate seats are not already booked for this showtime
  → Calculate total price (ticket type price + seat surcharge per cinema)
  → Create Booking entity (status: PENDING)
  → Create BookingSeat join records
  → Return booking ID

Customer clicks Pay → POST /api/v1/payments/vnpay/create-url
  → Generate VNPay payment URL with booking amount
  → Redirect customer to VNPay sandbox

VNPay callback → GET /api/v1/payments/vnpay/callback
  → Verify HMAC hash
  → Update Booking status: PENDING → CONFIRMED
  → Redirect to frontend PaymentReturnPage
```

### Role-Permission Matrix

| Permission | SuperAdmin | Manager | Staff | User |
|---|:---:|:---:|:---:|:---:|
| `MOVIE_CREATE/UPDATE/DELETE` | ✅ | ✅ | ❌ | ❌ |
| `CINEMA_CREATE/UPDATE/DELETE` | ✅ | ❌ | ❌ | ❌ |
| `ROOM_CREATE/UPDATE/DELETE` | ✅ | ✅ | ❌ | ❌ |
| `SHOWTIME_CREATE/DELETE` | ✅ | ✅ | ❌ | ❌ |
| `BOOKING_CREATE/READ` | ✅ | ✅ | ✅ | ✅ |
| `BOOKING_CHECKIN` | ✅ | ✅ | ✅ | ❌ |
| `ACCOUNT_CREATE/UPDATE/DELETE` | ✅ | ✅ | ❌ | ❌ |
| `REPORT_VIEW` | ✅ | ✅ | ❌ | ❌ |
| `PRICING_MANAGE` | ✅ | ✅ | ❌ | ❌ |
| `CONFIG_*` | ✅ | ✅ | ❌ | ❌ |
| `CATEGORY_*` | ✅ | ✅ | ❌ | ❌ |

---

## 🚀 Getting Started

### Prerequisites

- **Java** 21+ ([Download](https://adoptium.net/))
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/))

### 1. Clone the Repository

```bash
git clone https://github.com/khanh071006/Movie-Ticket-Booking-System-.git
cd Movie-Ticket-Booking-System-
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE movie_booking_db;
```

### 3. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application-local.properties` with your database credentials:

```properties
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expires-in=604800

vnpay.tmnCode=YOUR_VNPAY_TMN_CODE
vnpay.hashSecret=YOUR_VNPAY_HASH_SECRET
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.returnUrl=http://localhost:5173/payment/vnpay-return
```

Start the backend server:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend will start at `http://localhost:8080`. Hibernate will auto-create all database tables on first run.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 5. Seed Data (Optional)

Python utility scripts are available in the project root (excluded from Git) to populate the database with sample movies, cinemas, rooms, showtimes, and accounts. Run them with:

```bash
pip install psycopg2-binary
python seed_permissions.py   # Required: seed roles & permissions for PBAC
python seed_movies.py        # Optional: sample movie data
python seed_rooms.py         # Optional: sample room & seat configurations
```

---

## 📡 API Endpoints Overview

### Public (No Authentication)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | User login, returns JWT |
| `POST` | `/api/v1/auth/register` | User registration |
| `POST` | `/api/v1/auth/verify-otp` | OTP email verification |
| `GET` | `/api/v1/movies` | List all movies (paginated) |
| `GET` | `/api/v1/movies/{id}` | Movie details |
| `GET` | `/api/v1/cinemas` | List all cinemas |
| `GET` | `/api/v1/showtimes/movie/{id}` | Showtimes by movie |
| `GET` | `/api/v1/bookings/showtime/{id}/booked-seats` | Booked seats for a showtime |

### Authenticated
| Method | Endpoint | Permission | Description |
|---|---|---|---|
| `POST` | `/api/v1/bookings` | `BOOKING_CREATE` | Create a booking |
| `PUT` | `/api/v1/bookings/{id}/checkin` | `BOOKING_CHECKIN` | Check-in with QR scan |
| `POST` | `/api/v1/movies` | `MOVIE_CREATE` | Create a movie |
| `PUT` | `/api/v1/movies/{id}` | `MOVIE_UPDATE` | Update a movie |
| `DELETE` | `/api/v1/movies/{id}` | `MOVIE_DELETE` | Delete a movie |
| `POST` | `/api/v1/cinemas` | `CINEMA_CREATE` | Create a cinema |
| `GET` | `/api/v1/reports/revenue-by-date` | `REPORT_VIEW` | Revenue report by date |
| `GET` | `/api/v1/reports/revenue-by-movie` | `REPORT_VIEW` | Revenue report by movie |
| `POST` | `/api/v1/payments/vnpay/create-url` | Authenticated | Generate VNPay payment URL |

---

## 👤 Default Accounts

| Role | Email | Password |
|---|---|---|
| SuperAdmin | `superadmin@gmail.com` | `123456` |

> After seeding permissions, log in with the SuperAdmin account to create Manager, Staff, and User accounts via the admin dashboard.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/khanh071006">khanh071006</a>
</p>
