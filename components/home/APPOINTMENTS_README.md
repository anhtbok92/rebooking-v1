# Lịch Hẹn Sắp Tới - Upcoming Appointments

## Tổng Quan
Phần "Lịch Hẹn Sắp Tới" hiển thị lịch hẹn gần nhất của user đã đăng nhập.

## Tính Năng

### Dynamic Data ✅
- Lấy bookings từ API dựa trên userId
- Chỉ hiển thị bookings trong tương lai
- Chỉ hiển thị bookings có status CONFIRMED hoặc PENDING
- Sort theo ngày gần nhất
- Chỉ hiển thị 1 booking gần nhất

### States

#### 1. Chưa Đăng Nhập
```
Icon: Calendar (gray)
Text: "Đăng nhập để xem lịch hẹn của bạn"
Button: "Đăng nhập ngay"
```

#### 2. Loading
```
Skeleton animation với:
- Date box placeholder
- 3 text lines placeholder
```

#### 3. Có Lịch Hẹn
```
Hiển thị:
- Ngày (date box với màu primary)
- Tên dịch vụ
- Status badge (Đã xác nhận / Chờ xác nhận)
- Giờ hẹn
- Giá tiền (format VND)
```

#### 4. Không Có Lịch Hẹn
```
Icon: Calendar (gray)
Text: "Bạn chưa có lịch hẹn nào sắp tới"
Button: "Đặt lịch ngay" → Mở booking dialog
```

## API Integration

### Hook Sử Dụng
```typescript
const { data: bookingsData, isLoading } = useUserBookings(userId)
```

### Filter Logic
```typescript
const upcomingBookings = bookingsData.bookings
  .filter(booking => {
    const bookingDate = new Date(booking.date)
    return bookingDate >= now && 
           (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 1) // Only first one
```

## Data Structure

### Booking Object
```typescript
{
  id: string
  date: string // ISO date
  time: string // "10:00 AM"
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED"
  service: {
    id: string
    name: string
    price: number
  }
}
```

## UI Components

### Date Box
- Background: Primary color (#EAB308)
- Date: Large white text (2xl)
- Month: Small white text (10px, uppercase)
- Format: "25 TH12"

### Status Badge
- CONFIRMED: Green background, green text
- PENDING: Amber background, amber text
- Rounded full, uppercase, small text (10px)

### Info Rows
- Icon: Material Icons Round
- Text: Small (12px), medium weight
- Icons: schedule, payments

## Format Functions

### Date Format
```typescript
new Date(booking.date).getDate() // Day
new Date(booking.date).getMonth() + 1 // Month (1-12)
```

### Price Format
```typescript
new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
}).format(price)
// Output: "499.000 ₫"
```

## User Flow

### Scenario 1: User Chưa Đăng Nhập
1. Hiển thị message "Đăng nhập để xem..."
2. Click "Đăng nhập ngay"
3. → Navigate to Profile tab (TODO: implement)

### Scenario 2: User Đã Đăng Nhập, Chưa Có Booking
1. Hiển thị message "Chưa có lịch hẹn..."
2. Click "Đặt lịch ngay"
3. → Mở MobileBooking dialog

### Scenario 3: User Có Booking
1. Hiển thị booking gần nhất
2. User xem thông tin
3. (TODO: Click để xem chi tiết booking)

## Performance

### Caching
- SWR cache bookings data
- Revalidate on reconnect
- No auto-refresh (manual only)
- Dedupe requests within 10s

### Optimization
- useMemo cho filter logic
- Chỉ fetch khi có userId
- Chỉ render 1 booking (không loop nhiều)

## TODO

- [ ] Click vào booking card → Xem chi tiết
- [ ] Swipe để xem booking tiếp theo
- [ ] Badge hiển thị số lượng bookings sắp tới
- [ ] Nút "Xem tất cả" → Navigate to appointments tab
- [ ] Countdown timer đến ngày hẹn
- [ ] Nút "Hủy lịch" / "Đổi lịch"
- [ ] Push notification trước ngày hẹn
- [ ] Add to calendar button

## Testing

### Test Cases
1. ✅ User chưa đăng nhập → Show login prompt
2. ✅ User đăng nhập, chưa có booking → Show empty state
3. ✅ User có booking trong tương lai → Show booking
4. ✅ User chỉ có booking quá khứ → Show empty state
5. ✅ User có nhiều bookings → Show booking gần nhất
6. ✅ Loading state → Show skeleton
7. ✅ Status CONFIRMED → Green badge
8. ✅ Status PENDING → Amber badge

### Edge Cases
- Booking hôm nay → Vẫn hiển thị (date >= now)
- Booking đã CANCELLED → Không hiển thị
- Booking đã COMPLETED → Không hiển thị
- Multiple bookings cùng ngày → Show booking đầu tiên
