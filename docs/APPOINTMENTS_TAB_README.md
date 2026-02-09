# Tab Lịch Hẹn - Appointments Tab

## Tổng Quan
Tab Lịch Hẹn hiển thị tất cả lịch hẹn của user với giao diện timeline đẹp mắt.

## Tính Năng

### 2 Tabs
1. **Sắp Tới** - Bookings trong tương lai (CONFIRMED, PENDING)
2. **Đã Khám** - Bookings đã hoàn thành (COMPLETED, CANCELLED)

### Timeline Design ✅
- Vertical timeline với dots và line
- Border màu primary cho bookings sắp tới
- Border màu gray cho bookings đã hoàn thành
- Smooth animations

### Booking Card ✅
Hiển thị:
- Tên dịch vụ (service name)
- Tên người đặt (userName)
- Status badge (màu theo trạng thái)
- Ngày hẹn (format dd/MM/yyyy)
- Giờ hẹn (time)
- Giá tiền (format VND)
- Nút "Đổi lịch" và "Chi tiết" (chỉ cho sắp tới)

### Status Colors
- **CONFIRMED**: Green (Đã xác nhận)
- **PENDING**: Amber (Chờ xác nhận)
- **COMPLETED**: Blue (Hoàn thành)
- **CANCELLED**: Red (Đã hủy)

### Floating Button ✅
- Fixed bottom với z-index cao
- Nút "Đặt lịch mới" với icon Plus
- Active scale animation

## Navigation

### Từ HomePage
```
Click "Xem tất cả" ở phần Lịch Hẹn Sắp Tới
  ↓
Navigate to Appointments Tab
  ↓
Show all upcoming bookings
```

### Từ Bottom Nav
```
Click icon "Lịch hẹn"
  ↓
Switch to Appointments Tab
```

## Data Flow

### Fetch Bookings
```typescript
const { data: bookingsData, isLoading } = useUserBookings(userId)
```

### Filter Logic

#### Sắp Tới
```typescript
bookingsData.bookings.filter(booking => {
  const bookingDate = new Date(booking.date)
  return bookingDate >= now && 
         (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
```

#### Đã Khám
```typescript
bookingsData.bookings.filter(booking => {
  return booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
```

## UI States

### 1. Not Logged In
```
Icon: Calendar (gray)
Text: "Vui lòng đăng nhập để xem lịch hẹn của bạn"
```

### 2. Loading
```
3 skeleton cards với animation
```

### 3. Empty State
```
Icon: Calendar (gray)
Text: "Bạn chưa có lịch hẹn nào sắp tới" (hoặc "Chưa có lịch hẹn nào đã hoàn thành")
```

### 4. Has Bookings
```
Timeline với booking cards
```

## Components Structure

```
AppointmentsPage
├── Header (sticky)
├── Tabs (Sắp Tới / Đã Khám)
├── Content
│   ├── Loading State
│   ├── Empty State
│   └── Timeline
│       └── Booking Cards
└── Floating Button
```

## Styling

### Colors
- Primary: `#EAB308` (Golden Yellow)
- Timeline line: Gray 200 / Slate 700 (dark)
- Timeline dot: Primary / Gray (based on tab)
- Card border: 4px left border

### Spacing
- Timeline left padding: 24px (pl-6)
- Timeline dot position: -27px left
- Card spacing: 24px (space-y-6)

### Responsive
- Max width: 430px (mobile)
- Sticky header
- Fixed floating button
- Bottom padding for nav

## Format Functions

### Date Format
```typescript
format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
// Output: "26/12/2025"
```

### Price Format
```typescript
new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
}).format(price)
// Output: "499.000 ₫"
```

## Actions

### Đổi lịch (TODO)
- Click button → Open reschedule dialog
- Select new date/time
- Update booking

### Chi tiết (TODO)
- Click button → Open booking details dialog
- Show full booking info
- Options: Cancel, Reschedule, Contact

### Đặt lịch mới
- Click floating button → Open MobileBooking dialog
- Same flow as homepage booking

## Integration với MobileLayout

### Props
```typescript
onNavigateToAppointments?: () => void
```

### Usage
```typescript
<HomePage onNavigateToAppointments={() => setActiveTab('appointments')} />
```

## Performance

### Optimization
- useMemo for filtering (if needed)
- SWR caching
- Lazy load images (if added)
- Virtual scrolling (for many bookings)

### Caching
- SWR cache bookings
- Revalidate on tab switch
- Manual refresh option

## TODO

- [ ] Implement "Đổi lịch" functionality
- [ ] Implement "Chi tiết" dialog
- [ ] Add pull-to-refresh
- [ ] Add search/filter bookings
- [ ] Add date range picker
- [ ] Add export to calendar
- [ ] Add booking reminders
- [ ] Add rating after completed
- [ ] Add photos to booking cards
- [ ] Add location map link

## Testing

### Test Cases
1. ✅ Not logged in → Show login prompt
2. ✅ Loading → Show skeleton
3. ✅ No bookings → Show empty state
4. ✅ Has upcoming bookings → Show in timeline
5. ✅ Has completed bookings → Show in timeline
6. ✅ Switch tabs → Update content
7. ✅ Click "Xem tất cả" from home → Navigate to tab
8. ✅ Status colors → Correct colors
9. ✅ Date format → dd/MM/yyyy
10. ✅ Price format → VND currency

## Design Credits
- Design: `.next/dev/html/lichhen.html`
- Timeline concept: Vertical timeline with dots
- Color scheme: Primary yellow + status colors
