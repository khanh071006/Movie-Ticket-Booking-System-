# API Entrypoints & Examples

> **Base URL**: `[YOUR_DOMAIN]` (e.g., `http://localhost:8080`)
> **Content-Type**: `application/json`

Tài liệu này cung cấp danh sách các điểm cuối (entrypoint) API và ví dụ về request/response để đội ngũ Frontend có thể tích hợp.

---

## 1. Feature: Authentication (`/api/v1/auth`)

### 1.1. Đăng ký tài khoản mới

-   **Endpoint**: `POST /api/v1/auth/register`
-   **Mô tả**: Dùng để tạo một tài khoản người dùng mới.
-   **Yêu cầu xác thực**: Không.

#### Ví dụ Request Body:

```json
{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654321"
}
```

#### Ví dụ Response thành công (HTTP 201 Created):

```json
{
    "statusCode": 201,
    "message": "Đăng ký tài khoản thành công",
    "data": {
        "token": null,
        "account": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "user@example.com",
            "fullName": "Nguyễn Văn A"
        }
    },
    "timestamp": "2023-10-27T10:00:00.000Z"
}
```

#### Ví dụ Response khi Email đã tồn tại (HTTP 409 Conflict):

```json
{
    "statusCode": 409,
    "message": "Email 'user@example.com' đã tồn tại.",
    "error": "Conflict",
    "details": null,
    "timestamp": "2023-10-27T10:01:00.000Z"
}
```

---

### 1.2. Đăng nhập

-   **Endpoint**: `POST /api/v1/auth/login`
-   **Mô tả**: Xác thực người dùng và trả về một JSON Web Token (JWT).
-   **Yêu cầu xác thực**: Không.

#### Ví dụ Request Body:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### Ví dụ Response thành công (HTTP 200 OK):

```json
{
    "statusCode": 200,
    "message": "Đăng nhập thành công",
    "data": {
        "token": {
            "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwic2NvcGUiOiJST0xFX1VTRVIiLCJpc3MiOiJzZWxmIiwiaWF0IjoxNjc5OTk5OTk5LCJleHAiOjE2ODAwMDA4OTl9.abcdef...",
            "tokenType": "Bearer",
            "expiresIn": 900
        },
        "account": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "user@example.com",
            "fullName": "Nguyễn Văn A"
        }
    },
    "timestamp": "2023-10-27T10:05:00.000Z"
}
```

#### Ví dụ Response khi sai thông tin (HTTP 401 Unauthorized):

```json
{
    "statusCode": 401,
    "message": "Bad credentials",
    "error": "Unauthorized",
    "details": null,
    "timestamp": "2023-10-27T10:06:00.000Z"
}
```

---

## 2. Feature: Account (`/api/v1/accounts`)

Tất cả các API dưới đây đều yêu cầu quyền `ADMIN`.

### 2.1. Lấy danh sách tất cả tài khoản

-   **Endpoint**: `GET /api/v1/accounts`
-   **Mô tả**: Lấy danh sách tất cả các tài khoản trong hệ thống.
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

#### Ví dụ Response thành công (HTTP 200 OK):

```json
{
    "statusCode": 200,
    "message": "Lấy danh sách tài khoản thành công",
    "data": [
        {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "user@example.com",
            "fullName": "Nguyễn Văn A",
            "phone": "0987654321",
            "roles": ["USER"]
        }
    ],
    "timestamp": "2023-10-27T10:10:00.000Z"
}
```

### 2.2. Tạo tài khoản mới (Admin)

-   **Endpoint**: `POST /api/v1/accounts`
-   **Mô tả**: Tạo tài khoản, cho phép gán role.
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

#### Ví dụ Request Body:

```json
{
    "email": "staff@example.com",
    "password": "password123",
    "fullName": "Nhân viên 1",
    "phone": "0987654321",
    "roles": ["STAFF"]
}
```

### 2.3. Cập nhật tài khoản

-   **Endpoint**: `PUT /api/v1/accounts/{id}`
-   **Mô tả**: Cập nhật thông tin cơ bản và gán lại quyền.
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

#### Ví dụ Request Body:

```json
{
    "fullName": "Nhân viên 1 Cập nhật",
    "phone": "0987654321",
    "roles": ["STAFF", "ADMIN"]
}
```

### 2.4. Xóa tài khoản

-   **Endpoint**: `DELETE /api/v1/accounts/{id}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

---

## 3. Feature: Movie (`/api/v1/movies`)

### 3.1. Lấy danh sách phim

-   **Endpoint**: `GET /api/v1/movies`
-   **Mô tả**: Lấy danh sách tất cả các phim.
-   **Yêu cầu xác thực**: Không.

#### Ví dụ Response thành công (HTTP 200 OK):

```json
{
    "statusCode": 200,
    "message": "Lấy danh sách phim thành công",
    "data": [
        {
            "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
            "title": "Avengers: Endgame",
            "description": "Siêu anh hùng tập hợp...",
            "durationMinutes": 181,
            "releaseDate": "2019-04-26",
            "language": "Tiếng Anh",
            "posterUrl": "https://example.com/poster.jpg",
            "trailerUrl": "https://example.com/trailer.mp4"
        }
    ],
    "timestamp": "2023-10-27T10:15:00.000Z"
}
```

### 3.2. Lấy thông tin chi tiết phim

-   **Endpoint**: `GET /api/v1/movies/{id}`
-   **Mô tả**: Lấy thông tin chi tiết của một bộ phim theo ID.
-   **Yêu cầu xác thực**: Không.

### 3.3. Thêm phim mới (Admin)

-   **Endpoint**: `POST /api/v1/movies`
-   **Mô tả**: Thêm một bộ phim mới vào hệ thống.
-   **Yêu cầu xác thực**: **Có**, yêu cầu role `ADMIN`.

#### Ví dụ Request Body:

```json
{
    "title": "Avengers: Endgame",
    "description": "Siêu anh hùng tập hợp...",
    "durationMinutes": 181,
    "releaseDate": "2019-04-26",
    "language": "Tiếng Anh",
    "posterUrl": "https://example.com/poster.jpg",
    "trailerUrl": "https://example.com/trailer.mp4"
}
```

### 3.4. Cập nhật thông tin phim (Admin)

-   **Endpoint**: `PUT /api/v1/movies/{id}`
-   **Mô tả**: Cập nhật thông tin của một bộ phim theo ID.
-   **Yêu cầu xác thực**: **Có**, yêu cầu role `ADMIN`.

### 3.5. Xóa phim (Admin)

-   **Endpoint**: `DELETE /api/v1/movies/{id}`
-   **Mô tả**: Xóa một bộ phim khỏi hệ thống theo ID.
-   **Yêu cầu xác thực**: **Có**, yêu cầu role `ADMIN`.
