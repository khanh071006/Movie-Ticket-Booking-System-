# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: 23/04/2026
> **Trạng thái hiện tại**: Đã hoàn thành luồng xác thực (đăng ký, đăng nhập) với JWT và tái cấu trúc thành công sang kiến trúc Feature-Based.

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture** theo tài liệu `ARCHITECTURE.md`.
    -   Tạo các package `features` chính: `account`, `auth`, `role`.
    -   Tạo các package cho các thành phần dùng chung: `config`, `security`, `common`, `exception`.
-   **Thiết Lập Database**:
    -   Thiết lập các Entity `Account`, `Role`, `AccountRole` với quan hệ Many-to-Many, tuân thủ `DATABASE.md`.
    -   Tạo `DataInitializer` để tự động thêm `USER` và `ADMIN` roles vào database khi khởi động.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`.

### 2. **Tính Năng Xác thực (Authentication)**
-   **API Đăng ký (`POST /api/v1/auth/register`)**:
    -   Sử dụng `ReqRegisterDTO` để validate đầu vào.
    -   Logic được xử lý trong `AccountService`, bao gồm: kiểm tra email trùng lặp, mã hóa mật khẩu (BCrypt), lưu `Account` mới và tự động gán `Role` "USER" mặc định.
-   **API Đăng nhập (`POST /api/v1/auth/login`)**:
    -   Sử dụng `ReqLoginDTO` để validate đầu vào.
    -   Toàn bộ nghiệp vụ được đưa xuống `AuthService` (tuân thủ "Thin Controller"):
        -   Sử dụng `AuthenticationManager` để xác thực thông tin `email` và `password`.
        -   Gọi `SecurityUtil.createToken()` để tạo `accessToken` (JWT).
        -   Trả về `ResAuthDTO` chứa thông tin token (`accessToken`, `tokenType`, `expiresIn`) và thông tin `account`.
-   **Quản lý Tài khoản (Account Management CRUD)**:
    -   Triển khai đầy đủ API CRUD cho tài khoản tại `/api/v1/accounts`:
        -   `GET /api/v1/accounts`: Lấy danh sách tài khoản (có phân trang).
        -   `GET /api/v1/accounts/{id}`: Lấy chi tiết tài khoản.
        -   `PUT /api/v1/accounts/{id}`: Cập nhật thông tin tài khoản (Họ tên, Số điện thoại).
        -   `DELETE /api/v1/accounts/{id}`: Vô hiệu hóa tài khoản (Soft Delete bằng trường `is_active`).
    -   Bổ sung trường `is_active` vào `Account` entity để hỗ trợ xóa mềm.
    -   Tạo `ReqUpdateAccountDTO` và cập nhật `ResAccountDTO`.

### 3. **Bảo mật (Security)**
-   **Cấu hình Spring Security**:
    -   Tắt CSRF, thiết lập `SessionCreationPolicy.STATELESS` cho API.
    -   Cấu hình `PasswordEncoder` (BCrypt) và `DaoAuthenticationProvider` để đảm bảo cơ chế mã hóa mật khẩu nhất quán.
    -   Phân quyền các endpoint:
        -   `/api/v1/auth/**`: Mở cho tất cả mọi người.
        -   `/api/v1/accounts`: Yêu cầu đã xác thực (chưa phân quyền chi tiết).
        -   Các API khác: Yêu cầu đã xác thực.
-   **JSON Web Token (JWT)**:
    -   Cấu hình `JwtEncoder` và `JwtDecoder` sử dụng thuật toán `HmacSHA256`.
    -   Tạo `SecurityUtil` với phương thức `createToken()` để tạo JWT có thời hạn 15 phút.
    -   Tích hợp `oauth2ResourceServer` để tự động xác thực token từ header `Authorization: Bearer ...`.
-   **`CustomUserDetailsService`**: Triển khai để lấy thông tin `UserDetails` (bao gồm cả roles) từ database, phục vụ cho quá trình xác thực của Spring Security.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao nhất: Hoàn thiện & Ổn định luồng JWT]**
1.  **Đồng bộ hóa Cấu hình**: Đưa các giá trị "magic number" như `expiresIn` và `jwt.secret` ra file `application.properties` và inject vào các class liên quan (`SecurityUtil`, `AuthServiceImpl`, `SecurityConfig`) để dễ quản lý và tránh lỗi `JwtEncodingException`.
2.  **Triển khai Refresh Token**: Xây dựng cơ chế Refresh Token như đã được mô tả trong `ARCHITECTURE.md` để cho phép người dùng duy trì phiên đăng nhập một cách an toàn mà không cần đăng nhập lại thường xuyên.

**[P1 - Ưu tiên trung bình: Phân Quyền Chi Tiết (RBAC)]**
3.  **Phân quyền cho API**: Cập nhật `SecurityConfig` để yêu cầu role `ADMIN` cho API `GET /api/v1/accounts`.
4.  **Tạo User Admin**: Tạo một cơ chế (ví dụ: một script SQL hoặc một endpoint nội bộ) để tạo một tài khoản có vai trò `ADMIN` nhằm mục đích kiểm thử và quản trị.

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Lỗi `JwtEncodingException: Failed to select a JWK signing key` có thể vẫn xảy ra nếu giá trị `jwt.secret` trong `application.properties` chưa được thiết lập, quá ngắn, hoặc không được load đúng cách. Cần kiểm tra kỹ phần này.