# UI/UX Design System Specification - Movie App

Tài liệu này định nghĩa ngôn ngữ thiết kế chung cho toàn bộ dự án React. Hãy tuân thủ nghiêm ngặt các quy tắc này khi code UI.

## 1. Công nghệ (Tech Stack)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui hoặc MUI (Ưu tiên shadcn/ui để code gọn và dễ tùy biến)
- **Icons**: Lucide React
- **State Management**: React Context hoặc Zustand (cho Auth state)
- **Data Fetching**: Axios + React Query (TanStack Query)

## 2. Theme & Màu sắc (Cinematic Dark Theme)
- **Chủ đạo (Primary)**: #E50914 (Đỏ rực - tương tự Netflix, dùng cho Buttons, Active states)
- **Nền chính (Background)**: #0A0A0A (Đen sâu)
- **Nền phụ (Surface)**: #1A1A1A (Xám đậm cho Card, Dialog, Sidebar)
- **Văn bản (Text)**: 
  - Primary: #FFFFFF (Trắng)
  - Secondary: #A3A3A3 (Xám nhạt cho mô tả, subtitle)
- **Trạng thái**:
  - Success: #22C55E
  - Error: #EF4444
  - Warning: #F59E0B

## 3. Thành phần dùng chung (Global Components)

### 3.1. AppBar (Navigation Bar)
- **Cấu trúc**:
  - **Left**: Logo (Text: "MOVIE-APP" màu Primary) + Menu chính (Trang chủ, Phim).
  - **Center**: Thanh tìm kiếm (Search bar) bo tròn.
  - **Right**:
    - *Khách (Guest)*: Nút "Đăng nhập", "Đăng ký" (Outline & Solid style).
    - *Người dùng (User)*: Icon Thông báo + Avatar kèm Dropdown Menu (Profile, Lịch sử xem, Đăng xuất).
    - *Admin*: Thêm nút "Dashboard" nổi bật.
- **Hiệu ứng**: Blur background khi scroll (Glassmorphism - `backdrop-blur-md`).

### 3.2. Sidebar (Dành cho Admin Dashboard)
- **Vị trí**: Cố định bên trái.
- **Menu Items**:
  - Quản lý tài khoản (Icon: Users) -> trỏ về `/api/v1/accounts`
  - Quản lý phim (Icon: Film) -> trỏ về `/api/v1/movies`
  - Thống kê (Icon: LayoutDashboard)
- **Trạng thái**: Có nút thu gọn (Collapse).

### 3.3. Card Phim (Movie Card)
- **Thiết kế**: Aspect ratio 2/3 (chuẩn poster phim).
- **Hover**: Phóng to nhẹ (Scale 1.05), hiển thị nút "Xem chi tiết" và Trailer ngắn (nếu có).
- **Thông tin**: Title, Năm phát hành, Thời lượng.

## 4. Cấu trúc Layout (Layout Templates)
1. **PublicLayout**: AppBar + Main Content + Footer (Dành cho Home, Movie Detail).
2. **AuthLayout**: Nền ảnh mờ (Cinema background) + Card Login/Register ở giữa.
3. **AdminLayout**: Sidebar bên trái + TopBar (Breadcrumbs + Profile) + Main Content bên phải.

## 5. Xử lý API & Authentication
- **Token**: Lưu `accessToken` vào `localStorage`.
- **Interceptors**: Tự động đính kèm `Authorization: Bearer <token>` vào Header cho các request yêu cầu xác thực.
- **Error Handling**: Hiển thị Toast Message (Sonner hoặc React-Toastify) dựa trên `message` trả về từ API (ví dụ: "Email đã tồn tại", "Sai mật khẩu").

## 6. Các quy tắc Code chung
- Sử dụng **TypeScript** cho các Interface dữ liệu (Movie, Account, AuthResponse).
- Form validation sử dụng **React Hook Form** + **Zod**.
- Đảm bảo **Responsive** hoàn toàn trên Mobile và Desktop.