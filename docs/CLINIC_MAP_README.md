# Clinic Map Feature - Tính Năng Bản Đồ Phòng Khám

## Tổng Quan
Tính năng cho phép khách hàng xem địa chỉ phòng khám trên bản đồ và Admin có thể cấu hình thông tin địa chỉ.

## Tính Năng

### 1. Xem Địa Chỉ Phòng Khám (Customer)
- Click icon MapPin ở header HomePage
- Hiển thị dialog với thông tin:
  - Địa chỉ đầy đủ
  - Số điện thoại (có thể gọi trực tiếp)
  - Email (có thể gửi email trực tiếp)
  - Bản đồ Google Maps (nếu có tọa độ)
  - Nút "Mở trong Google Maps"

### 2. Cấu Hình Địa Chỉ (Admin)
- Vào Admin Panel → Settings
- Phần "Địa Chỉ Phòng Khám"
- Nhập thông tin:
  - Địa chỉ (bắt buộc)
  - Vĩ độ (Latitude) - tùy chọn
  - Kinh độ (Longitude) - tùy chọn
  - Số điện thoại - tùy chọn
  - Email - tùy chọn
- Click "Lưu địa chỉ"

## Components

### ClinicMapDialog
Component hiển thị dialog với thông tin địa chỉ phòng khám

**Props:**
- `open: boolean` - Trạng thái mở/đóng dialog
- `onOpenChange: (open: boolean) => void` - Callback khi thay đổi trạng thái

**Features:**
- Hiển thị địa chỉ, phone, email
- Embed Google Maps (nếu có tọa độ)
- Nút mở trong Google Maps
- Click phone để gọi
- Click email để gửi mail
- Loading state
- Empty state

### SettingsManagement (Updated)
Thêm phần cấu hình địa chỉ phòng khám

**New Fields:**
- Address input
- Latitude input (number)
- Longitude input (number)
- Phone input
- Email input
- Save button

## API Endpoints

### GET /api/v1/settings/clinic-address
Lấy thông tin địa chỉ phòng khám (Public - No auth required)

**Response:**
```json
{
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "phone": "0123456789",
  "email": "contact@clinic.com"
}
```

### PUT /api/v1/settings/clinic-address
Cập nhật thông tin địa chỉ (Admin only)

**Request Body:**
```json
{
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "phone": "0123456789",
  "email": "contact@clinic.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "...",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "phone": "...",
    "email": "..."
  }
}
```

## Database

### SystemSettings Model
Sử dụng model có sẵn để lưu settings

**Key:** `clinic_address`

**Value:** JSON string
```json
{
  "address": "...",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "phone": "...",
  "email": "..."
}
```

## SWR Hooks

### useClinicAddress()
Hook để fetch thông tin địa chỉ phòng khám

```typescript
import { useClinicAddress } from '@/lib/swr'

const { data, isLoading, error } = useClinicAddress()
```

### updateClinicAddress()
Function để cập nhật địa chỉ

```typescript
import { updateClinicAddress } from '@/lib/swr'

await updateClinicAddress({
  address: "...",
  latitude: 10.762622,
  longitude: 106.660172,
  phone: "...",
  email: "..."
})
```

## Google Maps Integration

### Embed Map
Sử dụng Google Maps Embed API để hiển thị bản đồ trong dialog

**Requirements:**
- Cần Google Maps API Key
- Set trong `.env`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

**URL Format:**
```
https://www.google.com/maps/embed/v1/place?key=API_KEY&q=LAT,LNG&zoom=15
```

### Open in Maps
Mở Google Maps trong tab mới

**With Coordinates:**
```
https://www.google.com/maps/search/?api=1&query=LAT,LNG
```

**With Address:**
```
https://www.google.com/maps/search/?api=1&query=ADDRESS
```

## Cách Lấy Tọa Độ GPS

### Từ Google Maps
1. Mở Google Maps
2. Tìm địa chỉ phòng khám
3. Click chuột phải vào vị trí
4. Click "Copy coordinates" hoặc xem ở URL
5. Format: `latitude, longitude`
6. VD: `10.762622, 106.660172`

### Từ Google Maps URL
URL có dạng: `https://www.google.com/maps/@10.762622,106.660172,15z`
- Latitude: `10.762622`
- Longitude: `106.660172`

## User Flow

### Customer View Address
1. Vào HomePage
2. Click icon MapPin (góc trên bên phải)
3. Dialog mở ra hiển thị thông tin
4. Xem địa chỉ, phone, email
5. Xem bản đồ (nếu có tọa độ)
6. Click "Mở trong Google Maps" để xem chi tiết
7. Click phone để gọi
8. Click email để gửi mail
9. Click X hoặc click outside để đóng

### Admin Configure Address
1. Login as Admin/Super Admin
2. Vào Admin Panel
3. Click tab "Settings"
4. Scroll xuống phần "Địa Chỉ Phòng Khám"
5. Nhập địa chỉ (bắt buộc)
6. Nhập tọa độ GPS (tùy chọn)
7. Nhập phone, email (tùy chọn)
8. Click "Lưu địa chỉ"
9. Toast hiển thị thành công
10. Khách hàng có thể xem ngay

## Features

### ✅ Implemented
- Public API endpoint để lấy địa chỉ
- Admin API endpoint để cập nhật
- SWR hooks cho data fetching
- ClinicMapDialog component
- Integration vào HomePage
- Admin UI để config
- Google Maps embed
- Click to call/email
- Loading & empty states
- Responsive design

### 🔮 Future Enhancements
- Multiple clinic locations
- Opening hours
- Photos gallery
- Directions from current location
- Street view integration
- Nearby landmarks
- Parking information
- Public transport info

## Files Created

### API
- `app/api/v1/settings/clinic-address/route.ts` - API endpoints

### Components
- `components/home/ClinicMapDialog.tsx` - Map dialog component

### Hooks
- `lib/swr/hooks/settings.ts` - SWR hooks for settings

### Modified Files
- `components/home/HomePage.tsx` - Added map button & dialog
- `components/admin/SettingsManagement.tsx` - Added address config UI
- `lib/swr/index.ts` - Export settings hooks

### Documentation
- `CLINIC_MAP_README.md` - This file

## Environment Variables

### Required (Optional)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Note:** Nếu không có API key, map sẽ không hiển thị nhưng các tính năng khác vẫn hoạt động bình thường.

## Testing

### Manual Testing Steps

#### Test Customer View
1. Chưa config địa chỉ:
   - Click MapPin icon
   - Verify: Hiển thị "Chưa có thông tin địa chỉ"
   
2. Đã config địa chỉ (không có tọa độ):
   - Click MapPin icon
   - Verify: Hiển thị địa chỉ, phone, email
   - Verify: Không hiển thị map embed
   - Click "Mở trong Google Maps"
   - Verify: Mở Google Maps search với địa chỉ
   
3. Đã config đầy đủ (có tọa độ):
   - Click MapPin icon
   - Verify: Hiển thị đầy đủ thông tin
   - Verify: Hiển thị map embed
   - Click "Mở trong Google Maps"
   - Verify: Mở Google Maps với tọa độ chính xác
   - Click phone number
   - Verify: Mở dialer
   - Click email
   - Verify: Mở email client

#### Test Admin Config
1. Login as Admin
2. Go to Settings
3. Scroll to "Địa Chỉ Phòng Khám"
4. Enter address (required)
5. Enter coordinates (optional)
6. Enter phone, email (optional)
7. Click "Lưu địa chỉ"
8. Verify: Toast success
9. Refresh page
10. Verify: Data persisted
11. Go to HomePage
12. Click MapPin
13. Verify: New data displayed

## Notes

- API endpoint `/api/v1/settings/clinic-address` là public
- Chỉ Admin/Super Admin mới có thể cập nhật
- Tọa độ GPS là optional nhưng recommended để hiển thị map chính xác
- Nếu không có tọa độ, "Mở trong Google Maps" sẽ search theo địa chỉ
- Phone và email có thể click để gọi/gửi mail trực tiếp
- Data được lưu trong SystemSettings table với key `clinic_address`
- Sử dụng Google Maps Embed API (cần API key)
- Mobile-first design với max-width 400px
