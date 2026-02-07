# Rate Limiting - Xử Lý Lỗi "Too many booking attempts"

## Vấn Đề
Khi test đặt lịch nhiều lần trong thời gian ngắn, API sẽ trả về lỗi:
```json
{
  "error": "Too many booking attempts, please try again later",
  "retryAfter": 583
}
```

## Nguyên Nhân
- API có rate limiting để bảo vệ khỏi spam/abuse
- Giới hạn: **20 booking attempts trong 15 phút** (production)
- Trong development, bạn test nhiều lần nên bị chặn

## Giải Pháp Đã Implement

### 1. Tăng Limit Cho Development ✅
File: `lib/rate-limit.ts`

```typescript
export const bookingRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: process.env.NODE_ENV === 'development' ? 100 : 20,
  message: "Too many booking attempts, please try again later",
})
```

**Kết quả:**
- Development: 100 requests / 15 phút
- Production: 20 requests / 15 phút

### 2. Error Message Rõ Ràng ✅
File: `app/[locale]/checkout/page.tsx`

Hiển thị thời gian cần đợi:
```
"Too many booking attempts, please try again later. Vui lòng thử lại sau 10 phút."
```

## Cách Xử Lý Khi Bị Rate Limit

### Option 1: Đợi Hết Thời Gian (Khuyến nghị)
- Đợi 15 phút để rate limit reset
- Hoặc đợi theo `retryAfter` trong response

### Option 2: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

Rate limit store sẽ bị clear khi restart.

### Option 3: Thay Đổi IP (Tạm thời)
Rate limiting dựa trên IP address, nên:
- Tắt/bật WiFi
- Dùng VPN
- Dùng mobile hotspot

## Rate Limits Hiện Tại

| Endpoint | Development | Production | Window |
|----------|-------------|------------|--------|
| `/api/v1/bookings/bulk` | 100 | 20 | 15 min |
| `/api/v1/checkout` | 100 | 10 | 1 hour |
| `/api/auth/*` | 100 | 5 | 15 min |
| `/api/v1/*` (general) | 100 | 100 | 15 min |

## Testing Tips

### 1. Sử Dụng Mock Data
Thay vì gọi API thật, mock response:
```typescript
// For testing only
if (process.env.NODE_ENV === 'development') {
  // Mock success response
  return { success: true }
}
```

### 2. Test Với Ít Request
- Test flow 1-2 lần
- Verify logic
- Sau đó mới test nhiều lần

### 3. Clear Cart Sau Mỗi Test
Tránh tạo nhiều bookings không cần thiết.

## Production Considerations

### Rate Limiting Là Cần Thiết
- Bảo vệ khỏi spam/abuse
- Bảo vệ database khỏi overload
- Bảo vệ khỏi bot attacks

### Nên Giữ Nguyên Limits
- 20 bookings / 15 phút là hợp lý
- User thật không cần book nhiều hơn
- Nếu cần tăng, cân nhắc kỹ

### Sử Dụng Redis (Production)
File hiện tại dùng in-memory store:
```typescript
const store: RateLimitStore = {}
```

Trong production, nên dùng Redis:
- Persistent storage
- Shared across instances
- Better performance

## Troubleshooting

### Vẫn Bị Rate Limit Sau Khi Restart?
1. Check `NODE_ENV`:
```bash
echo $NODE_ENV
# Should be "development"
```

2. Clear browser cache
3. Check console logs

### Rate Limit Không Hoạt Động?
1. Check middleware có apply rate limit không
2. Check API route có import `bookingRateLimit` không
3. Check logs để xem identifier (IP)

## Summary

✅ **Đã fix:** Tăng limit lên 100 cho development
✅ **Đã fix:** Error message rõ ràng với thời gian đợi
✅ **Khuyến nghị:** Restart dev server nếu vẫn bị lỗi
✅ **Production:** Giữ nguyên limit 20/15min để bảo vệ API
