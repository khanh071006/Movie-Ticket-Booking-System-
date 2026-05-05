# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: [Ngày hiện tại]
> **Trạng thái hiện tại**: Đã hoàn thành luồng xác thực (đăng ký, đăng nhập) với JWT, tái cấu trúc thành công sang kiến trúc Feature-Based, và hoàn thiện CRUD cho Feature Movie, Feature Role và Feature Account.

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture** theo tài liệu `ARCHITECTURE.md`.
    -   Tạo các package `features` chính: `account`, `auth`, `role`, `movie`.
    -   Tạo các package cho các thành phần dùng chung: `config`, `security`, `common`, `exception`.
-   **Thiết Lập Database**:
    -   Thiết lập các Entity `Account`, `Role`, `AccountRole`, `Movie` tuân thủ `DATABASE.md`.
    -   Tạo `DataInitializer` để tự động thêm `USER` và `ADMIN` roles vào database khi khởi động.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`.
-   **Tài liệu API**: Cập nhật `PROJECT-ENTRYPOINT.md` với chi tiết các API endpoints mới.

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

### 3. **Tính Năng Account (`/api/v1/accounts`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho tài khoản.
-   **API Tạo tài khoản (`POST /api/v1/accounts`)**: Yêu cầu quyền `ADMIN`. Cho phép chỉ định danh sách roles.
-   **API Lấy danh sách Tài khoản (`GET /api/v1/accounts`)**: Yêu cầu quyền `ADMIN`. Bổ sung hiển thị roles trong DTO.
-   **API Lấy thông tin Tài khoản theo ID (`GET /api/v1/accounts/{id}`)**: Yêu cầu quyền `ADMIN`. Bổ sung hiển thị roles trong DTO.
-   **API Cập nhật Tài khoản (`PUT /api/v1/accounts/{id}`)**: Yêu cầu quyền `ADMIN`. Cho phép thay đổi thông tin cơ bản và gán lại danh sách roles.
-   **API Xóa Tài khoản (`DELETE /api/v1/accounts/{id}`)**: Yêu cầu quyền `ADMIN`.
-   Sử dụng `ReqCreateAccountDTO` và `ReqUpdateAccountDTO` để nhận dữ liệu, `ResAccountDTO` để trả về dữ liệu chuẩn.

### 4. **Tính Năng Movie (`/api/v1/movies`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho phim.
-   **API Tạo phim mới (`POST /api/v1/movies`)**: Yêu cầu quyền `ADMIN`.
-   **API Lấy danh sách phim (`GET /api/v1/movies`)**: Cho phép truy cập công khai.
-   **API Lấy thông tin phim theo ID (`GET /api/v1/movies/{id}`)**: Cho phép truy cập công khai.
-   **API Cập nhật phim (`PUT /api/v1/movies/{id}`)**: Yêu cầu quyền `ADMIN`.
-   **API Xóa phim (`DELETE /api/v1/movies/{id}`)**: Yêu cầu quyền `ADMIN`.
-   Sử dụng `ReqMovieDTO` để validate đầu vào khi tạo/cập nhật và `ResMovieDTO` để trả về thông tin phim.

### 5. **Tính Năng Role (`/api/v1/roles`)**
-   Hoàn thiện toàn bộ các chức năng CRUD cho role.
-   **API Tạo role mới (`POST /api/v1/roles`)**: Yêu cầu quyền `ADMIN`.
-   **API Lấy danh sách role (`GET /api/v1/roles`)**: Yêu cầu quyền `ADMIN`.
-   **API Lấy thông tin role theo ID (`GET /api/v1/roles/{id}`)**: Yêu cầu quyền `ADMIN`.
-   **API Cập nhật role (`PUT /api/v1/roles/{id}`)**: Yêu cầu quyền `ADMIN`.
-   **API Xóa role (`DELETE /api/v1/roles/{id}`)**: Yêu cầu quyền `ADMIN`.
-   Sử dụng `ReqRoleDTO` để validate đầu vào khi tạo/cập nhật và `ResRoleDTO` để trả về thông tin role.

### 6. **Bảo mật (Security)**
-   **Cấu hình Spring Security**:
    -   Tắt CSRF, thiết lập `SessionCreationPolicy.STATELESS` cho API.
    -   Cấu hình `PasswordEncoder` (BCrypt) và `DaoAuthenticationProvider` để đảm bảo cơ chế mã hóa mật khẩu nhất quán.
    -   Phân quyền các endpoint:
        -   `/api/v1/auth/**`: Mở cho tất cả mọi người.
        -   `GET /api/v1/movies/**`: Mở cho tất cả mọi người.
        -   `POST, PUT, DELETE /api/v1/movies/**`: Yêu cầu quyền `ADMIN`.
        -   `/api/v1/roles/**`: Yêu cầu quyền `ADMIN`.
        -   `/api/v1/accounts/**`: Yêu cầu quyền `ADMIN`.
        -   Các API khác: Yêu cầu đã xác thực.
-   **JSON Web Token (JWT)**:
    -   Đưa cấu hình `jwt.secret` và `jwt.expires-in` ra file `application.properties`.
    -   Cấu hình `JwtEncoder` và `JwtDecoder` sử dụng thuật toán `HmacSHA256`.
    -   Tạo `SecurityUtil` với phương thức `createToken()` để tạo JWT theo thời hạn cấu hình.
    -   Tích hợp `oauth2ResourceServer` để tự động xác thực token từ header `Authorization: Bearer ...`.
-   **`CustomUserDetailsService`**: Triển khai để lấy thông tin `UserDetails` (bao gồm cả roles) từ database, phục vụ cho quá trình xác thực của Spring Security.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Kiểm thử và Xử lý Lỗi]**
1.  **Xử lý lỗi `JwtEncodingException`**: Kiểm tra và khắc phục lỗi `Failed to select a JWK signing key`. Chắc chắn rằng `jwt.secret` trong `application.properties` được thiết lập đúng cách và có độ dài đủ lớn (ít nhất 256-bit).
2.  **Tạo tài khoản ADMIN**: Thêm logic vào `DataInitializer` hoặc tạo một API để tạo ra ít nhất một tài khoản có role `ADMIN` để có thể kiểm thử các API CRUD của Movie, Role và Account.

**[P1 - Ưu tiên trung bình: Mở rộng Feature]**
3.  **Tạo các Entity liên quan đến Movie**: Dựa theo `DATABASE.md`, tạo các entity `Director`, `MovieStatus`, `CastMember`, `Genre` và thiết lập các mối quan hệ (Many-to-Many, Many-to-One) với Entity `Movie`.
4.  **Hoàn thiện profile cá nhân**: Cho phép người dùng lấy thông tin của chính mình thay vì gọi qua API Account (do API đó đã bị restrict cho ADMIN).

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Lỗi `JwtEncodingException: Failed to select a JWK signing key` có thể vẫn xảy ra nếu giá trị `jwt.secret` trong `application.properties` chưa được thiết lập, quá ngắn, hoặc không được load đúng cách. Cần kiểm tra kỹ phần này.