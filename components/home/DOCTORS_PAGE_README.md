# Doctors Page - Trang Danh Sách Bác Sĩ

## Tổng Quan
Trang hiển thị danh sách các bác sĩ trong hệ thống với thông tin chi tiết và khả năng tìm kiếm.

## Tính Năng

### 1. Hiển Thị Danh Sách Bác Sĩ
- Lấy danh sách bác sĩ từ API `/api/v1/doctors`
- Sử dụng hook `useDoctors()` để fetch data
- Hiển thị tối đa 50 bác sĩ
- Tự động refresh khi có thay đổi

### 2. Tìm Kiếm
- Tìm kiếm theo tên bác sĩ
- Tìm kiếm theo email
- Real-time search (không cần nhấn nút)
- Hiển thị kết quả ngay lập tức

### 3. Thông Tin Bác Sĩ
Mỗi card bác sĩ hiển thị:
- **Avatar**: Ảnh đại diện hoặc icon mặc định
- **Tên**: Tiền tố "BS." + tên bác sĩ
- **Email**: Địa chỉ email liên hệ
- **Số điện thoại**: Nếu có
- **Đánh giá**: Rating từ 4.5-5.0 (demo)
- **Kinh nghiệm**: Số năm kinh nghiệm (demo)
- **Số bệnh nhân**: Tổng số bệnh nhân đã điều trị (demo)
- **Trạng thái**: Chấm xanh = đang online
- **Nút đặt lịch**: Cho phép đặt lịch với bác sĩ

### 4. States
- **Loading**: Hiển thị skeleton loading
- **Empty**: Thông báo khi chưa có bác sĩ
- **No Results**: Thông báo khi không tìm thấy kết quả
- **Success**: Hiển thị danh sách bác sĩ

## Navigation

### Vào Trang
Từ HomePage → Click nút "Bác sĩ" (icon Stethoscope)

### Quay Lại
Click nút back arrow ở header → Quay về HomePage

## Components

### DoctorsPage
Component chính hiển thị trang danh sách bác sĩ

**Props:**
- `onBack?: () => void` - Callback khi click nút back

**State:**
- `searchQuery: string` - Query tìm kiếm

### DoctorCard
Component hiển thị thông tin một bác sĩ

**Props:**
- `doctor: User` - Thông tin bác sĩ

**Features:**
- Responsive design
- Hover effect
- Click để đặt lịch (chưa implement)

## API Integration

### Endpoint (Public - No Auth Required)
```
GET /api/v1/doctors?page=1&limit=50&search=
```

**Authentication:** None required - Public endpoint

**Query Parameters:**
- `page` (optional): Page number, default = 1
- `limit` (optional): Items per page, default = 50
- `search` (optional): Search by name or email

### Response
```typescript
{
  doctors: User[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    pages: number
  }
}
```

### User Type
```typescript
interface User {
  id: string
  name: string
  email: string
  phone: string
  image?: string | null
  createdAt: string
}
```

**Note:** API này là public, không cần authentication. Bất kỳ ai (đã đăng nhập hoặc chưa) đều có thể xem danh sách bác sĩ.

## Styling

### Colors
- Primary: `#EAB308` (Golden Yellow)
- Purple gradient: Avatar background
- Green: Online status indicator
- Yellow: Rating badge

### Layout
- Max width: 430px (mobile-first)
- Rounded corners: 24px-40px
- Shadows: Subtle elevation
- Spacing: Consistent padding

## Demo Data

Vì chưa có data thực từ database, các thông tin sau được generate random:
- **Kinh nghiệm**: 5-20 năm
- **Số bệnh nhân**: 100-600 người
- **Rating**: 4.5-5.0 sao

## Future Enhancements

### 1. Booking Integration
- Click "Đặt lịch với bác sĩ" → Mở booking dialog
- Pre-select doctor trong booking form
- Lưu doctorId vào booking record

### 2. Doctor Profile
- Click vào card → Xem chi tiết bác sĩ
- Hiển thị chuyên môn, bằng cấp
- Lịch sử điều trị
- Reviews từ bệnh nhân

### 3. Filter & Sort
- Lọc theo chuyên môn
- Lọc theo kinh nghiệm
- Sắp xếp theo rating
- Sắp xếp theo tên

### 4. Real Stats
- Lấy số năm kinh nghiệm từ database
- Đếm số bệnh nhân thực tế
- Tính rating từ reviews
- Hiển thị lịch làm việc

### 5. Availability
- Hiển thị lịch trống của bác sĩ
- Chỉ cho đặt lịch khi bác sĩ rảnh
- Tích hợp với calendar system

## Files

### Created
- `components/home/DoctorsPage.tsx` - Main component
- `components/home/DOCTORS_PAGE_README.md` - Documentation

### Modified
- `components/home/HomePage.tsx` - Added navigation prop
- `components/layout/MobileLayout.tsx` - Added doctors route
- `lib/swr/hooks/users.ts` - Added image property to User type

## Testing

### Manual Testing Steps
1. Vào trang home
2. Click nút "Bác sĩ"
3. Verify: Hiển thị trang danh sách bác sĩ
4. Verify: Loading state hiển thị đúng
5. Verify: Danh sách bác sĩ hiển thị (nếu có)
6. Test search: Nhập tên bác sĩ
7. Verify: Kết quả filter đúng
8. Click nút back
9. Verify: Quay về trang home

### Create Test Doctor
Để test, cần tạo user với role DOCTOR:
1. Login as Super Admin
2. Go to Admin Panel → Users
3. Create new user with role "Bác sĩ"
4. Verify: Doctor xuất hiện trong danh sách

## Notes

- Trang này chỉ hiển thị users có role = "DOCTOR"
- API endpoint `/api/v1/doctors` đã được tạo
- Hook `useDoctors()` đã được thêm vào `lib/swr/hooks/users.ts`
- Image property đã được thêm vào User type
- Sử dụng Material Icons Round cho icons
- Mobile-first design với max-width 430px
