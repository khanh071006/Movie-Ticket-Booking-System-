# Quy Tắc và Quy Ước Code của Dự Án

> Tài liệu này mô tả các quy tắc và quy ước code cho dự án "Movie Ticket Booking System". Việc tuân thủ các quy tắc này đảm bảo tính nhất quán, dễ đọc và dễ bảo trì của codebase.

---

## 1. Cấu Trúc Dự Án & Đặt Tên

- **Tổ Chức Package**: Code được tổ chức theo từng tầng (layer) chức năng: `controller`, `service`, `repository`, `domain`, `security`, `config`, `exception`.
- **Đặt Tên Class**:
    - **Controllers**: Hậu tố là `Controller` (ví dụ: `UserController`).
    - **Services**: Sử dụng một interface (ví dụ: `AccountService`) và một class triển khai có hậu tố là `Impl` (ví dụ: `AccountServiceImpl`).
    - **Repositories**: Hậu tố là `Repository` (ví dụ: `AccountRepository`).
    - **Entities**: Sử dụng danh từ số ít, thể hiện khái niệm trong miền nghiệp vụ (ví dụ: `Account`, `Role`).
    - **DTOs**: Hậu tố là `DTO`. Tiền tố là `Req` cho request và `Res` cho response (ví dụ: `ReqRegisterDTO`, `ResAuthDTO`).
- **Đặt Tên Phương Thức**:
    - **Service Methods**: Tiền tố là `handle` (ví dụ: `handleRegister`, `handleGetUsers`).
    - **Repository Methods**: Tuân thủ quy ước tạo query của Spring Data JPA (ví dụ: `findByName`, `existsByEmail`).

## 2. Thiết Kế API (Tầng Controller)

- **Phiên Bản API (Versioning)**: Tất cả các endpoint API phải có tiền tố là `/api/v1/`.
- **Đặt Tên RESTful**: Sử dụng danh từ số nhiều, viết thường cho đường dẫn tài nguyên (ví dụ: `/api/v1/users`, `/api/v1/movies`).
- **Wrapper Response Chuẩn**: Tất cả các response API phải được bọc trong `ResponseEntity<ApiResponse<T>>`.
- **Sử Dụng `ApiResponse`**: Sử dụng các phương thức static helper từ class `ApiResponse` để tạo response thành công và lỗi một cách nhất quán (ví dụ: `ApiResponse.success(...)`, `ApiResponse.created(...)`, `ApiResponse.notFound(...)`).
- **Dependency Injection**: Luôn sử dụng **constructor injection** để cung cấp các dependency.
- **Xử Lý Request**:
    - Sử dụng `@RestController` cho tất cả các controller.
    - Sử dụng `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` để xử lý các phương thức HTTP.
- **Validation**: Sử dụng `@Valid` trên các đối tượng `@RequestBody` để kích hoạt bean validation.

## 3. Tầng Service

- **Dựa trên Interface**: Các service phải được định nghĩa bởi một interface để thúc đẩy sự khớp nối lỏng (loose coupling).
- **Quản Lý Giao Dịch (Transaction)**: Sử dụng `@Transactional` từ `jakarta.transaction` trên các phương thức service thực hiện các thao tác ghi (create, update, delete) để đảm bảo tính toàn vẹn dữ liệu.
- **Xử Lý Lỗi**: Ném (throw) các exception tùy chỉnh, cụ thể cho các trường hợp lỗi đã biết (ví dụ: `DuplicateResourceException`, `ResourceNotFoundException`). Không xử lý exception bằng các khối `try-catch` chung chung ở tầng service; hãy để chúng lan truyền đến global exception handler.

## 4. Truy Cập Dữ Liệu (Tầng Repository & Domain)

- **Repositories**:
    - Tất cả các repository phải kế thừa từ `JpaRepository`.
    - Sử dụng annotation `@Repository`.
- **Entities**:
    - Tất cả các entity của database phải được đánh dấu bằng annotation `@Entity`.
    - **Đặt Tên Bảng (Table)**: Sử dụng danh từ số nhiều, theo quy tắc snake_case (ví dụ: `@Table(name = "accounts")`).
    - **Đặt Tên Cột (Column)**: Sử dụng quy tắc snake_case cho tên các cột trong database (ví dụ: `@Column(name = "password_hash")`).
    - **Khóa Chính (Primary Keys)**: Sử dụng `UUID` cho khóa chính của các entity chính như `Account`. Sử dụng `Integer` hoặc `Long` cho các entity đơn giản hơn như `Role`.

## 5. Bảo Mật (Security)

- **Mã Hóa Mật Khẩu**: Luôn sử dụng bean `PasswordEncoder` đã được inject để mã hóa mật khẩu trước khi lưu.
- **Cấu Hình**: Tất cả các định nghĩa bean liên quan đến bảo mật và cấu hình filter chain được tập trung tại `SecurityConfig.java`.
- **Phân Quyền**: Định nghĩa các quy tắc phân quyền cho từng endpoint cụ thể trong bean `SecurityFilterChain`.

## 6. Phong Cách Code & Quy Tắc Chung

- **Bình Luận (Comments)**: Viết các bình luận rõ ràng, súc tích để giải thích logic phức tạp hoặc các quyết định quan trọng. Sử dụng tiếng Việt cho các bình luận khi nó giúp tăng cường sự rõ ràng cho đội ngũ.
- **Định Dạng Code**: Duy trì định dạng code nhất quán.
- **Tính Bất Biến (Immutability)**: Ưu tiên các đối tượng bất biến khi có thể, đặc biệt là đối với DTOs.
- **Trường `final`**: Đánh dấu các dependency được inject trong constructor là `final`.
- **Sử dụng Vòng lặp `for`**: Ưu tiên sử dụng vòng lặp `for` truyền thống thay vì Java Stream API để xử lý các tập hợp (collections). Điều này giúp code dễ gỡ lỗi (debug) hơn và dễ đọc hơn đối với các lập trình viên ở mọi cấp độ.
- **Không sử dụng Lombok**: Dự án không sử dụng thư viện Lombok để tránh các vấn đề liên quan đến build và IDE. Tất cả các Plain Old Java Objects (POJOs) như DTOs và Entities phải được viết thủ công với đầy đủ constructors, getters, và setters.
