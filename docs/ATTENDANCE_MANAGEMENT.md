# Attendance Management - Quản Lý Chấm Công

## Tổng Quan

Hệ thống quản lý chấm công cho phép Super Admin theo dõi và quản lý chấm công của nhân viên (STAFF và DOCTOR).

## Tính Năng

### 1. Chấm Công
- Chấm công cho nhân viên theo ngày
- Hỗ trợ 4 trạng thái:
  - **Có mặt (PRESENT)**: Nhân viên có mặt đầy đủ
  - **Vắng (ABSENT)**: Nhân viên vắng mặt
  - **Nửa ngày (HALF_DAY)**: Nhân viên làm nửa ngày
  - **Nghỉ phép (LEAVE)**: Nhân viên nghỉ phép có phép

### 2. Ghi Nhận Giờ Làm
- Check-in: Giờ vào làm
- Check-out: Giờ ra về
- Chỉ áp dụng cho trạng thái "Có mặt"

### 3. Lọc và Tìm Kiếm
- Lọc theo nhân viên
- Lọc theo tháng/năm
- Xem tất cả hoặc từng nhân viên

### 4. Thống Kê
- Tổng số ngày có mặt
- Tổng số ngày vắng
- Tổng số ngày nửa ngày
- Tổng số ngày nghỉ phép

### 5. Quản Lý
- Sửa bản ghi chấm công
- Xóa bản ghi chấm công
- Thêm ghi chú cho mỗi bản ghi

## Database Schema

### Model: Attendance

```prisma
model Attendance {
    id          String   @id @default(uuid())
    userId      String
    user        User     @relation("EmployeeAttendance", fields: [userId], references: [id], onDelete: Cascade)
    date        DateTime
    status      String   // PRESENT, ABSENT, HALF_DAY, LEAVE
    checkIn     DateTime?
    checkOut    DateTime?
    notes       String?
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    @@unique([userId, date])
    @@index([userId])
    @@index([date])
}
```

**Constraints:**
- Mỗi nhân viên chỉ có 1 bản ghi chấm công cho mỗi ngày (unique constraint)
- Tự động xóa khi user bị xóa (onDelete: Cascade)

## API Endpoints

### GET /api/v1/attendance
Lấy danh sách chấm công

**Query Parameters:**
- `userId` (optional): Filter theo user ID
- `startDate` (optional): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (optional): Ngày kết thúc (YYYY-MM-DD)
- `month` (optional): Tháng (1-12)
- `year` (optional): Năm (2020+)
- `page` (default: 1): Trang
- `limit` (default: 31): Số bản ghi mỗi trang

**Response:**
```json
{
  "attendances": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "name": "Nguyễn Văn A",
        "email": "a@example.com",
        "role": "STAFF"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "status": "PRESENT",
      "checkIn": "2024-01-15T08:00:00.000Z",
      "checkOut": "2024-01-15T17:00:00.000Z",
      "notes": "Làm việc bình thường",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 31,
    "page": 1,
    "limit": 31,
    "pages": 1
  }
}
```

### POST /api/v1/attendance
Tạo bản ghi chấm công mới

**Request Body:**
```json
{
  "userId": "uuid",
  "date": "2024-01-15",
  "status": "PRESENT",
  "checkIn": "2024-01-15T08:00:00.000Z",
  "checkOut": "2024-01-15T17:00:00.000Z",
  "notes": "Làm việc bình thường"
}
```

**Response:** Attendance object (201 Created)

### GET /api/v1/attendance/[id]
Lấy chi tiết 1 bản ghi chấm công

**Response:** Attendance object

### PUT /api/v1/attendance/[id]
Cập nhật bản ghi chấm công

**Request Body:**
```json
{
  "status": "HALF_DAY",
  "checkIn": "2024-01-15T08:00:00.000Z",
  "checkOut": "2024-01-15T12:00:00.000Z",
  "notes": "Nghỉ buổi chiều"
}
```

**Response:** Updated attendance object

### DELETE /api/v1/attendance/[id]
Xóa bản ghi chấm công

**Response:**
```json
{
  "message": "Attendance deleted successfully"
}
```

## Components

### AttendanceManagement
Component chính để quản lý chấm công

**Location:** `components/admin/salary/AttendanceManagement.tsx`

**Features:**
- Filters (nhân viên, tháng, năm)
- Statistics cards
- Attendance list
- Mark/Edit/Delete actions

### MarkAttendanceDialog
Dialog để chấm công mới

**Location:** `components/admin/salary/MarkAttendanceDialog.tsx`

**Props:**
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `selectedDate`: Date | null
- `employees`: User[]
- `onSuccess`: () => void

### EditAttendanceDialog
Dialog để sửa chấm công

**Location:** `components/admin/salary/EditAttendanceDialog.tsx`

**Props:**
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `attendance`: Attendance
- `onSuccess`: () => void

## Validation

### createAttendanceSchema
```typescript
{
  userId: string (uuid),
  date: string (YYYY-MM-DD),
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE",
  checkIn: string (ISO datetime, optional),
  checkOut: string (ISO datetime, optional),
  notes: string (max 500 chars, optional)
}
```

### getAttendanceQuerySchema
```typescript
{
  userId: string (uuid, optional),
  startDate: string (YYYY-MM-DD, optional),
  endDate: string (YYYY-MM-DD, optional),
  month: number (1-12, optional),
  year: number (2020+, optional),
  page: number (default: 1),
  limit: number (default: 31, max: 100)
}
```

## Quy Trình Sử Dụng

### 1. Chấm Công Hàng Ngày
1. Vào tab "Chấm Công" trong menu "Lương Thưởng"
2. Click "Chấm Công Hôm Nay"
3. Chọn nhân viên
4. Chọn trạng thái
5. Nhập giờ vào/ra (nếu có mặt)
6. Thêm ghi chú (nếu cần)
7. Click "Chấm Công"

### 2. Xem Chấm Công Theo Tháng
1. Chọn tháng và năm từ dropdown
2. Chọn nhân viên (hoặc xem tất cả)
3. Xem danh sách và thống kê

### 3. Sửa Chấm Công
1. Tìm bản ghi cần sửa
2. Click "Sửa"
3. Cập nhật thông tin
4. Click "Lưu Thay Đổi"

### 4. Xóa Chấm Công
1. Tìm bản ghi cần xóa
2. Click "Xóa"
3. Xác nhận xóa

## Tính Lương Dựa Trên Chấm Công

Khi tính lương (Payroll), hệ thống sẽ:

1. Đếm số ngày công thực tế:
   - PRESENT = 1 ngày
   - HALF_DAY = 0.5 ngày
   - ABSENT = 0 ngày
   - LEAVE = 0 ngày (có thể điều chỉnh tùy chính sách)

2. Tính lương theo công thức:
   ```
   Lương cơ bản = (Lương tháng / Số ngày công chuẩn) × Số ngày công thực tế
   Trợ cấp = (Trợ cấp tháng / Số ngày công chuẩn) × Số ngày công thực tế
   ```

## Permissions

- **SUPER_ADMIN**: Full access (CRUD)
- **ADMIN**: Full access (CRUD)
- **STAFF/DOCTOR**: Không có quyền truy cập
- **CLIENT**: Không có quyền truy cập

## Notes

- Mỗi nhân viên chỉ có thể có 1 bản ghi chấm công cho mỗi ngày
- Không thể chấm công cho ngày trong tương lai (có thể thêm validation)
- Check-in/Check-out chỉ áp dụng cho trạng thái "Có mặt"
- Ghi chú có thể dùng để giải thích lý do vắng, nghỉ phép, v.v.

## Troubleshooting

### Lỗi: "Attendance already exists for this date"
**Nguyên nhân:** Đã có bản ghi chấm công cho nhân viên này vào ngày này

**Giải pháp:** Sử dụng chức năng "Sửa" thay vì tạo mới

### Lỗi: "Property 'attendance' does not exist on type 'PrismaClient'"
**Nguyên nhân:** Prisma client chưa được generate sau khi thêm model mới

**Giải pháp:**
```bash
npx prisma generate
# Restart dev server
npm run dev
```

### Không thấy nhân viên trong dropdown
**Nguyên nhân:** Chưa có nhân viên với role STAFF hoặc DOCTOR

**Giải pháp:** Tạo user với role STAFF hoặc DOCTOR trong User Management

## Future Enhancements

- [ ] Bulk attendance marking (chấm công hàng loạt)
- [ ] Import/Export attendance từ Excel
- [ ] Attendance report (báo cáo chấm công)
- [ ] Auto check-in/check-out với QR code
- [ ] Mobile app cho nhân viên tự chấm công
- [ ] Geolocation verification
- [ ] Face recognition check-in
- [ ] Overtime tracking (theo dõi làm thêm giờ)
- [ ] Leave request workflow (quy trình xin nghỉ phép)
