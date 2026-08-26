# 🛠️ Backend - Spring Boot Architecture

This directory contains the robust backend for the Movie Ticket Booking System, built with **Java 21** and **Spring Boot 3**. It handles all business logic, data persistence, enterprise-grade security, and payment processing.

## 💻 Tech Stack

- **Framework**: Spring Boot 4.0.5 (WebMVC)
- **Language**: Java 21
- **Database**: PostgreSQL 18 + Spring Data JPA (Hibernate)
- **Security**: Spring Security + OAuth2 Resource Server (JWT)
- **Payment**: VNPay Sandbox Integration
- **Utilities**: ZXing (QR Code generation), Spring Mail (OTP)

---

## 🏗️ Architecture Highlights

### 🔐 Dynamic PBAC (Permission-Based Access Control)
Unlike traditional static Role-Based Access Control (`.hasRole()`), this system uses a highly flexible, database-driven PBAC architecture.
- **Data Model**: `Permission` and `RolePermission` entities map specific actions (e.g., `MOVIE_CREATE`) to `Roles`.
- **JWT Injection**: During login, `CustomUserDetailsService` fetches a user's permissions and injects them as `GrantedAuthority` into the Security Context and the outgoing JWT `scope` claim.
- **Method Security**: All controller endpoints are protected using `@PreAuthorize("hasAuthority('...')")`, meaning permissions can be altered at runtime without restarting the server.

### ⚡ Concurrency & Seat Locking
To prevent race conditions where two users book the same seat simultaneously, the application implements **Pessimistic Locking**.
- Uses `@Lock(LockModeType.PESSIMISTIC_WRITE)` in `SeatRepository.findByIdsWithLock()`.
- The entire booking transaction is wrapped in `@Transactional`, ensuring seats are exclusively locked until the price calculation and `PENDING` booking creation are complete.

### 💰 VNPay Payment Flow
1. A booking is created with status `PENDING`.
2. `PaymentController` generates a secure VNPay URL signed with HMAC-SHA512.
3. The user pays on the VNPay portal.
4. VNPay redirects back to the callback endpoint, which verifies the signature and updates the booking status to `CONFIRMED`.

---

## 🗄️ Database Schema Overview

The PostgreSQL database is fully managed by Hibernate (`spring.jpa.hibernate.ddl-auto=update`). Key tables include:
- **Core Entities**: `movies`, `cinemas`, `rooms`, `seats`, `showtimes`.
- **Booking & Pricing**: `bookings`, `booking_seats`, `ticket_types`, `seat_types`, `cinema_ticket_prices`.
- **Security**: `accounts`, `roles`, `permissions`, `role_permissions`.

---

## 📡 Key API Endpoints

### Public Endpoints (No Token Required)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate and return JWT |
| `GET` | `/api/v1/movies` | Fetch all movies |
| `GET` | `/api/v1/cinemas` | Fetch all cinemas |
| `GET` | `/api/v1/showtimes/movie/{id}` | Get showtimes for a specific movie |
| `GET` | `/api/v1/bookings/showtime/*/booked-seats` | Get list of unavailable seats |

### Authenticated Endpoints (JWT Required)
| Method | Path | Required Permission |
|---|---|---|
| `POST` | `/api/v1/bookings` | `BOOKING_CREATE` |
| `PUT` | `/api/v1/bookings/{id}/checkin` | `BOOKING_CHECKIN` |
| `POST` | `/api/v1/movies` | `MOVIE_CREATE` |
| `POST` | `/api/v1/cinemas` | `CINEMA_CREATE` |
| `GET` | `/api/v1/reports/revenue-by-date` | `REPORT_VIEW` |

---

## ⚙️ Setup & Run

1. Open `src/main/resources/application-local.properties`.
2. Configure your specific environment variables:
```properties
spring.datasource.password=YOUR_POSTGRES_PASSWORD
jwt.secret=YOUR_LONG_RANDOM_SECRET_KEY
jwt.expires-in=604800 # (7 days in seconds)
vnpay.tmnCode=YOUR_VNPAY_TMN
vnpay.hashSecret=YOUR_VNPAY_SECRET
```
3. Run the application:
```bash
./mvnw spring-boot:run
```
*Note: The server runs on `localhost:8080`.*
