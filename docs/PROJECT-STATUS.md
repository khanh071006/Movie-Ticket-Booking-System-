# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: [Ngày hiện tại]
> **Trạng thái hiện tại**: Đã hoàn thiện các tính năng cốt lõi về quản lý Rạp (Cinema), Phòng (Room) và Lịch chiếu (Showtime).

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture**.
-   **Thiết Lập Database**: Thiết lập các Entity `Account`, `Role`, `Movie`, `Cinema`, `Room`, `Showtime`.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`.
-   **Tài liệu API**: Cập nhật `PROJECT-ENTRYPOINT.md` với chi tiết các API endpoints mới.

### 2. **Tính Năng Xác thực (Authentication)**
-   **API Đăng ký (`POST /api/v1/auth/register`)**
-   **API Đăng nhập (`POST /api/v1/auth/login`)**

### 3. **Tính Năng Account (`/api/v1/accounts`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho tài khoản (yêu cầu quyền `ADMIN`).

### 4. **Tính Năng Movie (`/api/v1/movies`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho phim (yêu cầu quyền `ADMIN`, trừ API lấy danh sách).

### 5. **Tính Năng Role (`/api/v1/roles`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho role (yêu cầu quyền `ADMIN`).

### 6. **Tính năng quản lý Rạp (Cinema)**
-   **Cấu trúc:** Tạo `CinemaRepository`, `CinemaDTO`, `CinemaService`, và `CinemaController`.
-   **Logic nghiệp vụ:** Triển khai logic kiểm tra ràng buộc trước khi xóa một `Cinema` (kiểm tra các `Room` và `Showtime` liên quan).
-   **API Endpoints:**
    -   `GET /api/v1/cinemas/**`: Lấy danh sách/chi tiết rạp (công khai).
    -   `POST, PUT, DELETE /api/v1/cinemas/**`: Quản lý rạp (yêu cầu quyền `ADMIN`).
-   **Bảo mật:** Cập nhật `SecurityConfig` để phân quyền cho các endpoint.

### 7. **Tính năng quản lý Phòng chiếu (Room)**
-   **Cấu trúc:** Tạo `RoomRequestDTO`, `RoomResponseDTO`, `RoomService`, và `RoomController`.
-   **Logic nghiệp vụ:** Triển khai logic kiểm tra ràng buộc trước khi xóa một `Room` (kiểm tra các `Showtime` liên quan).
-   **API Endpoints:**
    -   `GET /api/v1/rooms/cinema/{cinemaId}`: Lấy danh sách phòng của một rạp (công khai).
    -   `POST, PUT, DELETE /api/v1/rooms/**`: Quản lý phòng (yêu cầu quyền `ADMIN`).
-   **Bảo mật:** Cập nhật `SecurityConfig` để phân quyền cho các endpoint.

### 8. **Tính năng quản lý Lịch chiếu (Showtime)**
-   **Cấu trúc:** Tạo `ShowtimeRequestDTO`, `ShowtimeResponseDTO` (chứa thông tin chi tiết), `ShowtimeService`, và `ShowtimeController`.
-   **Logic nghiệp vụ nâng cao:**
    -   Tự động tính toán `endTime` dựa trên thời lượng phim và thời gian đệm.
    -   Kiểm tra xung đột lịch chiếu trong cùng một phòng.
-   **API Endpoints:**
    -   `GET /api/v1/showtimes/**`: Lấy danh sách lịch chiếu theo phim hoặc theo phim và rạp (công khai).
    -   `POST, DELETE /api/v1/showtimes/**`: Quản lý lịch chiếu (yêu cầu quyền `ADMIN`).
-   **Bảo mật:** Cập nhật `SecurityConfig` để phân quyền cho các endpoint.

### 9. **Bảo mật (Security)**
-   **Cấu hình Spring Security**: Tắt CSRF, `STATELESS`, cấu hình `PasswordEncoder`, `DaoAuthenticationProvider`.
-   **JSON Web Token (JWT)**: Cấu hình `JwtEncoder`, `JwtDecoder`, tích hợp `oauth2ResourceServer`.
-   **`CustomUserDetailsService`**: Triển khai để lấy thông tin `UserDetails` từ database.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Hoàn thiện lõi Booking]**
1.  **Triển khai tính năng Ghế (Seat):**
    -   Tạo Entity `Seat` với các thuộc tính như `seat_number`, `seat_type` (thường, VIP), và mối quan hệ với `Room`.
    -   Xây dựng API cho phép `ADMIN` cấu hình sơ đồ ghế cho mỗi phòng chiếu.
2.  **Xây dựng nền tảng cho việc Đặt vé (Booking):**
    -   Thiết kế và tạo các Entity cốt lõi: `Booking`, `Ticket`, và `BookingSeat`.
    -   Xây dựng API cho phép người dùng tạo một `Booking` mới cho một `Showtime` cụ thể, chọn các `Seat` mong muốn.

**[P1 - Ưu tiên trung bình: Mở rộng Feature]**
3.  **Hoàn thiện các Entity liên quan đến Movie**: Dựa theo `DATABASE.md`, tạo các entity `Director`, `MovieStatus`, `CastMember`, `Genre` và thiết lập các mối quan hệ với Entity `Movie` để làm giàu thông tin phim.
4.  **Hoàn thiện profile cá nhân**: Cho phép người dùng (`USER`) lấy và cập nhật thông tin của chính mình.

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Logic xóa `Showtime` cần được bổ sung để kiểm tra xem đã có vé nào được đặt cho lịch chiếu đó chưa trước khi cho phép xóa.
-   Cần có cơ chế dọn dẹp hoặc lưu trữ các lịch chiếu đã qua để tránh làm database bị phình to theo thời gian.