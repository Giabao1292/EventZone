# 🎪 EventZone - Nền tảng Quản lý Sự kiện Thông minh

<div align="center">

![EventZone Logo](https://img.shields.io/badge/EventZone-Platform-blue?style=for-the-badge&logo=calendar)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)

**Nền tảng quản lý sự kiện toàn diện với AI Recommendation và thanh toán trực tuyến**

[🚀 Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📋 Mục lục

- [✨ Tính năng chính](#-tính-năng-chính)
- [🏗️ Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [🚀 Cài đặt và chạy](#-cài-đặt-và-chạy)
- [📱 Giao diện người dùng](#-giao-diện-người-dùng)
- [🔧 API Documentation](#-api-documentation)
- [🤖 AI Recommendation System](#-ai-recommendation-system)
- [💳 Hệ thống thanh toán](#-hệ-thống-thanh-toán)
- [👥 Vai trò người dùng](#-vai-trò-người-dùng)
- [📊 Database Schema](#-database-schema)
- [🤝 Đóng góp](#-đóng-góp)
- [📄 License](#-license)

---

## ✨ Tính năng chính

### 🎯 Cho Người dùng
- **Đăng ký/Đăng nhập** với Google OAuth và JWT
- **Tìm kiếm sự kiện** theo danh mục, địa điểm, thời gian
- **Đặt vé trực tuyến** với nhiều phương thức thanh toán
- **QR Code check-in** tự động
- **Hệ thống đánh giá** và nhận xét sự kiện
- **Wishlist** và thông báo sự kiện
- **Chat real-time** với ban tổ chức
- **AI Recommendation** gợi ý sự kiện phù hợp

### 🎪 Cho Ban tổ chức
- **Quản lý sự kiện** toàn diện (tạo, chỉnh sửa, xóa)
- **Thiết kế layout** chỗ ngồi trực quan
- **Quản lý đặt vé** và danh sách tham dự
- **Thống kê doanh thu** và báo cáo chi tiết
- **Quảng cáo sự kiện** với hệ thống ads
- **Yêu cầu rút tiền** và quản lý tài chính
- **Chat hỗ trợ** khách hàng real-time

### 👨‍💼 Cho Admin
- **Quản lý người dùng** và phân quyền
- **Duyệt sự kiện** và yêu cầu tổ chức
- **Quản lý danh mục** và voucher
- **Thống kê tổng quan** hệ thống
- **Quản lý quảng cáo** và rút tiền
- **Báo cáo doanh thu** chi tiết

---

## 🏗️ Kiến trúc hệ thống

```
EventZone/
├── 🎨 Frontend (React + Vite)
│   ├── Components UI (Radix UI + Tailwind CSS)
│   ├── State Management (Context API)
│   ├── Routing (React Router)
│   └── Real-time Chat (WebSocket)
├── ⚙️ Backend (Spring Boot)
│   ├── RESTful APIs
│   ├── Security (JWT + OAuth2)
│   ├── Database (MySQL + JPA)
│   └── File Upload (Cloudinary)
├── 🤖 AI Service (Python Flask)
│   ├── Neural Collaborative Filtering
│   ├── Recommendation Engine
│   └── Interaction Tracking
└── 💾 Database (MySQL)
    ├── User Management
    ├── Event Management
    ├── Booking System
    └── Analytics Data
```

---

## 🛠️ Công nghệ sử dụng

### Frontend
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)
![Radix UI](https://img.shields.io/badge/Radix_UI-1.0.0-161618?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.9.0-5A29E4?style=flat-square&logo=axios)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=flat-square&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=java)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-0.11.5-000000?style=flat-square&logo=json-web-tokens)
![Flyway](https://img.shields.io/badge/Flyway-11.9.1-CC0200?style=flat-square)

### AI & ML
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)
![PyTorch](https://img.shields.io/badge/PyTorch-2.7.1-EE4C2C?style=flat-square&logo=pytorch)
![Flask](https://img.shields.io/badge/Flask-3.1.1-000000?style=flat-square&logo=flask)
![Pandas](https://img.shields.io/badge/Pandas-2.3.1-150458?style=flat-square&logo=pandas)

### Payment & Services
![VNPay](https://img.shields.io/badge/VNPay-Sandbox-0055A4?style=flat-square)
![PayOS](https://img.shields.io/badge/PayOS-1.0.3-00C851?style=flat-square)
![Cloudinary](https://img.shields.io/badge/Cloudinary-1.34.0-3448C5?style=flat-square&logo=cloudinary)
![Gmail SMTP](https://img.shields.io/badge/Gmail_SMTP-587-EA4335?style=flat-square&logo=gmail)

---

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Java 21+**
- **Node.js 18+**
- **Python 3.8+**
- **MySQL 8.0+**
- **Maven 3.6+**

### 1. Clone repository
```bash
git clone https://github.com/your-username/EventZone.git
cd EventZone
```

### 2. Cài đặt Database
```bash
# Import database schema
mysql -u root -p < databasefinal.sql

# Hoặc chạy từng file migration
mysql -u root -p event < backend/src/main/resources/dev/db/migration/*.sql
```

### 3. Cấu hình Backend
```bash
cd backend

# Cài đặt dependencies
mvn clean install

# Cấu hình environment variables
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Chỉnh sửa thông tin database, email, payment trong application.yml

# Chạy ứng dụng
mvn spring-boot:run
```

### 4. Cài đặt Frontend
```bash
cd fe-event

# Cài đặt dependencies
npm install

# Cấu hình API endpoint
# Chỉnh sửa src/api/axios.js

# Chạy development server
npm run dev
```

### 5. Cài đặt AI Service
```bash
cd ai-recommend

# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate     # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy AI service
python app.py
```

### 6. Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:5000
- **Swagger Docs**: http://localhost:8080/swagger-ui.html

---

## 📱 Giao diện người dùng

### 🎨 Design System
- **Modern UI/UX** với Tailwind CSS
- **Responsive Design** cho mọi thiết bị
- **Dark/Light Theme** tùy chỉnh
- **Smooth Animations** với Framer Motion
- **Interactive Components** với Radix UI

### 📱 Responsive Layout
- **Desktop**: Dashboard đầy đủ tính năng
- **Tablet**: Layout tối ưu cho tablet
- **Mobile**: Giao diện mobile-first

### 🎯 Key Pages
- **Home**: Trang chủ với sự kiện nổi bật
- **Event Detail**: Chi tiết sự kiện và đặt vé
- **Dashboard**: Bảng điều khiển quản lý
- **Profile**: Hồ sơ người dùng
- **Admin Panel**: Quản trị hệ thống

---

## 🔧 API Documentation

### Authentication
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
GET  /api/auth/google
```

### Events
```http
GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
```

### Bookings
```http
POST   /api/bookings
GET    /api/bookings/user/{userId}
PUT    /api/bookings/{id}/checkin
GET    /api/bookings/{id}/qr-code
```

### Admin APIs
```http
GET    /api/admin/users
GET    /api/admin/events/pending
PUT    /api/admin/events/{id}/approve
GET    /api/admin/analytics
```

📖 **Xem đầy đủ API docs**: http://localhost:8080/swagger-ui.html

---

## 🤖 AI Recommendation System

### 🧠 Neural Collaborative Filtering
- **Deep Learning Model** với PyTorch
- **User-Event Embeddings** tự động học
- **Real-time Training** khi có dữ liệu mới
- **Personalized Recommendations** cho từng user

### 📊 Features
- **Interaction Tracking**: Theo dõi hành vi người dùng
- **Incremental Learning**: Cập nhật model liên tục
- **Cold Start Handling**: Xử lý user/event mới
- **Performance Metrics**: Đánh giá chất lượng gợi ý

### 🔄 API Endpoints
```http
POST /log_interaction    # Log user interaction
GET  /recommend/{userId} # Get recommendations
POST /retrain           # Retrain model
```

---

## 💳 Hệ thống thanh toán

### 🔐 Payment Gateways
- **VNPay**: Thanh toán qua ngân hàng
- **PayOS**: Cổng thanh toán đa dạng
- **MOMO**: Ví điện tử phổ biến

### 🛡️ Security Features
- **SSL/TLS Encryption**
- **Payment Verification**
- **Fraud Detection**
- **Secure Token Storage**

### 📱 Payment Flow
1. **Chọn sự kiện** và chỗ ngồi
2. **Nhập thông tin** thanh toán
3. **Xác thực** qua OTP/SMS
4. **Nhận xác nhận** và QR code
5. **Check-in** tại sự kiện

---

## 👥 Vai trò người dùng

### 👤 User (Người dùng)
- Xem và tìm kiếm sự kiện
- Đặt vé và thanh toán
- Đánh giá và nhận xét
- Quản lý hồ sơ cá nhân

### 🎪 Organizer (Ban tổ chức)
- Tạo và quản lý sự kiện
- Thiết kế layout chỗ ngồi
- Quản lý đặt vé
- Thống kê doanh thu

### 👨‍💼 Admin (Quản trị viên)
- Quản lý toàn bộ hệ thống
- Duyệt sự kiện và yêu cầu
- Quản lý người dùng
- Báo cáo tổng quan

---

## 📊 Database Schema

### 🗄️ Core Tables
- **Users**: Thông tin người dùng
- **Events**: Sự kiện và chi tiết
- **Bookings**: Đặt vé và thanh toán
- **Seats**: Quản lý chỗ ngồi
- **Categories**: Danh mục sự kiện

### 🔗 Relationships
- **One-to-Many**: User → Events
- **Many-to-Many**: Events ↔ Categories
- **One-to-Many**: Event → Bookings
- **One-to-Many**: Booking → Seats

### 📈 Analytics Tables
- **Event Views**: Thống kê lượt xem
- **User Interactions**: Tương tác người dùng
- **Revenue Tracking**: Theo dõi doanh thu

---

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Hãy tham gia phát triển EventZone:

### 📝 Cách đóng góp
1. **Fork** repository
2. **Tạo branch** mới (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. **Tạo Pull Request**

### 🐛 Báo cáo lỗi
- Sử dụng [GitHub Issues](https://github.com/your-username/EventZone/issues)
- Mô tả chi tiết lỗi và cách tái hiện
- Đính kèm screenshot nếu cần

### 💡 Đề xuất tính năng
- Tạo issue với label `enhancement`
- Mô tả chi tiết tính năng mong muốn
- Thảo luận với team trước khi implement

---

## 📄 License

Dự án này được phân phối dưới giấy phép **MIT**. Xem file `LICENSE` để biết thêm chi tiết.

---

## 🙏 Lời cảm ơn

- **Spring Boot Team** - Framework backend mạnh mẽ
- **React Team** - UI library tuyệt vời
- **Tailwind CSS** - Utility-first CSS framework
- **PyTorch** - Deep learning framework
- **Cộng đồng open source** - Những đóng góp quý báu

---

<div align="center">

**Made with ❤️ by EventZone Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/EventZone?style=social)](https://github.com/your-username/EventZone/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/EventZone?style=social)](https://github.com/your-username/EventZone/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/EventZone)](https://github.com/your-username/EventZone/issues)

</div>
