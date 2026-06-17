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

### 5. **Thanh toán & Đặt vé (Payment & Booking Flow)**
-   **Tích hợp VNPay (Payment Gateway)**: Triển khai thành công VNPay vào hệ thống.
-   **Flow Đặt vé Frontend hoàn chỉnh**: `Trang chủ -> Chọn phim -> Chọn suất chiếu -> Chọn ghế -> Thanh toán VNPay -> Nhận vé (QR Code)`.
-   **Chống Double-Booking**: Sử dụng cơ chế Pessimistic Locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) trong cơ sở dữ liệu (`SeatRepository`) để đảm bảo không xảy ra tình trạng hai người dùng đặt cùng một ghế trong cùng một thời điểm.

### 6. **Triển khai & CI/CD (Deployment)**
-   **Vercel Deployment**: 
    -   Thêm `vercel.json` hỗ trợ SPA Routing cho Frontend.
    -   Sửa các lỗi build TypeScript nghiêm ngặt (Strict mode).
-   **CORS & Proxy Bypass**: 
    -   Cấu hình Spring Security CORS để cho phép các domain của Vercel gọi API.
    -   Tích hợp các headers bypass (`ngrok-skip-browser-warning`, pinggy bypass) vào `axiosClient.ts` để quá trình testing thông qua hầm ngrok/pinggy diễn ra trơn tru.

---

## 🎯 Nhiệm vụ tiếp theo (Next Tasks)

**[P0 - Ưu tiên cao: Trải nghiệm người dùng sau đặt vé]**
1.  **Hồ sơ & Lịch sử đặt vé (User Profile & Booking History)**: Xây dựng trang quản lý tài khoản cho người dùng để họ có thể xem lại lịch sử giao dịch và chi tiết các vé đã mua (kèm mã QR).
2.  **Gửi Email Xác nhận (Email Notification)**: Tích hợp dịch vụ gửi email (ví dụ: Spring Mail, SendGrid) để tự động gửi thông tin vé và mã QR cho khách hàng ngay sau khi thanh toán thành công.

**[P1 - Ưu tiên trung bình: Quản trị & Vận hành (Admin/Staff Ops)]**
3.  **Tích hợp QR Code & Quét vé (Ticket Validation)**: Tích hợp thư viện generate mã QR thực tế thay vì dùng Icon tĩnh, đồng thời xây dựng API cho nhân viên soát vé (Staff) quét mã QR để cập nhật trạng thái sử dụng của vé.
4.  **Hoàn thiện Logic `delete`**: Triển khai logic kiểm tra ràng buộc trước khi xóa các thực thể (Ví dụ: Không được xóa Loại ghế đang có người đặt).
5.  **Báo cáo & Thống kê**: Xây dựng biểu đồ doanh thu cho Admin Dashboard (dựa trên các Booking thành công) theo phim, rạp, và thời gian.

---

## ⚠️ Lưu ý / Rủi ro (Warnings)

-   Cần có cơ chế dọn dẹp hoặc lưu trữ các lịch chiếu đã qua để tránh làm database bị phình to theo thời gian.
-   Hệ thống QRCode nhận vé hiện tại ở Frontend sử dụng Icon placeholder. Cần cân nhắc tích hợp thư viện generate QR code thực tế (ví dụ: `qrcode.react`) trong tương lai nếu muốn tích hợp với máy quét.
