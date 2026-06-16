# API Entrypoints & Examples

> **Base URL**: `[YOUR_DOMAIN]` (e.g., `http://localhost:8080`)
> **Content-Type**: `application/json`

---

## 1. Feature: Authentication (`/api/v1/auth`)

### 1.1. Đăng ký tài khoản mới
-   **Endpoint**: `POST /api/v1/auth/register`
-   **Mô tả**: Tạo một tài khoản người dùng mới với role `USER` mặc định.
-   **Yêu cầu xác thực**: Không.
-   **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "your_strong_password",
        "fullName": "John Doe"
    }
    ```
-   **Response (201 Created)**:
    ```json
    {
        "statusCode": 201,
        "message": "Created successfully",
        "data": {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "email": "user@example.com",
            "fullName": "John Doe"
        }
    }
    ```

### 1.2. Đăng nhập
-   **Endpoint**: `POST /api/v1/auth/login`
-   **Mô tả**: Xác thực người dùng và trả về `accessToken` và `refreshToken`.
-   **Yêu cầu xác thực**: Không.
-   **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "your_strong_password"
    }
    ```
-   **Response (200 OK)**:
    ```json
    {
        "statusCode": 200,
        "message": "Success",
        "data": {
            "accessToken": "ey...",
            "refreshToken": "ey..."
        }
    }
    ```

---

## 2. Feature: Account (`/api/v1/accounts`)
-   **Mô tả**: Quản lý tài khoản người dùng. Yêu cầu quyền `ADMIN` cho tất cả endpoints.

### 2.1. Lấy danh sách tài khoản
-   **Endpoint**: `GET /api/v1/accounts`
-   **Response (200 OK)**:
    ```json
    {
        "statusCode": 200,
        "message": "Success",
        "data": [
            {
                "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                "email": "user@example.com",
                "fullName": "John Doe"
            }
        ]
    }
    ```

### 2.2. Lấy chi tiết tài khoản
-   **Endpoint**: `GET /api/v1/accounts/{id}`

### 2.3. Tạo tài khoản mới
-   **Endpoint**: `POST /api/v1/accounts`
-   **Request Body**: Tương tự `register`.

### 2.4. Cập nhật tài khoản
-   **Endpoint**: `PUT /api/v1/accounts/{id}`

### 2.5. Xóa tài khoản
-   **Endpoint**: `DELETE /api/v1/accounts/{id}`
-   **Response (200 OK)**:
    ```json
    {
        "statusCode": 200,
        "message": "Deleted successfully",
        "data": null
    }
    ```

---

## 3. Feature: Movie (`/api/v1/movies`)
-   **Mô tả**: Quản lý phim.

### 3.1. Lấy danh sách phim
-   **Endpoint**: `GET /api/v1/movies` (Công khai)

### 3.2. Thêm phim mới
-   **Endpoint**: `POST /api/v1/movies` (Role `ADMIN`)
-   **Request Body**:
    ```json
    {
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology...",
        "durationMinutes": 148,
        "releaseDate": "2010-07-16",
        "language": "English",
        "posterUrl": "http://example.com/poster.jpg",
        "trailerUrl": "http://example.com/trailer.mp4"
    }
    ```

---

## 4. Feature: Cinema (`/api/v1/cinemas`)
-   **Mô tả**: Quản lý rạp chiếu phim.

### 4.1. Lấy danh sách rạp
-   **Endpoint**: `GET /api/v1/cinemas` (Công khai)
-   **Response (200 OK)**:
    ```json
    {
        "statusCode": 200,
        "message": "Success",
        "data": [
            {
                "id": "c1c2c3c4-e5f6-7890-1234-567890abcdef",
                "name": "CGV Vincom Center",
                "address": "72 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TP. HCM"
            }
        ]
    }
    ```

### 4.2. Thêm rạp mới
-   **Endpoint**: `POST /api/v1/cinemas` (Role `ADMIN`)
-   **Request Body**:
    ```json
    {
        "name": "Lotte Cinema Cantavil",
        "address": "Tầng 7, Cantavil Premier, Xa lộ Hà Nội, P. An Phú, Quận 2, TP. HCM"
    }
    ```

---

## 5. Feature: Room (`/api/v1/rooms`)
-   **Mô tả**: Quản lý phòng chiếu.

### 5.1. Lấy danh sách phòng của một rạp
-   **Endpoint**: `GET /api/v1/rooms/cinema/{cinemaId}` (Công khai)

### 5.2. Thêm phòng mới
-   **Endpoint**: `POST /api/v1/rooms` (Role `ADMIN`)
-   **Request Body**:
    ```json
    {
        "name": "Phòng Gold Class",
        "cinemaId": "c1c2c3c4-e5f6-7890-1234-567890abcdef"
    }
    ```

---

## 6. Feature: Showtime (`/api/v1/showtimes`)
-   **Mô tả**: Quản lý lịch chiếu.

### 6.1. Lấy lịch chiếu theo phim và rạp
-   **Endpoint**: `GET /api/v1/showtimes/movie/{movieId}/cinema/{cinemaId}` (Công khai)

### 6.2. Tạo lịch chiếu mới
-   **Endpoint**: `POST /api/v1/showtimes` (Role `ADMIN`)
-   **Request Body**:
    ```json
    {
        "movieId": "m1m2m3m4-e5f6-7890-1234-567890abcdef",
        "roomId": "r1r2r3r4-e5f6-7890-1234-567890abcdef",
        "startTime": "2024-08-01T21:30:00"
    }
    ```

---

## 7. Feature: Categories (Danh mục)
-   **Mô tả**: Quản lý các danh mục phụ trợ. GET công khai, còn lại yêu cầu Role `ADMIN`.

### 7.1. Director (`/api/v1/directors`)
-   **Ví dụ `POST /api/v1/directors`**:
    -   **Request Body**: `{"name": "Christopher Nolan"}`
    -   **Response (201 Created)**:
        ```json
        {
            "statusCode": 201,
            "message": "Created successfully",
            "data": {
                "id": "d1d2d3d4-e5f6-7890-1234-567890abcdef",
                "name": "Christopher Nolan"
            }
        }
        ```

### 7.2. Genre (`/api/v1/genres`)
-   **Ví dụ `GET /api/v1/genres`**:
    -   **Response (200 OK)**:
        ```json
        {
            "statusCode": 200,
            "message": "Success",
            "data": [
                {"id": "g1...", "name": "Action"},
                {"id": "g2...", "name": "Sci-Fi"}
            ]
        }
        ```

### 7.3. Movie Status (`/api/v1/movie-statuses`)
-   **Ví dụ `POST /api/v1/movie-statuses`**:
    -   **Request Body**: `{"name": "Coming Soon"}`

### 7.4. Cast Member (`/api/v1/cast-members`)
-   **Ví dụ `POST /api/v1/cast-members`**:
    -   **Request Body**: `{"name": "Tom Hanks"}`

---

## 8. Feature: Seat & Ticket Categories (Danh mục Ghế & Vé)

### 8.1. Seat Type (`/api/v1/seat-types`)
-   **Mô tả**: Quản lý các loại ghế (ví dụ: "Normal", "VIP").
-   **Yêu cầu xác thực**: Role `ADMIN` cho tất cả endpoints.
-   **Endpoints**:
    -   `GET /api/v1/seat-types`: Lấy danh sách tất cả loại ghế.
    -   `POST /api/v1/seat-types`: Tạo một loại ghế mới.
    -   `PUT /api/v1/seat-types/{id}`: Cập nhật một loại ghế.
    -   `DELETE /api/v1/seat-types/{id}`: Xóa một loại ghế.
-   **Ví dụ `POST`**:
    -   **Request Body**: `{"name": "VIP"}`
    -   **Response (201 Created)**:
        ```json
        {
            "id": 1,
            "name": "VIP"
        }
        ```

### 8.2. Ticket Type (`/api/v1/ticket-types`)
-   **Mô tả**: Quản lý các loại vé và giá gốc (ví dụ: "Người lớn", "Trẻ em").
-   **Yêu cầu xác thực**: Role `ADMIN` cho tất cả endpoints.
-   **Endpoints**:
    -   `GET /api/v1/ticket-types`: Lấy danh sách tất cả loại vé.
    -   `POST /api/v1/ticket-types`: Tạo một loại vé mới.
    -   `PUT /api/v1/ticket-types/{id}`: Cập nhật một loại vé.
    -   `DELETE /api/v1/ticket-types/{id}`: Xóa một loại vé.
-   **Ví dụ `POST`**:
    -   **Request Body**: `{"name": "Adult", "basePrice": 10.00}`
    -   **Response (201 Created)**:
        ```json
        {
            "id": 1,
            "name": "Adult",
            "basePrice": 10.00
        }
        ```

---

## 9. Feature: Snack & Food (Đồ ăn thức uống)

### 9.1. Snack Type (`/api/v1/snack-types`)
-   **Mô tả**: Quản lý danh mục đồ ăn/thức uống.
-   **Yêu cầu xác thực**: GET công khai, POST/PUT/DELETE yêu cầu `ADMIN`.
-   **Ví dụ `POST`**:
    -   **Request Body**: `{"name": "Popcorn"}`

### 9.2. Snack (`/api/v1/snacks`)
-   **Mô tả**: Quản lý các mặt hàng đồ ăn và giá bán.
-   **Yêu cầu xác thực**: GET công khai, POST/PUT/DELETE yêu cầu `ADMIN`.
-   **Ví dụ `POST`**:
    -   **Request Body**: `{"snackTypeId": 1, "name": "Cheese Popcorn", "basePrice": 5.00}`
    -   **Response (201 Created)**:
        ```json
        {
            "id": 1,
            "snackTypeId": 1,
            "snackTypeName": "Popcorn",
            "name": "Cheese Popcorn",
            "basePrice": 5.00
        }
        ```

---

## 10. Feature: Seat Configuration (Cấu hình Ghế)


### 9.1. Lấy danh sách ghế của một phòng
-   **Endpoint**: `GET /api/v1/rooms/{roomId}/seats`
-   **Mô tả**: Lấy sơ đồ ghế của một phòng chiếu cụ thể.
-   **Yêu cầu xác thực**: Công khai.
-   **Response (200 OK)**:
    ```json
    [
        {
            "id": 101,
            "seatLocation": "A1",
            "seatTypeId": 1,
            "seatTypeName": "VIP",
            "roomId": 5
        },
        {
            "id": 102,
            "seatLocation": "A2",
            "seatTypeId": 2,
            "seatTypeName": "Normal",
            "roomId": 5
        }
    ]
    ```

### 9.2. Cấu hình ghế cho một phòng
-   **Endpoint**: `POST /api/v1/rooms/{roomId}/seats`
-   **Mô tả**: Tạo hàng loạt ghế cho một phòng chiếu. Thao tác này sẽ xóa tất cả ghế cũ (nếu có) và tạo lại từ đầu.
-   **Yêu cầu xác thực**: Role `ADMIN`.
-   **Request Body**:
    ```json
    [
        {
            "seatLocation": "A1",
            "seatTypeId": 1
        },
        {
            "seatLocation": "A2",
            "seatTypeId": 2
        }
    ]
    ```
-   **Response (201 Created)**: Trả về danh sách các ghế vừa được tạo.

---

## 11. Feature: Booking (Đặt vé)

### 11.1. Tạo một Booking mới
-   **Endpoint**: `POST /api/v1/bookings`
-   **Mô tả**: Tạo một giao dịch đặt vé mới cho một suất chiếu, hỗ trợ đặt kèm đồ ăn (`snackQuantities` là không bắt buộc).
-   **Yêu cầu xác thực**: `Bearer Token` (Role `USER` hoặc `ADMIN`).
-   **Request Body**:
    ```json
    {
        "showtimeId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "seatIds": [101, 102],
        "ticketQuantities": [
            {
                "ticketTypeId": 1,
                "quantity": 1
            },
            {
                "ticketTypeId": 2,
                "quantity": 1
            }
        ],
        "snackQuantities": [
            {
                "snackId": 1,
                "quantity": 1
            }
        ]
    }
    ```
-   **Response (201 Created)**:
    ```json
    {
        "id": "b1b2b3b4-e5f6-7890-1234-567890abcdef",
        "showtimeId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "movieTitle": "Inception",
        "bookingTime": "2024-08-02T10:30:00",
        "totalAmount": 25.00,
        "paymentStatus": "PENDING",
        "seatLocations": ["A1", "A2"],
        "tickets": ["1x Adult", "1x Child"],
        "snacks": ["1x Cheese Popcorn"]
    }
    ```
