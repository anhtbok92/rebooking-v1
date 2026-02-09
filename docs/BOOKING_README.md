# Mobile Booking - Đặt Lịch Hẹn

## Tổng Quan
Component MobileBooking tích hợp đầy đủ flow đặt lịch từ UI cũ vào mobile layout với giao diện tối ưu cho mobile.

## Tính Năng

### Flow Đặt Lịch (4 Bước)
1. **Chọn Dịch Vụ** - ServiceSelection component
2. **Chọn Ngày** - CalendarCard component  
3. **Chọn Giờ** - TimeSelection component
4. **Tải Ảnh** - PhotoUpload component (tùy chọn)

### UI/UX Mobile
✅ Full-screen dialog (90vh)
✅ Progress bar hiển thị bước hiện tại
✅ Nút Back để quay lại bước trước
✅ Nút Next/Tiếp theo để chuyển bước
✅ Auto-disable Next nếu chưa chọn
✅ Header với title và mô tả bước
✅ Smooth transitions

### Logic Kế Thừa
✅ Sử dụng `useBookingForm` hook từ SimpleBookingForm
✅ Tự động thêm vào cart khi chọn đủ (service + date + time)
✅ Toast notification khi thêm thành công
✅ Reset form sau khi thêm
✅ Kiểm tra slots đã full
✅ Disable dates đã full (6 bookings)

### Cart Integration
✅ Floating cart button (bottom-right)
✅ Badge hiển thị số lượng items
✅ Cart sidebar slide từ phải
✅ CartSummary component từ UI cũ
✅ Checkout flow giữ nguyên

## Cách Sử Dụng

### 1. Từ Quick Actions
Click icon "Đặt lịch" → Mở dialog → Chọn từ đầu

### 2. Từ Service Card
Click vào dịch vụ nổi bật → Mở dialog với service đã chọn sẵn

### 3. Flow Hoàn Chỉnh
```
User click "Đặt lịch"
  ↓
Bước 1: Chọn dịch vụ (ServiceSelection)
  ↓
Bước 2: Chọn ngày (CalendarCard)
  ↓
Bước 3: Chọn giờ (TimeSelection)
  ↓
Bước 4: Tải ảnh (PhotoUpload - optional)
  ↓
Auto add to cart
  ↓
Show cart button
  ↓
Click cart → CartSummary
  ↓
Checkout
```

## Components Được Tái Sử Dụng

### Từ SimpleBookingForm
- `useBookingForm` - Hook quản lý state
- `ServiceSelection` - Chọn dịch vụ
- `CalendarCard` - Chọn ngày
- `TimeSelection` - Chọn giờ
- `PhotoUpload` - Upload ảnh
- `CartSummary` - Giỏ hàng

### Từ hooks
- `useCart` - Redux cart management
- `useSession` - Authentication

## State Management

### Local State
- `step` - Bước hiện tại (1-4)
- `isCartOpen` - Trạng thái cart sidebar
- `bookingOpen` - Trạng thái booking dialog
- `selectedServiceId` - Service được chọn từ card

### Form State (từ useBookingForm)
- `selectedService` - Service ID
- `selectedDate` - Ngày đã chọn
- `selectedTime` - Giờ đã chọn
- `photos` - Ảnh đã upload
- `services` - Danh sách dịch vụ
- `timeSlots` - Khung giờ available
- `bookingCounts` - Số lượng booking mỗi ngày

## Validation

### Bước 1 (Service)
- Phải chọn service mới next được

### Bước 2 (Date)
- Phải chọn date mới next được
- Không next nếu tất cả slots đã full

### Bước 3 (Time)
- Phải chọn time mới next được
- Hiển thị warning nếu all slots booked

### Bước 4 (Photos)
- Optional, có thể skip

## Auto-Add to Cart
Khi user chọn đủ 3 thông tin:
1. Service
2. Date  
3. Time

→ Tự động add vào cart
→ Reset form
→ Quay về bước 1
→ Show cart button

## Cart Button
- Fixed position: bottom-right
- Z-index: 50 (trên dialog)
- Badge: số lượng items
- Click → Mở cart sidebar

## Cart Sidebar
- Full-width mobile (max 430px)
- Slide animation từ phải
- CartSummary component
- Checkout button
- Close button

## Responsive
- Max width: 430px
- Height: 90vh
- Centered on screen
- Scroll content area
- Fixed header & footer

## TODO
- [ ] Add loading states cho từng bước
- [ ] Add animation giữa các bước
- [ ] Add confirmation dialog trước khi close
- [ ] Add keyboard shortcuts (ESC to close)
- [ ] Add swipe gestures để chuyển bước
