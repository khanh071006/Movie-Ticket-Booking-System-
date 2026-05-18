# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: [Ngày hiện tại]
> **Trạng thái hiện tại**: Đã hoàn thiện lõi tính năng Booking và phân quyền chi tiết cho toàn bộ hệ thống.

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture**.
-   **Thiết Lập Database**:
    -   Thiết lập các Entity `Account`, `Role`, `Movie`, `Cinema`, `Room`, `Showtime`.
    -   Tách các Entity `Director`, `MovieStatus`, `CastMember`, `Genre` ra các feature package riêng biệt.
-   **Mô hình hóa quan hệ N-N**:
    -   **Refactor**: Chuyển đổi cách xử lý mối quan hệ Nhiều-Nhiều (ví dụ: `Movie` và `Genre`) bằng cách biến bảng trung gian thành một Entity đầy đủ (`MovieGenre`) có khóa chính riêng.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`.
-   **Tài liệu API**: Cập nhật `PROJECT-ENTRYPOINT.md` với chi tiết các API endpoints mới.

### 2. **Tính Năng Lõi Booking (Booking Core)**
-   **Chuẩn hóa theo `DB.md`**:
    -   **Refactor `Cinema` & `Room`**: Đã chuyển đổi kiểu khóa chính của `Cinema` và `Room` từ `UUID` sang `Integer` với `GenerationType.IDENTITY` để tuân thủ `DB.md`. Đổi tên bảng của `Room` thành `theatres` trong mã nguồn để đồng bộ.
-   **Triển khai tính năng Ghế (Seat)**:
    -   **Feature `SeatType`**: Hoàn thiện CRUD API (`/api/v1/seat-types`) cho phép `ADMIN` quản lý các loại ghế (ví dụ: "Normal", "VIP").
    -   **Cấu trúc lại `Seat`**: Cập nhật Entity `Seat` để sử dụng `id (INT)` và có quan hệ `ManyToOne` đến `SeatType` và `Room`.
    -   **API Cấu hình Ghế**: Cung cấp API `POST /api/v1/rooms/{roomId}/seats` cho phép `ADMIN` tạo hàng loạt ghế cho một phòng chiếu.
-   **Xây dựng nền tảng Đặt vé (Booking)**:
    -   **Feature `TicketType`**: Hoàn thiện CRUD API (`/api/v1/ticket-types`) cho phép `ADMIN` quản lý các loại vé và giá vé gốc (ví dụ: "Người lớn", "Trẻ em").
    -   **Thiết kế Entities**: Tạo các entity `Booking`, `BookingSeat`, `BookingTicket` theo đúng thiết kế trong `DB.md`, sử dụng `CascadeType.ALL` để quản lý vòng đời các thực thể con.
    -   **API Đặt vé**: Triển khai API `POST /api/v1/bookings` cho phép người dùng đã xác thực tạo booking mới, nhận vào `showtimeId`, danh sách `seatIds`, và số lượng vé theo từng `ticketTypeId`.

### 3. **Bảo mật (Security)**
-   **Cấu hình Spring Security**: Tắt CSRF, `STATELESS`, cấu hình `PasswordEncoder`, `DaoAuthenticationProvider`.
-   **JSON Web Token (JWT)**: Cấu hình `JwtEncoder`, `JwtDecoder`, tích hợp `oauth2ResourceServer`.
-   **`CustomUserDetailsService` & `UserPrincipal`**: Triển khai để lấy thông tin `UserDetails` tùy chỉnh (bao gồm `accountId`) từ database, giúp tầng service có thể truy cập định danh người dùng một cách an toàn.
-   **Phân quyền (Authorization)**: Bổ sung các quy tắc phân quyền chi tiết trong `SecurityConfig` cho toàn bộ các API mới và cũ:
    -   Các API danh mục (`SeatType`, `TicketType`) và các API cấu hình (`tạo phòng`, `tạo ghế`, `tạo phim`...) yêu cầu quyền `ADMIN`.
    -   Các API đọc dữ liệu công khai (`xem phim`, `xem lịch chiếu`...) được `permitAll`.
    -   API đặt vé (`/bookings`) yêu cầu người dùng phải `authenticated`.

### 4. **Các tính năng khác đã hoàn thiện**
-   Hoàn thiện CRUD cho `Account`, `Movie`, `Role`, `Cinema`, `Room`, `Showtime`, và các danh mục phim (`Director`, `Genre`...).

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Hoàn thiện Booking & Bảo mật]**
1.  **Chống Double-Booking**: Bổ sung logic trong `BookingServiceImpl` để kiểm tra xem các ghế được chọn đã bị đặt trong các booking khác cho cùng một suất chiếu (`Showtime`) hay chưa.
2.  **Viết Test cho Security & Booking**:
    -   Viết các bài test tích hợp để xác thực các quy tắc phân quyền (ví dụ: `USER` không thể gọi API của `ADMIN`).
    -   Viết test cho API `POST /api/v1/bookings` để xác thực các kịch bản thành công và thất bại.

**[P1 - Ưu tiên trung bình: Cải thiện]**
3.  **Hoàn thiện Logic `delete`**: Triển khai logic kiểm tra ràng buộc trước khi xóa trong các service `SeatTypeServiceImpl` và `TicketTypeServiceImpl` để ngăn ngừa việc xóa các danh mục đang được sử dụng.

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Cần có cơ chế dọn dẹp hoặc lưu trữ các lịch chiếu đã qua để tránh làm database bị phình to theo thời gian.
