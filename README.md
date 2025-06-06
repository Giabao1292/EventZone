# 🎯 Event Management System

## 📝 Mô tả dự án

**Event Management System** là một nền tảng quản lý sự kiện toàn diện được xây dựng với kiến trúc **full-stack hiện đại**, cho phép người dùng:

- Duyệt và đăng ký tham gia sự kiện
- Đặt vé và theo dõi thông tin sự kiện
- Nhận thông báo, đánh giá, và sử dụng mã giảm giá

Trong khi đó, **Admin** và **Organizer** có thể:

- Tạo, chỉnh sửa, và xoá sự kiện
- Quản lý người tham dự, nhân viên sự kiện
- Quản lý mã khuyến mãi, phản hồi người dùng
- Thống kê và xuất báo cáo sự kiện

Hệ thống hỗ trợ **phân quyền người dùng theo vai trò** (User, Organizer, Admin), sử dụng **JWT Token** để xác thực bảo mật. Dữ liệu được lưu trữ trên **MySQL** và giao diện người dùng được phát triển với **React 18 kết hợp Vite** để đảm bảo hiệu suất tối ưu.

> 🔐 Toàn bộ quy trình xác thực, phân quyền và bảo mật đều được xử lý chuyên nghiệp với Spring Security và JSON Web Token.

---

## ⚙️ Công nghệ sử dụng

### 🧠 Backend – `Spring Boot 3`

- Spring Web
- Spring Data JPA (Hibernate)
- Spring Security + JWT Authentication (Access + Refresh Token)
- Validation & Global Exception Handling
- Lombok, MapStruct, DTO Pattern
- MySQL (Workbench)
- RESTful API chuẩn REST
- Environment Configuration qua `.properties` hoặc `.env`
- CORS & Token Interceptor

### 💻 Frontend – `React 18 + Vite`

- React 18 (SPA)
- Vite (Siêu nhanh và tối ưu)
- React Router DOM v6
- Axios (Interceptor với JWT token)
- Tailwind CSS (hoặc CSS Modules)
- Environment Variables `.env`
- Phân quyền giao diện theo vai trò
- Responsive UI/UX Design

### 🛢️ Database – `MySQL`

- Thiết kế lược đồ qua **MySQL Workbench**
- Tối ưu hóa bảng quan hệ: `users`, `events`, `tickets`, `roles`, `feedbacks`, `vouchers`, ...
- Mối quan hệ: 1-n, n-n, mapping tables

### 🔒 Authentication

- JSON Web Token (JWT):
  - Trả về access + refresh token
  - Xác thực và làm mới token tự động
- Bảo mật API qua middleware/backend interceptor

---

> Dự án được thực hiện bởi nhóm 5 thành viên, mỗi người phụ trách 1 module chuyên biệt: backend, frontend, UI/UX, cơ sở dữ liệu và QA/DevOps.

---

