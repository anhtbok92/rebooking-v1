# Self Attendance - Chấm Công Tự Động

## Tổng Quan

Tính năng cho phép nhân viên (STAFF) và bác sĩ (DOCTOR) tự chấm công vào/ra mỗi ngày.

## Tính Năng

### 1. Check-in (Chấm Công Vào)
- Nhân viên nhấn nút "Chấm Công Vào" khi bắt đầu làm việc
- Hệ thống ghi nhận thời gian check-in chính xác
- Chỉ có thể check-in 1 lần/ngày
- Tự động tạo attendance record với status "PRESENT"

### 2. Check-out (Chấm Công Ra)
- Nhân viên nhấn nút "Chấm Công Ra" khi kết thúc ca làm
- Hệ thống ghi nhận thời gian check-out
- Chỉ có thể check-out sau khi đã check-in
- Tự động tính tổng giờ làm việc

### 3. Hiển Thị Real-time
- Đồng hồ hiển thị thời gian hiện tại (cập nhật mỗi giây)
- Trạng thái check-in/check-out hôm nay
- Tổng giờ làm việc trong ngày
- Thống kê tháng hiện tại

### 4. Lịch Sử
- Xem lịch sử chấm công tháng hiện tại
- Hiển thị 10 bản ghi gần nhất
- Thống kê: Có mặt, Vắng, Nửa ngày, Nghỉ phép

## API Endpoints

### GET /api/v1/attendance/self
Lấy danh sách attendance của chính mình

**Query Parameters:**
- `month` (optional): Tháng (1-12)
- `year` (optional): Năm

**Response:**
```json
{
  "attendances": [
    {
      "id": "uuid",
      "userId": "uuid",
      "date": "2024-01-15T00:00:00.000Z",
      "status": "PRESENT",
      "checkIn": "2024-01-15T08:00:00.000Z",
      "checkOut": "2024-01-15T17:00:00.000Z",
      "notes": null,
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z"
    }
  ]
}
```

### POST /api/v1/attendance/self
Check-in (Chấm công vào)

**Request:** No body required

**Response:** Attendance object (201 Created)

**Errors:**
- 400: "Already checked in today" - Đã chấm công vào hôm nay

### POST /api/v1/attendance/self/check-out
Check-out (Chấm công ra)

**Request:** No body required

**Response:** Updated attendance object

**Errors:**
- 400: "No check-in record found for today" - Chưa chấm công vào
- 400: "Already checked out today" - Đã chấm công ra

### GET /api/v1/attendance/self/today
Lấy trạng thái chấm công hôm nay

**Response:**
```json
{
  "attendance": {
    "id": "uuid",
    "userId": "uuid",
    "date": "2024-01-15T00:00:00.000Z",
    "status": "PRESENT",
    "checkIn": "2024-01-15T08:00:00.000Z",
    "checkOut": null,
    "notes": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "hasCheckedIn": true,
  "hasCheckedOut": false
}
```

## Components

### SelfAttendance
Component chính cho self check-in/check-out

**Location:** `components/staff/SelfAttendance.tsx`

**Features:**
- Real-time clock display
- Check-in/Check-out buttons
- Today's status card
- Monthly statistics
- Recent attendance history

### StaffDashboard
Dashboard cho STAFF và DOCTOR với layout giống Admin

**Location:** `components/staff/StaffDashboard.tsx`

**Layout:**
- Header (top) - Giống Admin/SuperAdmin
- Sidebar (left) - Menu navigation
- Content (main) - Nội dung chính

**Sidebar Menu:**
1. **Tổng Quan** (StaffAnalytics) - Dashboard analytics với charts và KPIs
2. **Đặt Lịch** (BookingsManagement) - Quản lý bookings với stats và table ⭐ MỚI
3. **Lịch** (BookingCalendar) - Xem calendar với tất cả bookings
4. **Chấm Công** (SelfAttendance) - Self check-in/check-out
5. **Lịch Làm Việc** (Coming soon) - Lịch làm việc cá nhân
6. **Thông Tin** (Coming soon) - Thông tin cá nhân

**Default View:** Tổng Quan (overview)

## Pages

### /dashboard
Main dashboard page - hiển thị dashboard tùy theo role

**Location:** `app/[locale]/(dashboard)/dashboard/page.tsx`

**Access:**
- STAFF role ✅ (hiển thị StaffDashboard)
- DOCTOR role ✅ (hiển thị StaffDashboard)
- ADMIN role ❌ (redirected to /admin)
- SUPER_ADMIN role ❌ (redirected to /admin/super)
- CLIENT role ✅ (hiển thị ClientDashboard)

### /staff
Legacy staff page - redirect về /dashboard

**Location:** `app/[locale]/(dashboard)/staff/page.tsx`

**Behavior:** Redirect tất cả users về `/dashboard`

## Quy Trình Sử Dụng

### Nhân Viên/Bác Sĩ

#### 1. Đăng Nhập
- Đăng nhập với tài khoản STAFF hoặc DOCTOR
- Tự động vào `/dashboard`
- Mặc định hiển thị **"Tổng Quan"** với analytics
- Layout: Header trên + Sidebar trái (giống Admin)

#### 2. Xem Bookings (Menu "Đặt Lịch") ⭐ MỚI
1. Click **"Đặt Lịch"** trong sidebar
2. Xem stats cards: New, Pending, Completed bookings
3. Xem table với tabs: New, Pending, Completed, All
4. Filter và sort bookings
5. Click vào booking để xem chi tiết
6. Có thể update status (nếu có quyền)

#### 3. Xem Calendar (Menu "Lịch")
1. Click **"Lịch"** trong sidebar
2. Xem calendar view với tất cả bookings
3. Click vào booking để xem chi tiết
4. Filter theo ngày, trạng thái

#### 4. Vào Chấm Công
1. Click **"Chấm Công"** trong sidebar
2. Xem đồng hồ hiển thị thời gian hiện tại

#### 5. Chấm Công Vào (Sáng)
1. Nhấn nút **"Chấm Công Vào"**
2. Thông báo: "Đã chấm công vào thành công!"
3. Nút chuyển thành "Đã Chấm Công Vào" (disabled)

#### 6. Chấm Công Ra (Chiều)
1. Nhấn nút **"Chấm Công Ra"**
2. Thông báo: "Đã chấm công ra thành công!"
3. Nút chuyển thành "Đã Chấm Công Ra" (disabled)
4. Hiển thị tổng giờ làm việc

#### 7. Xem Lịch Sử Chấm Công
- Xem thống kê tháng hiện tại
- Xem 10 bản ghi gần nhất
- Kiểm tra giờ vào/ra mỗi ngày

#### 8. Xem Analytics
- Click **"Tổng Quan"** trong sidebar
- Xem bookings hôm nay, tuần này, tháng này
- Xem charts performance
- Xem top services

### Admin

Admin vẫn có thể:
- Xem tất cả attendance records
- Tạo/sửa/xóa attendance cho nhân viên
- Điều chỉnh giờ vào/ra nếu cần
- Đánh dấu vắng/nghỉ phép

## Validation & Rules

### Check-in Rules
- ✅ Chỉ STAFF và DOCTOR có thể check-in
- ✅ Chỉ check-in được 1 lần/ngày
- ✅ Tự động set status = "PRESENT"
- ✅ Ghi nhận thời gian chính xác đến giây

### Check-out Rules
- ✅ Phải check-in trước khi check-out
- ✅ Chỉ check-out được 1 lần/ngày
- ✅ Không thể check-out nếu chưa check-in
- ✅ Tự động tính tổng giờ làm

### Display Rules
- ✅ Đồng hồ cập nhật mỗi giây
- ✅ Auto-refresh status mỗi 30 giây
- ✅ Hiển thị 10 bản ghi gần nhất
- ✅ Thống kê theo tháng hiện tại

## UI/UX Features

### Real-time Clock
- Hiển thị HH:mm:ss
- Cập nhật mỗi giây
- Font size lớn, dễ đọc

### Status Card
- Hiển thị trạng thái hôm nay
- Giờ vào/ra
- Tổng giờ làm việc
- Background màu accent

### Buttons
- Kích thước lớn (h-20)
- Icons rõ ràng
- Disabled state khi đã check-in/out
- Loading state khi đang xử lý

### Statistics Cards
- 4 cards: Có mặt, Vắng, Nửa ngày, Nghỉ phép
- Màu sắc phân biệt
- Số liệu lớn, dễ nhìn

### History List
- Hiển thị ngày + thứ
- Giờ vào/ra
- Badge trạng thái
- Border rounded

## Permissions

| Role | Check-in | Check-out | View Own | View All | Manage |
|------|----------|-----------|----------|----------|--------|
| STAFF | ✅ | ✅ | ✅ | ❌ | ❌ |
| DOCTOR | ✅ | ✅ | ✅ | ❌ | ❌ |
| ADMIN | ❌ | ❌ | ❌ | ✅ | ✅ |
| SUPER_ADMIN | ❌ | ❌ | ❌ | ✅ | ✅ |
| CLIENT | ❌ | ❌ | ❌ | ❌ | ❌ |

## Security

### Authentication
- Tất cả endpoints yêu cầu authentication
- Session-based authentication với NextAuth

### Authorization
- STAFF/DOCTOR chỉ xem được attendance của mình
- Không thể xem/sửa attendance của người khác
- ADMIN/SUPER_ADMIN có full access

### Data Validation
- Validate role trước khi cho phép check-in/out
- Validate unique constraint (1 record/user/day)
- Validate check-out phải sau check-in

## Error Handling

### Common Errors

**"Already checked in today"**
- Nguyên nhân: Đã check-in rồi
- Giải pháp: Chờ đến ngày mai để check-in lại

**"No check-in record found for today"**
- Nguyên nhân: Chưa check-in
- Giải pháp: Check-in trước khi check-out

**"Already checked out today"**
- Nguyên nhân: Đã check-out rồi
- Giải pháp: Không thể check-out lại trong ngày

**"Unauthorized"**
- Nguyên nhân: Chưa đăng nhập
- Giải pháp: Đăng nhập lại

**"Forbidden"**
- Nguyên nhân: Không có quyền (CLIENT role)
- Giải pháp: Liên hệ admin để cấp quyền STAFF/DOCTOR

## Future Enhancements

- [ ] QR Code check-in (scan QR tại văn phòng)
- [ ] Geolocation verification (chỉ check-in tại văn phòng)
- [ ] Face recognition check-in
- [ ] Push notification nhắc check-out
- [ ] Weekly/Monthly reports
- [ ] Export attendance to PDF/Excel
- [ ] Overtime tracking
- [ ] Break time tracking
- [ ] Multiple check-in/out per day (for shifts)
- [ ] Leave request integration

## Testing

### Manual Testing

1. **Test Check-in:**
   - Login as STAFF
   - Go to /staff
   - Click "Chấm Công Vào"
   - Verify success message
   - Verify button disabled

2. **Test Check-out:**
   - After check-in
   - Click "Chấm Công Ra"
   - Verify success message
   - Verify total hours displayed

3. **Test Duplicate Check-in:**
   - Try to check-in again
   - Should show error: "Already checked in today"

4. **Test Check-out Without Check-in:**
   - New day, no check-in
   - Try to check-out
   - Should show error: "No check-in record found"

5. **Test Statistics:**
   - Verify monthly stats update
   - Verify history list shows records

## Files Created

```
app/api/v1/attendance/self/
├── route.ts                          # GET (list), POST (check-in)
├── check-out/route.ts                # POST (check-out)
└── today/route.ts                    # GET (today's status)

components/staff/
├── SelfAttendance.tsx                # Main self-attendance component
└── StaffDashboard.tsx                # Staff dashboard with tabs

app/[locale]/(dashboard)/staff/
└── page.tsx                          # Staff page (updated)

app/[locale]/(dashboard)/dashboard/
└── page.tsx                          # Main dashboard (updated redirect)

messages/
└── vi.json                           # Vietnamese translations (updated)

docs/
└── SELF_ATTENDANCE.md                # This file
```

## Status: ✅ READY TO USE

Tính năng self check-in/check-out đã sẵn sàng. Nhân viên và bác sĩ có thể tự chấm công!
