# Dịch Vụ Nổi Bật - Featured Services

## Tổng Quan
Phần "Dịch Vụ Nổi Bật" hiển thị 4 dịch vụ từ database, được cấu hình bởi admin.

## Tính Năng

### Hiển thị Dữ Liệu Thực
✅ Sử dụng `useServices()` hook để fetch dịch vụ từ API
✅ Giới hạn 4 dịch vụ cho trang chủ
✅ Hiển thị tên dịch vụ từ database
✅ Hiển thị giá dịch vụ (format VND)
✅ Hiển thị rating và số lượng đánh giá (nếu có)

### UI/UX
✅ Loading skeleton khi đang fetch dữ liệu
✅ Empty state khi chưa có dịch vụ
✅ Grid 2 cột responsive
✅ Hover effect (scale image)
✅ Gradient overlay cho text dễ đọc
✅ Material Icons cho rating stars

### Ảnh Dịch Vụ
⚠️ **Tạm thời sử dụng ảnh fake** (4 ảnh mẫu)
- Ảnh được rotate theo index của service
- Sẽ được thay thế bằng ảnh thật từ database sau

## API Endpoint
- `GET /api/v1/services?limit=4`

## Data Structure
```typescript
interface Service {
  id: string
  name: string          // Tên dịch vụ
  price: number         // Giá (VND)
  rating?: number       // Đánh giá trung bình (0-5)
  ratingsCount?: number // Số lượng đánh giá
}
```

## Format Giá
- Sử dụng `Intl.NumberFormat` với locale 'vi-VN'
- Format: "1.000.000 ₫"

## Cấu Hình Admin
Admin có thể:
- Thêm/sửa/xóa dịch vụ
- Đặt tên và giá
- Dịch vụ sẽ tự động hiển thị trên trang chủ

## TODO
- [ ] Thêm field `image` vào Service model
- [ ] Upload và lưu ảnh dịch vụ
- [ ] Thay thế fake images bằng ảnh thật
- [ ] Thêm link đến trang chi tiết dịch vụ
- [ ] Thêm nút "Đặt lịch ngay" cho từng dịch vụ
