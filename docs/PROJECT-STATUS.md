# Project Status

> Dự án: Movie Ticket Booking System
> Cập nhật lần cuối: [Ngày hiện tại]
> Trạng thái hiện tại: Đã tái cấu trúc dự án sang kiến trúc Feature-Based.

---

## ✅ Đã hoàn thành (Completed)

1.  **Tái Cấu Trúc (Refactoring) sang Feature-Based Architecture**:
    *   Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang Feature-Based theo tài liệu `ARCHITECTURE.md`.
    *   Tạo các package `features` chính: `auth`, `user`, `role`.
    *   Tạo các package cho các thành phần dùng chung: `config`, `security`, `common`, `exception`.
    *   Di chuyển, đổi tên và cập nhật các class (`Controller`, `Service`, `Repository`, `Entity`, `DTO`) vào cấu trúc mới.
    *   Sửa lại tất cả các câu lệnh `import` bị lỗi sau khi tái cấu trúc.

2.  **Thiết Lập Nền Tảng**:
    *   Khởi tạo dự án Spring Boot, kết nối PostgreSQL.
    *   Thiết lập các Entity `User`, `Role`, `UserRole` với quan hệ Many-to-Many.
    *   Tạo `DataInitializer` để tự động thêm `USER` và `ADMIN` roles vào database.

3.  **Tính Năng User & Auth**:
    *   **API Đăng ký**: Hoàn thiện API `POST /api/v1/auth/register` với logic:
        *   Kiểm tra email trùng lặp.
        *   Mã hóa mật khẩu.
        *   Lưu `User` mới và gán `Role` "USER" mặc định.
    *   **API Lấy Danh Sách User**: Hoàn thiện API `GET /api/v1/users` để trả về danh sách người dùng.
    *   **DTOs**: Tạo các DTOs chuyên biệt cho request và response (`ReqRegisterDTO`, `ResAuthDTO`, `ResUserDTO`).

4.  **Cấu Hình Security**:
    *   Tắt CSRF, thiết lập `SessionCreationPolicy.STATELESS`.
    *   Cấu hình `PasswordEncoder` (BCrypt).
    *   Tạo `CustomUserDetailsService` để lấy thông tin người dùng từ database.
    *   Phân quyền cơ bản:
        *   `/api/v1/auth/**`: Mở cho tất cả mọi người.
        *   `/api/v1/users`: Yêu cầu đã xác thực.
        *   Các API khác: Yêu cầu đã xác thực.
    *   Cấu hình sẵn các bean `JwtEncoder`, `JwtDecoder`, `AuthenticationManager` để chuẩn bị cho việc tích hợp JWT.

## ⏳ Đang tiến hành (In Progress)

- Hiện tại không có nhiệm vụ nào đang trong quá trình thực hiện.

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao nhất: Hoàn thiện luồng Login JWT]**
1.  **Tạo `SecurityUtil`**: Tạo một class `SecurityUtil` chứa hàm `createToken()` để tạo chuỗi JWT từ thông tin `Authentication`.
2.  **Hoàn thiện API Login**:
    *   Triển khai logic cho endpoint `POST /api/v1/auth/login`.
    *   Sử dụng `AuthenticationManager` để xác thực thông tin đăng nhập.
    *   Gọi `createToken()` để tạo JWT và trả về cho client trong `ResAuthDTO`.
3.  **Test Luồng JWT**:
    *   Sử dụng một công cụ như Postman để gọi API `/login`, lấy token.
    *   Dùng token vừa nhận được để gọi API `GET /api/v1/users` và xác nhận thành công.

**[P1 - Ưu tiên trung bình: Phân Quyền Chi Tiết]**
4.  Cập nhật `SecurityConfig` để yêu cầu role `ADMIN` cho API `GET /api/v1/users`.
5.  Tạo một user có role `ADMIN` để kiểm tra lại.

## ⚠️ Lưu ý / Rủi ro (Warnings)

- `secret key` cho JWT đang được tham chiếu từ `application.properties` (`${jwt.secret}`). Cần đảm bảo giá trị này được thiết lập và không bị lộ.
- Các file cấu hình chứa thông tin nhạy cảm nên được đưa vào `.gitignore`.