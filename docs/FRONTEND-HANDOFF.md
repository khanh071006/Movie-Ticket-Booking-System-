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
- **SuperAdmin**
  - `/superadmin` Dashboard (toàn hệ thống)
  - `/superadmin/accounts` Quản lý tài khoản
  - `/superadmin/cinemas` Quản lý rạp
  - `/superadmin/movies` Quản lý phim
  - `/superadmin/categories` Quản lý danh mục (đạo diễn/thể loại/trạng thái phim/diễn viên)
- **Manager (Quản lý Rạp)**
  - `/manager` Dashboard (của rạp)
  - `/manager/accounts` Quản lý tài khoản nhân viên
  - `/manager/rooms` Quản lý phòng chiếu
  - `/manager/showtimes` Quản lý lịch chiếu
  - `/manager/seat-types` Quản lý loại ghế
  - `/manager/ticket-types` Quản lý loại vé
  - `/manager/snacks` Quản lý đồ ăn
  - `/manager/movies` Xem danh sách phim
  - `/manager/scan-ticket` Soát vé
- **Staff (Nhân viên Rạp)**
  - `/staff` Dashboard (của rạp)
  - `/staff/scan-ticket` Soát vé
  - `/staff/movies` Xem danh sách phim
  - `/staff/rooms` Xem phòng chiếu
  - `/staff/showtimes` Xem lịch chiếu

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
- Role check từ JWT claim `scope` (`ROLE_SUPERADMIN`, `ROLE_MANAGER`, `ROLE_STAFF`) để mở route quản trị tương ứng thông qua các Guard.

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
- `SuperAdminGuard`, `ManagerGuard`, `StaffGuard`: chặn/mở route tuỳ theo Role.
- `GuestGuard`: Smart redirect về dashboard (`/superadmin`, `/manager`, `/staff`) nếu có quyền backoffice, ngược lại về `/` nếu đã login. Bỏ chặn vào trang `login/register`.
- **Kiểm soát giao diện theo Role (RBAC UI)**: Các component `ManagerLayout`, `StaffLayout` và các trang quản trị (Phòng, Lịch chiếu) sẽ tự động ẩn các form tạo mới, nút sửa/xoá hoặc menu không được phép nếu người dùng chỉ có quyền Staff. Public header cũng tự động hiện nút "Quản lý" và "Đặt vé" đúng ngữ cảnh.

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
