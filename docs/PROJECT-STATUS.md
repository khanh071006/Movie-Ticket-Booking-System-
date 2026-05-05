# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: [Ngày hiện tại]
> **Trạng thái hiện tại**: Đã hoàn thiện cấu trúc Entity cho toàn bộ hệ thống, bao gồm cả các mối quan hệ N-N, và CRUD các danh mục.

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture**.
-   **Thiết Lập Database**:
    -   Thiết lập các Entity `Account`, `Role`, `Movie`, `Cinema`, `Room`, `Showtime`.
    -   Tách các Entity `Director`, `MovieStatus`, `CastMember`, `Genre` ra các feature package riêng biệt.
-   **Mô hình hóa quan hệ N-N**:
    -   **Refactor**: Chuyển đổi cách xử lý mối quan hệ Nhiều-Nhiều (ví dụ: `Movie` và `Genre`) bằng cách biến bảng trung gian thành một Entity đầy đủ (`MovieGenre`) có khóa chính riêng.
    -   **Thiết lập**: Entity trung gian (`MovieGenre`) giờ đây có 2 mối quan hệ `ManyToOne` đến `Movie` và `Genre`.
    -   **Cập nhật Rules**: Bổ sung quy tắc thiết kế này vào `PROJECT-RULES.md`.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`, bao gồm cả việc không sử dụng Lombok và ưu tiên vòng lặp `for`.
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
-   Hoàn thiện CRUD và API cho `Cinema`.

### 7. **Tính năng quản lý Phòng chiếu (Room)**
-   Hoàn thiện CRUD và API cho `Room`.

### 8. **Tính năng quản lý Lịch chiếu (Showtime)**
-   Hoàn thiện CRUD và API cho `Showtime`.

### 9. **Bảo mật (Security)**
-   **Cấu hình Spring Security**: Tắt CSRF, `STATELESS`, cấu hình `PasswordEncoder`, `DaoAuthenticationProvider`.
-   **JSON Web Token (JWT)**: Cấu hình `JwtEncoder`, `JwtDecoder`, tích hợp `oauth2ResourceServer`.
-   **`CustomUserDetailsService`**: Triển khai để lấy thông tin `UserDetails` từ database.

### 10. **Tính Năng Danh Mục Phim (Director, Genre, MovieStatus, CastMember)**
-   **Director**: Khởi tạo `ReqDirectorDTO`, `ResDirectorDTO`, `DirectorService`, `DirectorServiceImpl`, `DirectorRepository`, và `DirectorController`. Hoàn thiện chức năng CRUD danh mục đạo diễn cho `ADMIN`.
-   **Genre**: Khởi tạo `ReqGenreDTO`, `ResGenreDTO`, `GenreService`, `GenreServiceImpl`, `GenreRepository`, và `GenreController`. Hoàn thiện chức năng CRUD danh mục thể loại cho `ADMIN`, bao gồm logic kiểm tra tên không được trùng lặp.
-   **MovieStatus**: Khởi tạo `ReqMovieStatusDTO`, `ResMovieStatusDTO`, `MovieStatusService`, `MovieStatusServiceImpl`, `MovieStatusRepository`, và `MovieStatusController`. Hoàn thiện chức năng CRUD trạng thái chiếu phim cho `ADMIN`, bao gồm logic kiểm tra tên duy nhất.
-   **CastMember**: Khởi tạo `ReqCastMemberDTO`, `ResCastMemberDTO`, `CastMemberService`, `CastMemberServiceImpl`, `CastMemberRepository`, và `CastMemberController`. Hoàn thiện chức năng CRUD danh mục diễn viên cho `ADMIN`.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Nâng cấp API của Movie]**
1.  **Nâng cấp API của Movie**: Cập nhật các API `POST` và `PUT` của `Movie` để cho phép `ADMIN` có thể gán đạo diễn, trạng thái, danh sách diễn viên và thể loại cho phim khi tạo/sửa.

**[P1 - Ưu tiên trung bình: Lõi Booking]**
2.  **Triển khai tính năng Ghế (Seat):**
    -   Tạo Entity `Seat` với các thuộc tính như `seat_number`, `seat_type` (thường, VIP), và mối quan hệ với `Room`.
    -   Xây dựng API cho phép `ADMIN` cấu hình sơ đồ ghế cho mỗi phòng chiếu.
3.  **Xây dựng nền tảng cho việc Đặt vé (Booking):**
    -   Thiết kế và tạo các Entity cốt lõi: `Booking`, `Ticket`, và `BookingSeat`.
    -   Xây dựng API cho phép người dùng tạo một `Booking` mới cho một `Showtime` cụ thể.

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Logic xóa `Showtime` cần được bổ sung để kiểm tra xem đã có vé nào được đặt cho lịch chiếu đó chưa trước khi cho phép xóa.
-   Cần có cơ chế dọn dẹp hoặc lưu trữ các lịch chiếu đã qua để tránh làm database bị phình to theo thời gian.
