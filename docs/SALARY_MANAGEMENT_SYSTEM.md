# Hệ Thống Quản Lý Lương Thưởng

## Tổng Quan
Hệ thống quản lý lương thưởng cho nhân viên (STAFF và DOCTOR) với các tính năng:
- Cấu hình lương cứng, trợ cấp, hoa hồng
- Chấm công tự động/thủ công
- Tính lương theo ngày công
- Xuất phiếu lương PDF

## ✅ Đã Hoàn Thành

### 1. Database Schema
Đã thêm 3 models mới vào `prisma/schema.prisma`:
- `EmployeeSalary` - Cấu hình lương
- `Attendance` - Chấm công
- `Payroll` - Phiếu lương

### 2. API Routes
- ✅ `/api/v1/salary` - CRUD cấu hình lương
- ✅ `/api/v1/salary/[id]` - Chi tiết/cập nhật/xóa
- ✅ `/api/v1/payroll` - Tạo và quản lý phiếu lương
- ✅ `/api/v1/payroll/[id]/pdf` - Xuất PDF

### 3. Validation Schemas
Đã thêm vào `lib/validations/schemas.ts`:
- `createEmployeeSalarySchema`
- `updateEmployeeSalarySchema`
- `createAttendanceSchema`
- `getAttendanceQuerySchema`
- `generatePayrollSchema`
- `getPayrollQuerySchema`
- `updatePayrollStatusSchema`

### 4. UI Components
- ✅ `components/admin/SalaryManagement.tsx` - Main component
- ✅ `components/admin/salary/EmployeeSalaryList.tsx` - Danh sách lương
- ✅ `components/admin/salary/CreateSalaryDialog.tsx` - Dialog tạo mới
- ✅ `components/admin/salary/EditSalaryDialog.tsx` - Dialog chỉnh sửa
- ✅ `components/admin/salary/AttendanceManagement.tsx` - Placeholder chấm công
- ✅ `components/admin/salary/PayrollList.tsx` - Placeholder phiếu lương

### 5. Menu Integration
- ✅ Đã thêm vào `AdminDashboard.tsx` (cho ADMIN)
- ✅ Đã thêm vào `SuperAdminDashboard.tsx` (cho SUPER_ADMIN) ⭐
- ✅ Icon: `DollarSign`
- ✅ Vị trí: Sau "Referrals", trước "News"
- ✅ Translations (vi.json & en.json)

### 6. Dependencies
- ✅ `jspdf` - Tạo PDF
- ✅ `jspdf-autotable` - Bảng trong PDF

## Database Schema

### EmployeeSalary
Cấu hình lương cho từng nhân viên:
```prisma
model EmployeeSalary {
  id                  String   @id @default(uuid())
  userId              String   @unique
  baseSalary          Int      // Lương cứng (VND/tháng)
  allowance           Int      // Trợ cấp cố định (VND/tháng)
  commissionRate      Float    // % hoa hồng (0-100)
  workingDaysPerMonth Int      // Số ngày công chuẩn (mặc định 26)
  active              Boolean  @default(true)
}
```

### Attendance
Chấm công hàng ngày:
```prisma
model Attendance {
  id       String   @id @default(uuid())
  userId   String
  date     DateTime
  status   String   // PRESENT, ABSENT, HALF_DAY, LEAVE
  checkIn  DateTime?
  checkOut DateTime?
  notes    String?
}
```

### Payroll
Phiếu lương tháng:
```prisma
model Payroll {
  id                String   @id @default(uuid())
  userId            String
  month             Int      // 1-12
  year              Int
  workingDays       Int      // Số ngày công thực tế
  baseSalaryAmount  Int      // Lương cứng đã tính
  allowanceAmount   Int      // Trợ cấp đã tính
  commissionAmount  Int      // Hoa hồng đã tính
  totalRevenue      Int      // Tổng doanh thu
  totalAmount       Int      // Tổng lương
  bonus             Int      // Thưởng thêm
  deduction         Int      // Khấu trừ
  finalAmount       Int      // Thực nhận
  status            String   // PENDING, APPROVED, PAID
  paidAt            DateTime?
}
```

## API Endpoints

### Employee Salary
- `GET /api/v1/salary` - Lấy danh sách cấu hình lương
- `POST /api/v1/salary` - Tạo cấu hình lương mới
- `GET /api/v1/salary/[id]` - Lấy chi tiết cấu hình
- `PUT /api/v1/salary/[id]` - Cập nhật cấu hình
- `DELETE /api/v1/salary/[id]` - Xóa cấu hình

### Attendance
- `GET /api/v1/attendance` - Lấy danh sách chấm công
- `POST /api/v1/attendance` - Tạo bản ghi chấm công
- `PUT /api/v1/attendance/[id]` - Cập nhật chấm công
- `DELETE /api/v1/attendance/[id]` - Xóa bản ghi

### Payroll
- `GET /api/v1/payroll` - Lấy danh sách phiếu lương
- `POST /api/v1/payroll` - Tạo phiếu lương (tự động tính)
- `GET /api/v1/payroll/[id]` - Lấy chi tiết phiếu lương
- `PUT /api/v1/payroll/[id]` - Cập nhật phiếu lương
- `GET /api/v1/payroll/[id]/pdf` - Xuất PDF phiếu lương

## Công Thức Tính Lương

### 1. Lương Cứng
```
Lương cứng = (Lương cứng tháng / Số ngày công chuẩn) × Số ngày công thực tế
```

### 2. Trợ Cấp
```
Trợ cấp = (Trợ cấp tháng / Số ngày công chuẩn) × Số ngày công thực tế
```

### 3. Hoa Hồng
```
Hoa hồng = Tổng doanh thu × (% hoa hồng / 100)
```

Doanh thu tính từ các booking COMPLETED trong tháng mà nhân viên là `doctorId`.

### 4. Tổng Lương
```
Tổng lương = Lương cứng + Trợ cấp + Hoa hồng + Thưởng - Khấu trừ
```

## Quy Trình Tính Lương

1. **Chấm công hàng ngày**
   - Admin/Staff tự chấm công hoặc admin chấm công cho nhân viên
   - Trạng thái: PRESENT (1 ngày), HALF_DAY (0.5 ngày), ABSENT (0), LEAVE (0)

2. **Cuối tháng - Tạo phiếu lương**
   - Admin chọn nhân viên, tháng, năm
   - Hệ thống tự động:
     - Đếm số ngày công từ Attendance
     - Tính lương cứng theo tỷ lệ
     - Tính trợ cấp theo tỷ lệ
     - Tính hoa hồng từ doanh thu booking
   - Admin có thể thêm thưởng/khấu trừ
   - Tạo phiếu lương với status PENDING

3. **Duyệt lương**
   - Admin xem xét và chuyển status sang APPROVED

4. **Thanh toán**
   - Sau khi thanh toán, chuyển status sang PAID
   - Ghi nhận thời gian thanh toán (paidAt)

5. **Xuất PDF**
   - Xuất phiếu lương PDF để gửi cho nhân viên
   - Có thể in hoặc gửi email

## Components

### Admin Components
```
components/admin/
├── SalaryManagement.tsx          # Main component với tabs
├── salary/
│   ├── EmployeeSalaryList.tsx    # Danh sách cấu hình lương
│   ├── CreateSalaryDialog.tsx    # Dialog tạo cấu hình
│   ├── EditSalaryDialog.tsx      # Dialog sửa cấu hình
│   ├── AttendanceManagement.tsx  # Quản lý chấm công
│   ├── AttendanceCalendar.tsx    # Lịch chấm công
│   ├── PayrollList.tsx           # Danh sách phiếu lương
│   ├── GeneratePayrollDialog.tsx # Dialog tạo phiếu lương
│   └── PayrollDetailDialog.tsx   # Chi tiết phiếu lương
```

### Các Component Cần Tạo Thêm

#### EditSalaryDialog.tsx
Tương tự CreateSalaryDialog nhưng có sẵn data và gọi PUT API.

#### AttendanceManagement.tsx
- Hiển thị lịch tháng
- Chọn nhân viên
- Chấm công cho từng ngày
- Xem lịch sử chấm công

#### AttendanceCalendar.tsx
- Calendar view với màu sắc theo status
- Click vào ngày để chấm công
- Hiển thị tổng số ngày công

#### PayrollList.tsx
- Bảng danh sách phiếu lương
- Filter theo tháng/năm/nhân viên/status
- Nút tạo phiếu lương mới
- Nút xuất PDF
- Nút duyệt/thanh toán

#### GeneratePayrollDialog.tsx
- Form chọn nhân viên, tháng, năm
- Hiển thị preview số ngày công
- Nhập thưởng/khấu trừ
- Ghi chú
- Tạo phiếu lương

#### PayrollDetailDialog.tsx
- Hiển thị chi tiết phiếu lương
- Breakdown từng khoản
- Nút xuất PDF
- Nút duyệt/thanh toán (nếu có quyền)

## PDF Template

Phiếu lương PDF bao gồm:
- Header: Logo, tên công ty
- Tiêu đề: "PHIẾU LƯƠNG" + Tháng/Năm
- Thông tin nhân viên: Họ tên, email, chức vụ, SĐT
- Bảng chi tiết:
  - Lương cơ bản
  - Trợ cấp
  - Hoa hồng (% + doanh thu)
  - Số ngày công
  - Thưởng (nếu có)
  - Khấu trừ (nếu có)
  - **TỔNG THỰC NHẬN**
- Ghi chú (nếu có)
- Chữ ký: Người nhận, Người duyệt
- Footer: Ngày in

## Permissions

Chỉ ADMIN và SUPER_ADMIN có quyền:
- Xem/tạo/sửa/xóa cấu hình lương
- Chấm công cho nhân viên
- Tạo/duyệt/thanh toán phiếu lương
- Xuất PDF

STAFF và DOCTOR có thể:
- Xem phiếu lương của mình
- Tự chấm công (nếu được cấu hình)

## Migration

Chạy migration để tạo tables:
```bash
npx prisma migrate dev --name add_salary_management
npx prisma generate
```

## Dependencies

Đã cài đặt:
```json
{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2"
}
```

## TODO

- [ ] Tạo các component còn lại
- [ ] Thêm API cho Attendance
- [ ] Thêm validation cho dates
- [ ] Thêm email notification khi có phiếu lương mới
- [ ] Thêm dashboard thống kê lương
- [ ] Thêm export Excel
- [ ] Thêm tính năng tạo phiếu lương hàng loạt
- [ ] Thêm lịch sử thay đổi lương
- [ ] Thêm báo cáo chi phí nhân sự theo tháng/quý/năm

## Notes

- Số ngày công chuẩn mặc định là 26 ngày/tháng
- Hoa hồng chỉ tính từ booking COMPLETED
- Phiếu lương không thể sửa sau khi đã PAID
- Attendance unique theo userId + date (1 nhân viên chỉ 1 bản ghi/ngày)
- Payroll unique theo userId + month + year (1 nhân viên chỉ 1 phiếu lương/tháng)
