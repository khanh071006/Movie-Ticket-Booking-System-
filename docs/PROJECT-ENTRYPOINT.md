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

### 2.1. Lấy danh sách tất cả tài khoản

-   **Endpoint**: `GET /api/v1/accounts`
-   **Mô tả**: Lấy danh sách tất cả các tài khoản trong hệ thống.
-   **Yêu cầu xác thực**: **Có**. Cần gửi `accessToken` trong header `Authorization`.
    -   **Header**: `Authorization: Bearer [your_access_token]`

#### Ví dụ Request:

Không có request body. Chỉ cần gửi request `GET` đến endpoint với header `Authorization`.

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
            "phone": "0987654321"
        },
        {
            "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
            "email": "admin@example.com",
            "fullName": "Quản Trị Viên",
            "phone": "0123456789"
        }
    ],
    "timestamp": "2023-10-27T10:10:00.000Z"
}
```

#### Ví dụ Response khi chưa xác thực (HTTP 401 Unauthorized):

```json
{
    "statusCode": 401,
    "message": "Full authentication is required to access this resource",
    "error": "Unauthorized",
    "details": null,
    "timestamp": "2023-10-27T10:11:00.000Z"
}
```
