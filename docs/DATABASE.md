# Database Schema - Movie Booking System

> **Database Name:** `movie_booking_db`
> **Collation:** `utf8mb4_unicode_ci`
> **Mô tả:** Hệ thống cơ sở dữ liệu quản lý rạp chiếu phim, lịch chiếu, tài khoản (khách hàng/nhân viên) và hệ thống đặt vé/đồ ăn.

---

## 1. Sơ đồ thực thể kết nối (ER Diagram)

```mermaid
erDiagram
    %% Core Entities
    CINEMAS ||--o{ THEATRES : "has"
    STATE ||--o{ CINEMAS : "located_in"
    THEATRES ||--o{ SEATS : "contains"
    SEAT_TYPE ||--o{ SEATS : "defines"
    SNACK_TYPE ||--o{ SNACKS : "categorizes"
    
    %% Accounts & Roles
    CINEMAS |o--o{ ACCOUNTS : "employs (optional)"
    ACCOUNTS ||--o{ ACCOUNT_ROLES : "has"
    ROLES ||--o{ ACCOUNT_ROLES : "assigned_to"

    %% Movies & Attributes
    DIRECTORS ||--o{ MOVIES : "directs"
    MOVIE_STATUS ||--o{ MOVIES : "has_status"
    MOVIES ||--o{ MOVIE_CAST : "features"
    CAST_MEMBERS ||--o{ MOVIE_CAST : "acts_in"
    MOVIES ||--o{ MOVIE_GENRE : "belongs_to"
    GENRES ||--o{ MOVIE_GENRE : "categorizes"

    %% Showings & Bookings
    MOVIES ||--o{ SHOWING_TIME : "shown_at"
    THEATRES ||--o{ SHOWING_TIME : "hosts"
    ACCOUNTS |o--o{ BOOKINGS : "makes (optional)"
    SHOWING_TIME ||--o{ BOOKINGS : "for"
    
    %% Booking Details
    BOOKINGS ||--o{ BOOKING_TICKET : "includes"
    TICKET_TYPE ||--o{ BOOKING_TICKET : "type_of"
    BOOKINGS ||--o{ BOOKING_SNACK : "includes"
    SNACKS ||--o{ BOOKING_SNACK : "item"
    BOOKINGS ||--o{ BOOKING_SEAT : "reserves"
    SEATS ||--o{ BOOKING_SEAT : "is_reserved"