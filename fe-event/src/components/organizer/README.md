# Organizer Components - EventZone (Light Theme)

Bộ component hiện đại và chuyên nghiệp cho phần Organizer của EventZone với thiết kế glassmorphism và animation mượt mà, sử dụng giao diện màu sáng.

## 🎨 Màu sắc chủ đạo

- **Primary**: Xanh dương nhạt (#3b82f6) → Cam (#f97316)
- **Secondary**: Cam (#f97316) → Xanh dương (#3b82f6)
- **Background**: Slate-50 → Blue-50 → Orange-50
- **Text**: Slate-800, Slate-700, Slate-600
- **Theme**: Light Mode với glassmorphism effects

## 📦 Components

### 1. OrganizerCard

Component card hiện đại với hiệu ứng glassmorphism và animation hover.

```jsx
import OrganizerCard from "./OrganizerCard";

<OrganizerCard
  title="Tổng sự kiện"
  subtitle="Tất cả sự kiện đã tạo"
  icon="📊"
  value={24}
  change="+12%"
  changeType="positive"
  onClick={() => console.log("Card clicked")}
/>;
```

**Props:**

- `title` (string, required): Tiêu đề card
- `subtitle` (string): Phụ đề
- `icon` (node, required): Icon hiển thị
- `value` (string|number): Giá trị chính
- `change` (string): Thay đổi (ví dụ: "+12%")
- `changeType` ("positive"|"negative"|"neutral"): Loại thay đổi
- `onClick` (function): Xử lý khi click
- `className` (string): CSS class tùy chỉnh
- `children` (node): Nội dung bổ sung

### 2. OrganizerButton

Button hiện đại với nhiều variant và animation.

```jsx
import OrganizerButton from "./OrganizerButton";

<OrganizerButton
  variant="primary"
  size="md"
  icon="✨"
  iconPosition="left"
  loading={false}
  disabled={false}
  fullWidth={false}
  onClick={() => console.log("Button clicked")}
>
  Tạo sự kiện mới
</OrganizerButton>;
```

**Props:**

- `children` (node, required): Nội dung button
- `variant` ("primary"|"secondary"|"outline"|"ghost"|"danger"|"success"): Kiểu button
- `size` ("sm"|"md"|"lg"|"xl"): Kích thước
- `icon` (node): Icon
- `iconPosition` ("left"|"right"): Vị trí icon
- `loading` (boolean): Trạng thái loading
- `disabled` (boolean): Trạng thái disabled
- `fullWidth` (boolean): Chiều rộng đầy đủ
- `onClick` (function): Xử lý khi click

### 3. OrganizerInput

Input field hiện đại với validation và animation.

```jsx
import OrganizerInput from "./OrganizerInput";

<OrganizerInput
  label="Tên sự kiện"
  placeholder="Nhập tên sự kiện..."
  type="text"
  icon="📝"
  iconPosition="left"
  error="Tên sự kiện không được để trống"
  success="Tên sự kiện hợp lệ"
  required={true}
  fullWidth={true}
  onChange={(e) => setEventName(e.target.value)}
/>;
```

**Props:**

- `label` (string): Label cho input
- `placeholder` (string): Placeholder text
- `type` (string): Loại input
- `value` (string|number): Giá trị
- `onChange` (function): Xử lý khi thay đổi
- `onFocus` (function): Xử lý khi focus
- `onBlur` (function): Xử lý khi blur
- `error` (string): Thông báo lỗi
- `success` (string): Thông báo thành công
- `disabled` (boolean): Trạng thái disabled
- `required` (boolean): Bắt buộc
- `icon` (node): Icon
- `iconPosition` ("left"|"right"): Vị trí icon
- `size` ("sm"|"md"|"lg"): Kích thước
- `fullWidth` (boolean): Chiều rộng đầy đủ

## 🎭 Layout Components

### 1. OrganizerLayout

Layout chính cho toàn bộ phần Organizer.

```jsx
import OrganizerLayout from "../ui/organizer/OrganizerLayout";

<OrganizerLayout>
  <YourComponent />
</OrganizerLayout>;
```

### 2. OrganizerSidebar

Sidebar navigation với animation và active state.

### 3. HeaderOrganizer

Header với thông tin user, thời gian và dropdown menu.

## 🎨 CSS Classes

### Animation Classes

- `.animate-float`: Hiệu ứng nổi
- `.animate-glow`: Hiệu ứng phát sáng
- `.animate-slide-in-left`: Trượt từ trái
- `.animate-slide-in-right`: Trượt từ phải
- `.animate-fade-in-up`: Fade in từ dưới lên
- `.animate-shimmer`: Hiệu ứng shimmer

### Glassmorphism Classes

- `.glass`: Hiệu ứng glassmorphism đậm
- `.glass-light`: Hiệu ứng glassmorphism nhẹ

### Utility Classes

- `.gradient-text-blue`: Text gradient xanh dương-cam
- `.gradient-text-orange`: Text gradient cam-xanh dương
- `.hover-lift`: Hiệu ứng nâng khi hover
- `.hover-glow`: Hiệu ứng phát sáng khi hover
- `.loading-skeleton`: Loading skeleton
- `.organizer-scrollbar`: Custom scrollbar

## 🚀 Sử dụng

1. Import CSS:

```jsx
import "../styles/organizer.css";
```

2. Sử dụng components:

```jsx
import OrganizerCard from "./OrganizerCard";
import OrganizerButton from "./OrganizerButton";
import OrganizerInput from "./OrganizerInput";
```

3. Wrap trong OrganizerLayout:

```jsx
<OrganizerLayout>
  <OrganizerDashboard />
</OrganizerLayout>
```

## 🎯 Ví dụ Dashboard

Xem file `OrganizerDashboard.jsx` để tham khảo cách sử dụng tất cả components trong một trang dashboard hoàn chỉnh.

## 🔧 Tùy chỉnh

### Thay đổi màu sắc

Chỉnh sửa file `organizer.css` để thay đổi:

- Màu chủ đạo (blue/orange)
- Gradient
- Animation timing
- Shadow effects

### Thêm animation mới

```css
@keyframes yourAnimation {
  0% {
    /* start state */
  }
  100% {
    /* end state */
  }
}

.your-animation-class {
  animation: yourAnimation 1s ease-out;
}
```

## 📱 Responsive

Tất cả components đều responsive và hỗ trợ:

- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large Desktop (1280px+)

## 🎨 Design System

### Typography

- **Heading 1**: 4xl, font-bold, gradient-text-blue
- **Heading 2**: 2xl, font-bold, text-slate-700
- **Body**: text-base, text-slate-800
- **Caption**: text-sm, text-slate-600

### Spacing

- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)

### Border Radius

- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Color Palette

- **Primary Blue**: #3b82f6
- **Primary Orange**: #f97316
- **Background**: #f8fafc → #eff6ff → #fff7ed
- **Text Primary**: #1e293b
- **Text Secondary**: #475569
- **Text Muted**: #64748b

## 🌟 Tính năng nổi bật

### Light Theme

- Giao diện sáng sủa, dễ nhìn
- Glassmorphism effects tinh tế
- Gradient xanh dương-cam năng động
- Animation mượt mà và chuyên nghiệp

### Accessibility

- High contrast ratios
- Keyboard navigation
- Screen reader friendly
- Focus indicators rõ ràng

### Performance

- CSS animations tối ưu
- Lazy loading components
- Efficient re-renders
- Minimal bundle size

## 🔮 Tính năng tương lai

- [ ] Dark/Light mode toggle
- [ ] Theme customization
- [ ] More animation variants
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Internationalization (i18n)
- [ ] Advanced charts integration
- [ ] Real-time notifications
