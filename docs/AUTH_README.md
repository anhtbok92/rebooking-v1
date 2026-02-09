# Authentication trong Mobile Layout

## Tổng Quan
Đã tích hợp đầy đủ chức năng đăng nhập/đăng ký vào trang Cá Nhân của mobile layout.

## Components

### AuthDialog (`components/home/AuthDialog.tsx`)
Dialog component xử lý cả đăng nhập và đăng ký:

**Tính năng:**
- ✅ Đăng nhập với email/password
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với Google
- ✅ Chuyển đổi giữa form đăng nhập/đăng ký
- ✅ Validation với Yup schema
- ✅ Toast notifications
- ✅ Responsive mobile design

**Props:**
- `open`: boolean - Trạng thái mở/đóng dialog
- `onOpenChange`: function - Callback khi thay đổi trạng thái
- `mode`: 'signin' | 'signup' - Chế độ hiển thị
- `onSwitchMode`: function - Callback khi chuyển đổi mode

### ProfilePage (`components/home/ProfilePage.tsx`)
Trang cá nhân với logic authentication:

**Trạng thái:**
1. **Loading** - Đang kiểm tra session
2. **Unauthenticated** - Hiển thị nút Đăng nhập/Đăng ký
3. **Authenticated** - Hiển thị thông tin user và menu

**Chức năng:**
- ✅ Kiểm tra trạng thái đăng nhập với `useSession()`
- ✅ Mở AuthDialog khi click nút Đăng nhập/Đăng ký
- ✅ Hiển thị avatar, tên, email của user
- ✅ Menu items (Thông tin, Lịch sử, Yêu thích, Cài đặt, Trợ giúp)
- ✅ Đăng xuất với `signOut()`

## Flow Đăng Nhập

1. User click "Đăng Nhập" → Mở AuthDialog với mode='signin'
2. User nhập email/password hoặc chọn Google
3. Gọi `signIn()` từ next-auth
4. Nếu thành công → Reload page để update session
5. ProfilePage hiển thị thông tin user

## Flow Đăng Ký

1. User click "Đăng Ký" → Mở AuthDialog với mode='signup'
2. User nhập thông tin (name, email, phone, password)
3. Gọi API `/api/v1/user/register`
4. Nếu thành công → Chuyển sang mode='signin'
5. User đăng nhập với tài khoản mới

## Flow Đăng Xuất

1. User click menu item "Đăng xuất"
2. Gọi `signOut({ callbackUrl: '/' })`
3. Redirect về trang chủ
4. Session bị xóa

## API Endpoints

- `POST /api/v1/user/register` - Đăng ký tài khoản mới
- NextAuth endpoints:
  - `/api/auth/signin` - Đăng nhập
  - `/api/auth/signout` - Đăng xuất
  - `/api/auth/session` - Lấy session

## Validation

### Đăng Nhập
- Email: Required, valid email format
- Password: Required

### Đăng Ký
- Name: Required
- Email: Required, valid email format
- Phone: Required, 7-15 digits
- Password: Required, minimum 6 characters

## Styling
- Mobile-first design
- Rounded corners (rounded-2xl, rounded-3xl)
- Primary color (#EAB308) cho buttons
- Material Icons cho icons
- Dark mode support
