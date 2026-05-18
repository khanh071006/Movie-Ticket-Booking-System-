# Frontend Handoff - UI hiện tại & cách nối API

## 1) Tình trạng UI hiện tại

Frontend đang chạy theo kiến trúc **React + Vite + React Router**, đã có đủ luồng chính:

- **Public**
  - `/` Trang chủ
  - `/movies` Danh mục phim
  - `/movies/:id` Chi tiết phim + lịch chiếu theo rạp
- **Auth**
  - `/login` Đăng nhập
  - `/register` Đăng ký
- **Admin**
  - `/admin` Dashboard
  - `/admin/accounts` Quản lý tài khoản
  - `/admin/movies` Quản lý phim
  - `/admin/cinemas` Quản lý rạp
  - `/admin/rooms` Quản lý phòng chiếu
  - `/admin/showtimes` Quản lý lịch chiếu
  - `/admin/categories` Quản lý danh mục (đạo diễn/thể loại/trạng thái phim/diễn viên)

## 2) Cấu trúc frontend (thực tế đang dùng)

```text
frontend/
├─ src/
│  ├─ main.tsx                  # Entry chính, mount RouterProvider
│  ├─ routes/
│  │  └─ router.tsx             # Route map toàn app
│  ├─ pages/
│  │  ├─ public/                # Home, Movies, MovieDetail
│  │  ├─ auth/                  # Login, Register
│  │  ├─ admin/                 # Dashboard + các màn quản trị
│  │  └─ error/                 # 403, 404
│  ├─ components/
│  │  ├─ PublicLayout.tsx
│  │  ├─ AdminLayout.tsx
│  │  ├─ AuthLayout.tsx
│  │  └─ ui/                    # Button, Input, Card
│  ├─ api/
│  │  ├─ axiosClient.ts         # API client trung tâm (đang dùng)
│  │  ├─ authApi.ts
│  │  └─ movieApi.ts
│  ├─ guards/                   # GuestGuard, AdminGuard
│  ├─ features/auth/utils/
│  │  └─ session.ts             # Lưu token/user/account + role parsing
│  └─ types/
│     └─ app.ts                 # Type chung cho auth/movie/cinema/...
+├─ package.json
└─ ...
```

## 3) Cách FE link đến API hiện tại

### 3.1 Base URL

Trong `src/api/axiosClient.ts`:

- `baseURL = ${VITE_API_BASE_URL || "http://localhost:8080"}/api/v1`
- FE gọi backend qua các path tương đối (`/movies`, `/auth/login`, ...)

Ví dụ cấu hình `.env` trong `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3.2 Auth & token

- Token lấy từ login và lưu localStorage (`accessToken`) tại `features/auth/utils/session.ts`
- Các endpoint admin dùng `Authorization: Bearer <token>` (qua `authHeader()` trong `axiosClient.ts`)
- Role admin check từ JWT claim `scope` (`ROLE_ADMIN`/`ADMIN`) để mở route admin

### 3.3 Kiểu response backend đã xử lý

`axiosClient.ts` có `unwrap()` để xử lý cả 2 kiểu response:

1. **Chuẩn `ApiResponse<T>`** (có `data`)
2. **DTO trả thẳng** (không có wrapper `data`)

Nên FE đang tương thích với các nhóm API hiện có của backend.

### 3.4 Mapping API chính trong FE

- `auth`: `/auth/login`, `/auth/register`
- `accounts`: `/accounts` CRUD
- `movies`: `/movies` CRUD + detail
- `cinemas`: `/cinemas` CRUD
- `rooms`: `/rooms/cinema/{cinemaId}`, `/rooms` CRUD
- `showtimes`: `/showtimes/movie/{movieId}`, `/showtimes/movie/{movieId}/cinema/{cinemaId}`, tạo/xóa suất chiếu
- `categories`:
  - `/directors`
  - `/genres`
  - `/movie-statuses`
  - `/cast-members`

## 4) Guard, layout và entrypoint cần nhớ

- Entry chính: `src/main.tsx` -> dùng `router` từ `src/routes/router.tsx`
- `AdminGuard`: chặn vào `/admin` nếu không có quyền admin
- `GuestGuard`: nếu đã login thì không cho vào trang login/register

> Lưu ý: `src/App.tsx` hiện là file cũ, **không phải entrypoint runtime** (không dùng trong `main.tsx`).

## 5) Trạng thái để dev tiếp tục

- UI đã được chỉnh theo hướng user-facing (copywriting cho người dùng cuối)
- Các màn admin/public chính đã chạy được và đã nối API
- Dashboard đã có:
  - card tổng quan
  - block “Đơn đặt hàng gần đây”
  - block “Suất chiếu sắp đến”

Nếu tiếp tục phát triển, ưu tiên:

1. Nối dữ liệu đơn hàng thật (khi backend mở API booking/order)
2. Thêm phân trang/filter nâng cao cho các bảng admin
3. Chuẩn hóa i18n nếu muốn song ngữ
