# Fix: Hiển Thị Thông Tin Bác Sĩ Trong Bookings

## Vấn Đề
Mặc dù user đã chọn bác sĩ khi đặt lịch, thông tin bác sĩ không hiển thị ở:
- Admin - Quản lý đặt lịch (BookingTable)
- Home - Lịch đặt gần đây (HomePage)
- Màn lịch hẹn (AppointmentsPage)
- Chi tiết booking (BookingDetailsDialog)

## Nguyên Nhân
1. **Bulk Booking API** không lưu `doctorId` khi tạo booking (thanh toán tiền mặt)
2. **Validation Schema** `cartItemSchema` không có field `doctorId`
3. **Local Storage Cart** type không có `doctorId` cho guest users
4. **Single Booking API** không include `doctor` relation khi fetch

## Giải Pháp

### 1. Cập Nhật Validation Schema
**File: `lib/validations/schemas.ts`**

```typescript
export const cartItemSchema = z.object({
  serviceId: z.string().uuid(),
  serviceName: z.string().min(1),
  date: z.string(),
  time: z.string().min(1),
  price: z.number().positive(),
  photos: z.array(z.string().url()).optional(),
  doctorId: z.string().uuid().optional(), // ✅ THÊM MỚI
})
```

### 2. Cập Nhật Bulk Booking API
**File: `app/api/v1/bookings/bulk/route.ts`**

```typescript
prisma.booking.create({
  data: {
    serviceId: item.serviceId,
    date: new Date(item.date),
    time: item.time,
    paymentMethod,
    userName,
    phone,
    email: finalEmail,
    userId: finalUserId,
    doctorId: item.doctorId || null, // ✅ THÊM MỚI
    photos: {...},
  },
  include: {
    service: true,
    photos: true,
    doctor: { // ✅ THÊM MỚI
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
  },
})
```

### 3. Cập Nhật Local Storage Cart Type
**File: `lib/local-storage-cart.ts`**

```typescript
export type LocalStorageCartItem = {
  id: string
  serviceId: string
  serviceName: string
  price: number
  date: string
  time: string
  photos: string[]
  doctorId?: string // ✅ THÊM MỚI
}
```

### 4. Cập Nhật Single Booking API
**File: `app/api/v1/bookings/[id]/route.ts`**

Thêm `doctor` relation vào tất cả các query (GET, PATCH, PUT):

```typescript
include: {
  service: true,
  photos: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  },
  doctor: { // ✅ THÊM MỚI
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
}
```

### 5. Cập Nhật BookingDetailsDialog
**File: `components/bookings/BookingDetailsDialog.tsx`**

- Xóa code fetch doctor info riêng (useState, useEffect)
- Sử dụng `booking.doctor` trực tiếp từ props

## Flow Hoàn Chỉnh

1. **MobileBooking** → User chọn bác sĩ → `addToCart({ doctorId })`
2. **use-redux-cart** → Gửi `doctorId` lên `/api/v1/cart`
3. **Cart API** → Lưu `doctorId` vào database (Cart table)
4. **Checkout Page** → Gửi cart items (có `doctorId`) lên API
5. **Bulk Booking API** → Tạo booking với `doctorId` ✅
6. **Checkout API (Stripe)** → Tạo booking với `doctorId` ✅
7. **Bookings API** → Trả về booking kèm `doctor` info ✅
8. **UI Components** → Hiển thị thông tin bác sĩ ✅

## Kết Quả
✅ Thông tin bác sĩ được lưu khi đặt lịch (cả cash và Stripe)
✅ API trả về đầy đủ thông tin doctor (id, name, email, phone)
✅ UI hiển thị "Chưa chỉ định" khi booking chưa có bác sĩ
✅ Guest users cũng có thể chọn bác sĩ (lưu trong localStorage)
