# Rate Limiting - Xử Lý Lỗi Rate Limit

## ✅ Đã Cập Nhật - Tăng Limits Cho Development

### Vấn Đề
Khi test đăng ký, đăng nhập, đặt lịch nhiều lần trong development, API trả về lỗi:
```json
{
  "error": "Too many authentication attempts, please try again later",
  "retryAfter": 470
}
```

### Nguyên Nhân
- API có rate limiting để bảo vệ khỏi spam/abuse
- Limits quá nghiêm ngặt cho development testing
- Trong development, cần test nhiều lần

## Giải Pháp Đã Implement

### 1. Tăng Limits Cho Tất Cả Endpoints ✅

File: `lib/rate-limit.ts`

#### Authentication (Login, Register, Password Reset)
```typescript
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: process.env.NODE_ENV === 'development' ? 50 : 5,
  message: "Too many authentication attempts, please try again later",
})
```

#### Checkout
```typescript
export const checkoutRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: process.env.NODE_ENV === 'development' ? 50 : 10,
  message: "Too many checkout attempts, please try again later",
})
```

#### Booking
```typescript
export const bookingRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: process.env.NODE_ENV === 'development' ? 100 : 20,
  message: "Too many booking attempts, please try again later",
})
```

#### Rating
```typescript
export const ratingRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: process.env.NODE_ENV === 'development' ? 50 : 10,
  message: "Too many rating submissions, please try again later",
})
```

## Rate Limits Hiện Tại

| Endpoint | Development | Production | Window |
|----------|-------------|------------|--------|
| **Auth** (login/register) | **50** | 5 | 15 min |
| **Checkout** | **50** | 10 | 1 hour |
| **Booking** | **100** | 20 | 15 min |
| **Rating** | **50** | 10 | 1 hour |
| **API General** | 100 | 100 | 15 min |

## Cách Xử Lý Khi Bị Rate Limit

### Option 1: Restart Dev Server (Khuyến nghị)
```bash
# Stop server (Ctrl+C)
npm run dev
```
Rate limit store sẽ bị clear khi restart.

### Option 2: Đợi Hết Thời Gian
- Đợi theo `retryAfter` trong response (tính bằng giây)
- Hoặc đợi hết time window (15 phút hoặc 1 giờ)

### Option 3: Thay Đổi IP (Tạm thời)
Rate limiting dựa trên IP address:
- Tắt/bật WiFi
- Dùng VPN
- Dùng mobile hotspot

## Testing Tips

### 1. Restart Server Khi Cần
Nếu test nhiều lần và bị rate limit, restart server là cách nhanh nhất.

### 2. Test Có Kế Hoạch
- Test flow 1-2 lần để verify logic
- Sau đó mới test nhiều lần
- Tránh spam requests không cần thiết

### 3. Check NODE_ENV
Đảm bảo đang chạy development mode:
```bash
echo $NODE_ENV
# Should be "development"
```

### 4. Monitor Rate Limit Headers
Response headers cho biết thông tin rate limit:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When the limit resets
- `Retry-After`: Seconds until you can retry

## Production Considerations

### Tại Sao Cần Rate Limiting?

1. **Security**: Prevent brute force attacks
2. **Resource Protection**: Prevent API abuse
3. **Fair Usage**: Ensure all users get fair access
4. **Cost Control**: Limit expensive operations

### Production Limits Là Hợp Lý

- **Auth (5/15min)**: Đủ cho user thật, chặn brute force
- **Checkout (10/hour)**: User thật không cần checkout nhiều hơn
- **Booking (20/15min)**: Đủ cho use case thông thường
- **Rating (10/hour)**: Chặn spam ratings

### Nâng Cấp Cho Production Scale

Nếu traffic cao, nên dùng Redis thay vì in-memory:

```typescript
import Redis from 'ioredis'
const redis = new Redis()

// Store rate limit data in Redis
// Allows rate limiting across multiple server instances
// Persistent and scalable
```

## Troubleshooting

### Vẫn Bị Rate Limit Sau Khi Restart?

1. **Check NODE_ENV:**
   ```bash
   echo $NODE_ENV
   # Must be "development"
   ```

2. **Clear browser cache và cookies**

3. **Check console logs** để xem identifier (IP)

4. **Verify code changes:**
   - Check `lib/rate-limit.ts` có đúng không
   - Check `process.env.NODE_ENV` có đúng không

### Rate Limit Không Hoạt Động?

1. Check middleware có apply rate limit không
2. Check API route có import rate limiter không
3. Check logs để debug

### Error Response Format

```json
{
  "error": "Too many authentication attempts, please try again later",
  "retryAfter": 470
}
```

- `error`: Error message
- `retryAfter`: Seconds until you can retry

## Files Modified

- `lib/rate-limit.ts` - Updated all rate limiters for development

## Summary

✅ **Auth**: 5 → **50 requests** (development)
✅ **Checkout**: 10 → **50 requests** (development)
✅ **Booking**: 20 → **100 requests** (development)
✅ **Rating**: 10 → **50 requests** (development)
✅ **Production**: Giữ nguyên strict limits để bảo vệ API
✅ **Testing**: Dễ dàng test nhiều lần trong development

---

**Status**: ✅ FIXED - Đăng ký, đăng nhập, và các tính năng khác giờ hoạt động mượt mà trong development!
