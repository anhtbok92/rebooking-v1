# Cập Nhật Quản Lý Đặt Lịch - Table Layout

## Tổng Quan
Chuyển đổi giao diện quản lý đặt lịch trong admin từ card layout sang table layout để tiết kiệm không gian và dễ quản lý hơn.

## Thay Đổi

### 1. Component Mới: BookingTable
**File:** `components/admin/bookings/BookingTable.tsx`

Tạo component table mới để hiển thị danh sách booking với đầy đủ thông tin:

**Các cột trong table:**
1. **Dịch vụ** - Tên dịch vụ
2. **Khách hàng** - Tên và email khách hàng
3. **Liên hệ** - Số điện thoại
4. **Ngày** - Ngày đặt lịch (định dạng vi-VN)
5. **Giờ** - Giờ đặt lịch
6. **Giá** - Giá dịch vụ (định dạng VND)
7. **Trạng thái** - Dropdown để thay đổi trạng thái (PENDING/CONFIRMED/COMPLETED/CANCELLED)
8. **Thanh toán** - Phương thức thanh toán (Cash/Card)
9. **Ngày tạo** - Thời gian tạo booking (định dạng vi-VN)
10. **Thao tác** - Các nút hành động:
    - Xác nhận (chỉ hiện với PENDING bookings)
    - Tải hóa đơn (Download icon)
    - Xóa (Trash icon với confirm dialog)

**Tính năng:**
- Hiển thị tất cả thông tin trong một hàng gọn gàng
- Status badge với màu sắc phân biệt
- Dropdown để thay đổi trạng thái trực tiếp
- Các nút action nhỏ gọn với icon
- Confirm dialog khi xóa booking
- Hỗ trợ định dạng tiền tệ VND
- Responsive và dễ đọc

### 2. Cập Nhật BookingTabs
**File:** `components/admin/bookings/BookingTabs.tsx`

**Thay đổi:**
- Thay thế `BookingCard` bằng `BookingTable`
- Xóa logic render grid/list layout
- Xóa prop `viewMode` không còn cần thiết
- Giữ nguyên logic phân trang và tabs

**Trước:**
```tsx
<div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
  {bookings.map((booking) => (
    <BookingCard ... />
  ))}
</div>
```

**Sau:**
```tsx
<BookingTable
  bookings={bookings}
  onStatusChange={onStatusChange}
  onDownloadReceipt={onDownloadReceipt}
  onDelete={onDelete}
  showConfirmButton={showConfirmButton}
  currency={currency}
/>
```

### 3. Cập Nhật BookingsManagement
**File:** `components/admin/BookingsManagement.tsx`

**Thay đổi:**
- Xóa state `viewMode`
- Xóa `setViewMode` khỏi handleReset
- Xóa prop `viewMode` và `onViewModeChange` khi gọi BookingFilters
- Xóa prop `viewMode` khi gọi BookingTabs

### 4. Cập Nhật BookingFilters
**File:** `components/admin/bookings/BookingFilters.tsx`

**Thay đổi:**
- Xóa props `viewMode` và `onViewModeChange`
- Xóa toggle buttons cho List/Grid view
- Giữ lại Sort dropdown và Reset button

**Trước:**
```tsx
<div className="flex gap-1 border rounded-lg p-1">
  <Button variant={viewMode === "list" ? "default" : "ghost"} ...>
    <List className="w-4 h-4" />
  </Button>
  <Button variant={viewMode === "grid" ? "default" : "ghost"} ...>
    <Grid3x3 className="w-4 h-4" />
  </Button>
</div>
```

**Sau:** (Đã xóa)

## Lợi Ích

### 1. Tiết Kiệm Không Gian
- Table layout hiển thị nhiều booking hơn trên một màn hình
- Không còn khoảng trống giữa các card
- Dễ dàng xem tổng quan toàn bộ bookings

### 2. Dễ Quản Lý
- Tất cả thông tin quan trọng hiển thị trong một hàng
- Dễ so sánh giữa các bookings
- Thao tác nhanh với các nút action gọn gàng

### 3. Giao Diện Chuyên Nghiệp
- Layout chuẩn cho admin dashboard
- Dễ đọc và dễ sử dụng
- Phù hợp với các hệ thống quản lý

### 4. Hiệu Suất
- Render ít DOM elements hơn so với card layout
- Load nhanh hơn với nhiều bookings

## Cấu Trúc Table

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Dịch vụ    │ Khách hàng      │ Liên hệ    │ Ngày       │ Giờ     │ Giá        │ Trạng thái │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Chăm sóc   │ Nguyễn Văn A    │ 0987654321 │ 10/02/2026 │ 10:00AM │ 599,000 đ  │ [Dropdown] │
│ da         │ email@gmail.com │            │            │         │            │            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Thanh toán │ Ngày tạo                    │ Thao tác                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Cash]     │ 08/02/2026 14:30:00         │ [✓ Xác nhận] [↓ Tải] [🗑 Xóa]                   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Tính Năng Giữ Nguyên

✅ Tabs: New / Pending / Completed / All
✅ Phân trang cho mỗi tab
✅ Sắp xếp theo ngày/giá
✅ Thay đổi trạng thái booking
✅ Tải hóa đơn PDF
✅ Xóa booking với confirm dialog
✅ Hiển thị số lượng bookings trên mỗi tab
✅ Statistics cards ở trên cùng
✅ Hỗ trợ đa ngôn ngữ (i18n)
✅ Hỗ trợ định dạng tiền tệ VND

## Files Đã Thay Đổi

1. ✅ `components/admin/bookings/BookingTable.tsx` - NEW
2. ✅ `components/admin/bookings/BookingTabs.tsx` - UPDATED
3. ✅ `components/admin/BookingsManagement.tsx` - UPDATED
4. ✅ `components/admin/bookings/BookingFilters.tsx` - UPDATED

## Files Không Thay Đổi (Giữ Lại)

- `components/admin/bookings/BookingCard.tsx` - Có thể xóa nếu không dùng ở đâu khác
- `components/admin/bookings/BookingPagination.tsx` - Vẫn sử dụng
- `components/admin/bookings/BookingStatsCards.tsx` - Vẫn sử dụng

## Kiểm Tra

Tất cả files đã được kiểm tra và không có lỗi TypeScript:
- ✅ BookingsManagement.tsx
- ✅ BookingTabs.tsx
- ✅ BookingTable.tsx
- ✅ BookingFilters.tsx

## Hướng Dẫn Sử Dụng

1. Truy cập trang Admin Dashboard
2. Vào phần "Quản lý đặt lịch"
3. Xem danh sách bookings dạng table
4. Sử dụng tabs để lọc theo trạng thái
5. Click vào dropdown "Trạng thái" để thay đổi
6. Click icon Download để tải hóa đơn
7. Click icon Trash để xóa booking (có confirm)
8. Sử dụng pagination ở dưới table để xem thêm

## Responsive Design

Table được thiết kế responsive với:
- Scroll ngang trên màn hình nhỏ
- Các cột quan trọng luôn hiển thị
- Text truncate cho nội dung dài
- Buttons nhỏ gọn với icons

## Tương Lai

Có thể cải thiện thêm:
- [ ] Thêm filter theo ngày
- [ ] Thêm search theo tên khách hàng
- [ ] Export to Excel/CSV
- [ ] Bulk actions (chọn nhiều bookings)
- [ ] Inline editing
- [ ] Drag & drop để sắp xếp
