# Salary Management - Troubleshooting

## Lỗi: "salaries.map is not a function"

### Nguyên nhân
- Prisma client chưa được generate với models mới
- Database chưa được sync
- Dev server đang cache code cũ

### Giải pháp

#### 1. Stop Dev Server
Dừng dev server hiện tại (Ctrl+C)

#### 2. Generate Prisma Client
```bash
npx prisma generate
```

Nếu gặp lỗi EPERM (permission denied), thử:
- Đóng tất cả terminal/IDE đang mở project
- Xóa folder `node_modules/.prisma`
- Chạy lại `npx prisma generate`

#### 3. Push Database Schema
```bash
npx prisma db push
```

#### 4. Restart Dev Server
```bash
npm run dev
```

## Kiểm tra API

### Test API trực tiếp
Mở browser console và chạy:

```javascript
// Test GET salaries
fetch('/api/v1/salary')
  .then(r => r.json())
  .then(console.log)

// Kiểm tra response format
// Phải là array: []
// Không phải object: {}
```

### Kiểm tra Database
```bash
npx prisma studio
```

Mở Prisma Studio và kiểm tra:
- Table `EmployeeSalary` đã tồn tại chưa
- Table `Attendance` đã tồn tại chưa
- Table `Payroll` đã tồn tại chưa

## Lỗi khác

### "Module not found: Can't resolve './EditSalaryDialog'"
**Giải pháp:** File đã được tạo, restart dev server

### "Prisma Client validation error"
**Giải pháp:** 
```bash
npx prisma generate
npm run dev
```

### "Cannot find module '@prisma/client'"
**Giải pháp:**
```bash
npm install @prisma/client
npx prisma generate
```

### "Không có nhân viên trong dropdown khi tạo cấu hình lương"

**Nguyên nhân:**
- API `/api/v1/admin/users` chỉ hỗ trợ 1 role filter duy nhất
- Không thể query `?role=STAFF&role=DOCTOR` cùng lúc

**Giải pháp:**
- Fetch tất cả users: `/api/v1/admin/users?limit=100`
- Filter client-side cho STAFF và DOCTOR roles
- Đã fix trong `CreateSalaryDialog.tsx`

**Code đã fix:**
```typescript
// Fetch all users
const { data: usersData, isLoading } = useSWR("/api/v1/admin/users?limit=100", fetcher)

// Filter client-side
const employees = usersData?.users?.filter((u: any) => 
  ["STAFF", "DOCTOR"].includes(u.role)
) || []
```

## Xác nhận Setup Thành Công

Sau khi fix, bạn sẽ thấy:
1. Menu "Lương Thưởng" trong SuperAdmin dashboard
2. 3 tabs: Cấu Hình Lương, Chấm Công, Phiếu Lương
3. Tab "Cấu Hình Lương" hiển thị bảng trống hoặc danh sách
4. Nút "Thêm Mới" hoạt động

## Debug Mode

Thêm vào `components/admin/salary/EmployeeSalaryList.tsx`:

```typescript
console.log("Salaries data:", data)
console.log("Is array?", Array.isArray(data))
console.log("Error:", error)
```

Kiểm tra browser console để xem data format.
