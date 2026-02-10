# Attendance Management - Quick Start

## Đã Hoàn Thành ✅

### 1. Database Schema
- ✅ Model `Attendance` đã có trong Prisma schema
- ✅ Unique constraint: 1 nhân viên chỉ có 1 bản ghi/ngày
- ✅ Prisma client đã được generate

### 2. API Routes
- ✅ `GET /api/v1/attendance` - Lấy danh sách chấm công
- ✅ `POST /api/v1/attendance` - Tạo bản ghi chấm công
- ✅ `GET /api/v1/attendance/[id]` - Lấy chi tiết
- ✅ `PUT /api/v1/attendance/[id]` - Cập nhật
- ✅ `DELETE /api/v1/attendance/[id]` - Xóa

### 3. Components
- ✅ `AttendanceManagement.tsx` - Component chính
- ✅ `MarkAttendanceDialog.tsx` - Dialog chấm công
- ✅ `EditAttendanceDialog.tsx` - Dialog sửa chấm công

### 4. Features
- ✅ Chấm công theo ngày
- ✅ 4 trạng thái: Có mặt, Vắng, Nửa ngày, Nghỉ phép
- ✅ Ghi nhận giờ vào/ra
- ✅ Lọc theo nhân viên, tháng, năm
- ✅ Thống kê tổng hợp
- ✅ CRUD operations
- ✅ Ghi chú cho mỗi bản ghi

### 5. Translations
- ✅ Đã thêm translations tiếng Việt vào `messages/vi.json`

### 6. Documentation
- ✅ `ATTENDANCE_MANAGEMENT.md` - Tài liệu chi tiết
- ✅ `ATTENDANCE_QUICK_START.md` - Quick start guide
- ✅ Đã cập nhật `docs/README.md`

## Cách Sử Dụng

### Bước 1: Restart Dev Server
```bash
# Dừng dev server hiện tại (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

### Bước 2: Truy Cập Tính Năng
1. Đăng nhập với tài khoản **SUPER_ADMIN**
2. Vào menu **"Lương Thưởng"**
3. Chọn tab **"Chấm Công"**

### Bước 3: Chấm Công
1. Click **"Chấm Công Hôm Nay"**
2. Chọn nhân viên từ dropdown
3. Chọn trạng thái (Có mặt/Vắng/Nửa ngày/Nghỉ phép)
4. Nếu chọn "Có mặt", nhập giờ vào/ra
5. Thêm ghi chú (nếu cần)
6. Click **"Chấm Công"**

### Bước 4: Xem Báo Cáo
- Chọn tháng/năm để xem chấm công
- Chọn nhân viên cụ thể hoặc xem tất cả
- Xem thống kê: Có mặt, Vắng, Nửa ngày, Nghỉ phép

### Bước 5: Quản Lý
- **Sửa**: Click nút "Sửa" trên bản ghi
- **Xóa**: Click nút "Xóa" và xác nhận

## Trạng Thái Chấm Công

| Trạng Thái | Mô Tả | Tính Công |
|-----------|-------|-----------|
| **Có mặt** (PRESENT) | Nhân viên có mặt đầy đủ | 1 ngày |
| **Vắng** (ABSENT) | Nhân viên vắng mặt | 0 ngày |
| **Nửa ngày** (HALF_DAY) | Nhân viên làm nửa ngày | 0.5 ngày |
| **Nghỉ phép** (LEAVE) | Nhân viên nghỉ phép có phép | 0 ngày* |

*Có thể điều chỉnh tùy chính sách công ty

## Tính Năng Nổi Bật

### 1. Thống Kê Trực Quan
- Cards hiển thị số liệu tổng hợp
- Màu sắc phân biệt rõ ràng
- Cập nhật real-time

### 2. Lọc Linh Hoạt
- Theo nhân viên
- Theo tháng/năm
- Xem tất cả hoặc từng người

### 3. Ghi Nhận Giờ Làm
- Check-in: Giờ vào làm
- Check-out: Giờ ra về
- Tự động format HH:mm

### 4. Ghi Chú
- Thêm ghi chú cho mỗi bản ghi
- Giải thích lý do vắng, nghỉ phép
- Tối đa 500 ký tự

### 5. Validation
- Không thể chấm công trùng ngày
- Bắt buộc chọn nhân viên
- Bắt buộc chọn trạng thái

## Tích Hợp Với Payroll

Khi tính lương (sẽ implement sau), hệ thống sẽ:

1. Lấy tất cả attendance records của nhân viên trong tháng
2. Tính tổng số ngày công:
   ```
   Tổng ngày công = (Số ngày PRESENT × 1) + (Số ngày HALF_DAY × 0.5)
   ```
3. Tính lương theo công thức:
   ```
   Lương = (Lương tháng / Số ngày công chuẩn) × Số ngày công thực tế
   ```

## API Examples

### Chấm Công
```bash
POST /api/v1/attendance
Content-Type: application/json

{
  "userId": "uuid",
  "date": "2024-01-15",
  "status": "PRESENT",
  "checkIn": "2024-01-15T08:00:00.000Z",
  "checkOut": "2024-01-15T17:00:00.000Z",
  "notes": "Làm việc bình thường"
}
```

### Lấy Chấm Công Tháng 1/2024
```bash
GET /api/v1/attendance?month=1&year=2024&limit=100
```

### Lấy Chấm Công Của 1 Nhân Viên
```bash
GET /api/v1/attendance?userId=uuid&month=1&year=2024
```

## Troubleshooting

### Lỗi: "Property 'attendance' does not exist"
**Giải pháp:**
```bash
npx prisma generate
npm run dev
```

### Không thấy nhân viên trong dropdown
**Giải pháp:** Tạo user với role STAFF hoặc DOCTOR

### Lỗi: "Attendance already exists"
**Giải pháp:** Sử dụng chức năng "Sửa" thay vì tạo mới

## Next Steps

Sau khi hoàn thành Attendance Management, tiếp theo sẽ implement:

1. **Payroll Management** - Tính lương dựa trên chấm công
2. **Attendance Report** - Báo cáo chấm công chi tiết
3. **Bulk Operations** - Chấm công hàng loạt
4. **Export/Import** - Xuất/nhập Excel

## Files Created

```
app/api/v1/attendance/
├── route.ts                          # GET, POST
└── [id]/route.ts                     # GET, PUT, DELETE

components/admin/salary/
├── AttendanceManagement.tsx          # Main component
├── MarkAttendanceDialog.tsx          # Mark attendance
└── EditAttendanceDialog.tsx          # Edit attendance

docs/
├── ATTENDANCE_MANAGEMENT.md          # Full documentation
└── ATTENDANCE_QUICK_START.md         # This file

messages/
└── vi.json                           # Vietnamese translations
```

## Permissions

- ✅ SUPER_ADMIN: Full access
- ✅ ADMIN: Full access
- ❌ STAFF/DOCTOR: No access
- ❌ CLIENT: No access

## Status: ✅ READY TO USE

Tính năng chấm công đã sẵn sàng sử dụng. Restart dev server và bắt đầu chấm công!
