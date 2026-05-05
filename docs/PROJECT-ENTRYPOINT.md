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

### 1.2. Đăng nhập
-   **Endpoint**: `POST /api/v1/auth/login`
-   **Mô tả**: Xác thực người dùng và trả về một JSON Web Token (JWT).
-   **Yêu cầu xác thực**: Không.

---

## 2. Feature: Account (`/api/v1/accounts`)
-   **Mô tả**: Quản lý tài khoản người dùng.
-   **Yêu cầu xác thực**: **Có** (Tất cả các endpoint đều yêu cầu role `ADMIN`).
-   **Endpoints**:
    -   `GET /api/v1/accounts`: Lấy danh sách tất cả tài khoản.
    -   `GET /api/v1/accounts/{id}`: Lấy thông tin chi tiết một tài khoản.
    -   `POST /api/v1/accounts`: Tạo tài khoản mới.
    -   `PUT /api/v1/accounts/{id}`: Cập nhật tài khoản.
    -   `DELETE /api/v1/accounts/{id}`: Xóa tài khoản.

---

## 3. Feature: Movie (`/api/v1/movies`)
-   **Mô tả**: Quản lý thông tin phim.
-   **Endpoints**:
    -   `GET /api/v1/movies`: Lấy danh sách phim (Công khai).
    -   `GET /api/v1/movies/{id}`: Lấy chi tiết phim (Công khai).
    -   `POST /api/v1/movies`: Thêm phim mới (Role `ADMIN`).
    -   `PUT /api/v1/movies/{id}`: Cập nhật phim (Role `ADMIN`).
    -   `DELETE /api/v1/movies/{id}`: Xóa phim (Role `ADMIN`).

---

## 4. Feature: Cinema (`/api/v1/cinemas`)
-   **Mô tả**: Quản lý thông tin rạp chiếu phim.

### 4.1. Lấy danh sách tất cả rạp
-   **Endpoint**: `GET /api/v1/cinemas`
-   **Yêu cầu xác thực**: Không (Công khai).
-   **Ví dụ Response (200 OK)**:
    ```json
    [
        {
            "id": "uuid-cinema-1",
            "name": "CGV Vincom Center",
            "address": "72 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TP. HCM"
        }
    ]
    ```

### 4.2. Lấy thông tin chi tiết rạp
-   **Endpoint**: `GET /api/v1/cinemas/{id}`
-   **Yêu cầu xác thực**: Không (Công khai).

### 4.3. Thêm rạp mới (Admin)
-   **Endpoint**: `POST /api/v1/cinemas`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).
-   **Request Body**:
    ```json
    {
        "name": "Lotte Cinema Cantavil",
        "address": "Tầng 7, Cantavil Premier, Xa lộ Hà Nội, P. An Phú, Quận 2, TP. HCM"
    }
    ```

### 4.4. Cập nhật rạp (Admin)
-   **Endpoint**: `PUT /api/v1/cinemas/{id}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

### 4.5. Xóa rạp (Admin)
-   **Endpoint**: `DELETE /api/v1/cinemas/{id}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

---

## 5. Feature: Room (`/api/v1/rooms`)
-   **Mô tả**: Quản lý thông tin phòng chiếu trong một rạp.

### 5.1. Lấy danh sách phòng của một rạp
-   **Endpoint**: `GET /api/v1/rooms/cinema/{cinemaId}`
-   **Yêu cầu xác thực**: Không (Công khai).
-   **Ví dụ Response (200 OK)**:
    ```json
    [
        {
            "id": "uuid-room-1",
            "name": "Phòng 1",
            "cinemaId": "uuid-cinema-1"
        },
        {
            "id": "uuid-room-2",
            "name": "Phòng IMAX",
            "cinemaId": "uuid-cinema-1"
        }
    ]
    ```

### 5.2. Thêm phòng mới (Admin)
-   **Endpoint**: `POST /api/v1/rooms`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).
-   **Request Body**:
    ```json
    {
        "name": "Phòng Gold Class",
        "cinemaId": "uuid-cinema-1"
    }
    ```

### 5.3. Cập nhật phòng (Admin)
-   **Endpoint**: `PUT /api/v1/rooms/{roomId}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

### 5.4. Xóa phòng (Admin)
-   **Endpoint**: `DELETE /api/v1/rooms/{roomId}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).

---

## 6. Feature: Showtime (`/api/v1/showtimes`)
-   **Mô tả**: Quản lý và tra cứu lịch chiếu phim.

### 6.1. Lấy lịch chiếu theo phim và rạp
-   **Endpoint**: `GET /api/v1/showtimes/movie/{movieId}/cinema/{cinemaId}`
-   **Yêu cầu xác thực**: Không (Công khai).
-   **Mô tả**: API quan trọng cho người dùng, dùng để xem một phim cụ thể có những suất chiếu nào tại một rạp đã chọn.
-   **Ví dụ Response (200 OK)**:
    ```json
    [
        {
            "id": "uuid-showtime-1",
            "startTime": "2024-08-01T19:00:00",
            "endTime": "2024-08-01T21:15:00",
            "movie": {
                "id": "uuid-movie-avengers",
                "title": "Avengers: Endgame",
                "durationMinutes": 181
            },
            "room": {
                "id": "uuid-room-1",
                "name": "Phòng 1",
                "cinema": {
                    "id": "uuid-cinema-1",
                    "name": "CGV Vincom Center"
                }
            }
        }
    ]
    ```

### 6.2. Lấy tất cả lịch chiếu của một phim
-   **Endpoint**: `GET /api/v1/showtimes/movie/{movieId}`
-   **Yêu cầu xác thực**: Không (Công khai).
-   **Mô tả**: Dùng để xem một phim đang được chiếu ở những đâu trên toàn hệ thống.

### 6.3. Tạo lịch chiếu mới (Admin)
-   **Endpoint**: `POST /api/v1/showtimes`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).
-   **Request Body**:
    ```json
    {
        "movieId": "uuid-movie-avengers",
        "roomId": "uuid-room-1",
        "startTime": "2024-08-01T21:30:00"
    }
    ```

### 6.4. Xóa lịch chiếu (Admin)
-   **Endpoint**: `DELETE /api/v1/showtimes/{showtimeId}`
-   **Yêu cầu xác thực**: **Có** (Role `ADMIN`).
