# Project Status

> **Dự án**: Movie Ticket Booking System
> **Cập nhật lần cuối**: [Đã cập nhật sau đợt đại tu UX]
> **Trạng thái hiện tại**: Đã hoàn thiện lõi tính năng Booking và phân quyền chi tiết cho toàn bộ hệ thống.

---

## ✅ Đã hoàn thành (Completed)

### 1. **Kiến trúc & Nền tảng**
-   **Tái Cấu Trúc (Refactoring)**: Chuyển đổi toàn bộ cấu trúc dự án từ Layered sang **Feature-Based Architecture**.
-   **Thiết Lập Database**:
    -   Thiết lập các Entity `Account`, `Role`, `Movie`, `Cinema`, `Room`, `Showtime`.
    -   Tách các Entity `Director`, `MovieStatus`, `CastMember`, `Genre` ra các feature package riêng biệt.
-   **Mô hình hóa quan hệ N-N**:
    -   **Refactor**: Chuyển đổi cách xử lý mối quan hệ Nhiều-Nhiều (ví dụ: `Movie` và `Genre`) bằng cách biến bảng trung gian thành một Entity đầy đủ (`MovieGenre`) có khóa chính riêng.
-   **Quy Tắc Code**: Xây dựng và tuân thủ các quy tắc trong `PROJECT-RULES.md`.
-   **Tài liệu API**: Cập nhật `PROJECT-ENTRYPOINT.md` với chi tiết các API endpoints mới.

### 2. **Tính Năng Lõi Booking (Booking Core)**
-   **Chuẩn hóa theo `DB.md`**:
    -   **Refactor `Cinema` & `Room`**: Đã chuyển đổi kiểu khóa chính của `Cinema` và `Room` từ `UUID` sang `Integer` với `GenerationType.IDENTITY` để tuân thủ `DB.md`. Đổi tên bảng của `Room` thành `theatres` trong mã nguồn để đồng bộ.
-   **Triển khai tính năng Ghế (Seat)**:
    -   **Feature `SeatType`**: Hoàn thiện CRUD API (`/api/v1/seat-types`) cho phép `ADMIN` quản lý các loại ghế (ví dụ: "Normal", "VIP").
    -   **Cấu trúc lại `Seat`**: Cập nhật Entity `Seat` để sử dụng `id (INT)` và có quan hệ `ManyToOne` đến `SeatType` và `Room`.
    -   **API Cấu hình Ghế**: Cung cấp API `POST /api/v1/rooms/{roomId}/seats` cho phép `ADMIN` tạo hàng loạt ghế cho một phòng chiếu.
-   **Xây dựng nền tảng Đặt vé (Booking)**:
    -   **Feature `TicketType`**: Hoàn thiện CRUD API (`/api/v1/ticket-types`) cho phép `ADMIN` quản lý các loại vé.
    -   **Feature Đồ ăn (Snacks)**: Đã triển khai hoàn tất `SnackType`, `Snack` và API mua đồ ăn đi kèm hóa đơn qua `BookingSnack`.
    -   **Feature `State`**: Cập nhật quan hệ `State` cho `Cinema` để theo dõi trạng thái hoạt động của rạp.
    -   **Thiết kế Entities**: Tạo các entity `Booking`, `BookingSeat`, `BookingTicket`, `BookingSnack` theo đúng thiết kế trong `DB.md`, sử dụng `CascadeType.ALL` để quản lý vòng đời.
    -   **API Đặt vé**: Triển khai API `POST /api/v1/bookings` cho phép người dùng đặt vé, mua kèm đồ ăn (`snackQuantities`), Backend sẽ tự động tính toán tổng hóa đơn `totalAmount` chính xác.

### 3. **Bảo mật (Security)**
-   **Cấu hình Spring Security**: Tắt CSRF, `STATELESS`, cấu hình `PasswordEncoder`, `DaoAuthenticationProvider`.
-   **JSON Web Token (JWT)**: Cấu hình `JwtEncoder`, `JwtDecoder`, tích hợp `oauth2ResourceServer`.
-   **`CustomUserDetailsService` & `UserPrincipal`**: Triển khai để lấy thông tin `UserDetails` tùy chỉnh (bao gồm `accountId`) từ database, giúp tầng service có thể truy cập định danh người dùng một cách an toàn.
-   **Phân quyền (Authorization)**: Bổ sung các quy tắc phân quyền chi tiết trong `SecurityConfig` cho toàn bộ các API mới và cũ:
    -   Các API danh mục (`SeatType`, `TicketType`) và các API cấu hình (`tạo phòng`, `tạo ghế`, `tạo phim`...) yêu cầu quyền `ADMIN`.
    -   Các API đọc dữ liệu công khai (`xem phim`, `xem lịch chiếu`...) được `permitAll`.
    -   API đặt vé (`/bookings`) yêu cầu người dùng phải `authenticated`.

### 4. **Các tính năng Fullstack mới hoàn thiện**
-   **Đồng bộ hoá Trải nghiệm Người Dùng (Premium UX)**:
    -   Hoàn thiện toàn bộ hệ thống UI cho Frontend với phong cách thiết kế cao cấp (Glassmorphism, Dark Theme, Glow effects).
    -   Xây dựng hệ thống Banner Carousel phim tương tác mượt mà ở Trang chủ.
    -   Thiết kế lại luồng Đặt vé (Booking Flow): `Trang chủ -> Danh sách Phim -> Lịch Chiếu -> Rạp Chiếu` được đồng bộ 100% về giao diện và UX.
    -   Tối ưu hóa **Lọc Khu Vực (City Filter)**: Áp dụng Dropdown Glassmorphism thông minh, giải quyết triệt để vấn đề tràn màn hình khi hệ thống có đủ 63 tỉnh/thành phố.
-   **Tự động tạo Dữ liệu (Data Seeding)**:
    -   Xây dựng script Python (`seed_data.py`) tự động khởi tạo hệ thống dữ liệu thực tế: toàn bộ 63 tỉnh/thành, 195 hệ thống rạp, và hơn 8,100 suất chiếu trên toàn quốc.
-   **Tính năng Ghế Đôi (Couple Seats/Sweetbox)**:
    -   Thêm thuộc tính `seatCount` vào bảng `SeatType`.
    -   Cập nhật thuật toán tính toán sơ đồ ghế (Frontend) để hỗ trợ gộp 2 ô cho ghế đôi (chiếm dụng 2 slot trên lưới không gian) và tự động tính tiền vé dựa trên sức chứa của ghế.
    -   Sửa lỗi dọn dẹp Database (xoá ghế cũ trước khi tạo sơ đồ mới) cho phòng chiếu bằng `@Transactional`.
-   **Cấu hình Giá vé & Phụ thu (Cinema Pricing)**:
    -   Xây dựng UI cấu hình giá vé riêng và phụ thu ghế ngồi cho từng rạp chiếu.
    -   Tích hợp tính toán tự động trên giao diện đặt vé.
-   **Quản lý Bắp nước (Snacks)**:
    -   Hoàn thiện toàn bộ hệ thống CRUD Bắp nước, loại bắp nước trên Admin.
    -   Tích hợp chọn bắp nước và cộng tiền hóa đơn ở bước Booking.
-   **Cập nhật các thông tin mở rộng**: Bổ sung URL hình ảnh cho Diễn viên, Đạo diễn.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Thanh toán & Đặt vé Frontend]**
1.  **Tích hợp Cổng thanh toán (Payment Gateway)**: Tích hợp VNPay, Momo hoặc Stripe để hoàn tất quy trình booking. Hiện tại Booking mới lưu vào DB mà chưa qua bước thanh toán thực tế.
2.  **Flow Đặt vé Frontend**:
    -   Hoàn thiện luồng User: Trang chủ -> Chọn phim -> Chọn suất chiếu -> Chọn ghế (đã làm) -> Thanh toán -> Nhận vé (QR Code).
3.  **Chống Double-Booking**: Bổ sung logic trong `BookingServiceImpl` và locking cơ sở dữ liệu để chống tình trạng 2 người cùng chọn 1 ghế trong cùng 1 thời điểm.

**[P1 - Ưu tiên trung bình: Cải thiện hệ thống]**
4.  **Hoàn thiện Logic `delete`**: Triển khai logic kiểm tra ràng buộc trước khi xóa các thực thể (Ví dụ: Không được xóa Loại ghế đang có người đặt).
5.  **Báo cáo & Thống kê**: Xây dựng biểu đồ doanh thu cho Admin Dashboard (dựa trên các Booking thành công).

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Cần có cơ chế dọn dẹp hoặc lưu trữ các lịch chiếu đã qua để tránh làm database bị phình to theo thời gian.
-   Vấn đề Concurrency khi booking (Double-booking) cần được xử lý sớm trước khi Go-live.
