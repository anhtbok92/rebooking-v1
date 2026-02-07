# Mobile Layout - Hướng Dẫn

## Tổng Quan
Ứng dụng đã được thiết kế lại với giao diện mobile-first, bao gồm 5 tab chính:

1. **Trang chủ** - Hiển thị dashboard với các dịch vụ, lịch hẹn, tin tức
2. **Tin nhắn** - Chức năng chat (đang phát triển)
3. **Lịch hẹn** - Quản lý lịch hẹn (đang phát triển)
4. **CTV** - Cộng tác viên (đang phát triển)
5. **Cá nhân** - Thông tin user, đăng nhập/đăng ký

## Cấu Trúc File

### Layout Components
- `components/layout/MobileLayout.tsx` - Layout chính với bottom navigation

### Page Components
- `components/home/HomePage.tsx` - Trang chủ (đã hoàn thiện)
- `components/home/MessagesPage.tsx` - Trang tin nhắn (placeholder)
- `components/home/AppointmentsPage.tsx` - Trang lịch hẹn (placeholder)
- `components/home/CTVPage.tsx` - Trang CTV (placeholder)
- `components/home/ProfilePage.tsx` - Trang cá nhân (có logic đăng nhập)

### Main Entry
- `app/[locale]/page.tsx` - Entry point sử dụng MobileLayout

## Thiết Kế

### Màu Sắc
- Primary: `#EAB308` (Golden Yellow)
- Background Light: `#F8F9FA`
- Background Dark: `#111827`

### Responsive
- Max width: 430px (mobile)
- Centered layout
- Bottom navigation fixed

## Tính Năng Đã Implement

### Trang Chủ (HomePage)
✅ Header với avatar, location, notifications
✅ Search bar
✅ Quick actions (5 icons)
✅ Upcoming appointments card
✅ Featured services grid (4 items)
✅ CTV promotion banner
✅ Partner vouchers carousel
✅ News & promotions list

### Trang Cá Nhân (ProfilePage)
✅ Check authentication status
✅ Login/Register buttons (chưa đăng nhập)
✅ Profile info (đã đăng nhập)
✅ Menu items

### Bottom Navigation
✅ 5 tabs với icons
✅ Active state highlighting
✅ Tab switching

## Các Bước Tiếp Theo

1. **Tin nhắn**: Implement chat functionality
2. **Lịch hẹn**: Implement calendar và booking management
3. **CTV**: Implement affiliate program features
4. **Cá nhân**: Connect login/register buttons to auth flow

## Chạy Ứng Dụng

```bash
npm run dev
```

Truy cập: http://localhost:3000

## Lưu Ý
- Tất cả images sử dụng Next.js Image component để optimize
- Dark mode được support
- Material Icons Round được load từ Google Fonts
- Tailwind CSS được sử dụng cho styling
