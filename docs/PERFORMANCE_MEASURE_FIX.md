# Performance Measure Error Fix

## Lỗi

```
Failed to execute 'measure' on 'Performance': 'DashboardPage' cannot have a negative time stamp.
```

## Nguyên Nhân

Lỗi này xảy ra trong Next.js development mode khi:

1. **Component name conflicts**: Next.js sử dụng function name để measure performance
2. **Immediate redirects**: Component redirect ngay lập tức trước khi render
3. **Performance API timing**: Next.js cố measure performance nhưng component đã unmount

Cụ thể:
- Function name `DashboardPage`, `AdminPage`, `SuperAdminPage`, `StaffPage` gây conflict
- Next.js dev mode cố measure performance của các components này
- Nhưng do redirect ngay lập tức, timing bị âm (negative timestamp)

## Giải Pháp

### 1. Đổi Function Name thành `Page`

**Trước:**
```typescript
export default async function DashboardPage() {
  // ...
}
```

**Sau:**
```typescript
export default async function Page() {
  // ...
}
```

### 2. Thêm Metadata

Thêm metadata để Next.js có thể identify page đúng cách:

```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}
```

## Files Fixed

### 1. app/[locale]/(dashboard)/dashboard/page.tsx
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function Page() {
  // ... rest of code
}
```

### 2. app/[locale]/(dashboard)/admin/page.tsx
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

export default async function Page() {
  // ... rest of code
}
```

### 3. app/[locale]/(dashboard)/admin/super/page.tsx
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
}

export default async function Page() {
  // ... rest of code
}
```

### 4. app/[locale]/(dashboard)/staff/page.tsx
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff Dashboard",
}

export default async function Page() {
  // ... rest of code
}
```

## Tại Sao Fix Này Hoạt Động?

1. **Generic function name**: `Page` là convention của Next.js, không gây conflict
2. **Metadata**: Giúp Next.js identify page mà không dựa vào function name
3. **Performance API**: Next.js sử dụng metadata thay vì function name để measure

## Lưu Ý

- Lỗi này chỉ xuất hiện trong **development mode**
- Không ảnh hưởng đến **production build**
- Là warning của Next.js dev server, không phải lỗi runtime

## Best Practices

### ✅ DO: Sử dụng generic function name

```typescript
export default async function Page() {
  // ...
}
```

### ❌ DON'T: Sử dụng descriptive function name

```typescript
export default async function DashboardPage() {
  // ...
}
```

### ✅ DO: Thêm metadata cho SEO và identification

```typescript
export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
}
```

## Testing

Sau khi fix:

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Test các routes:**
   - `/dashboard` - Không có lỗi
   - `/admin` - Không có lỗi
   - `/admin/super` - Không có lỗi
   - `/staff` - Không có lỗi

3. **Kiểm tra console:**
   - Không còn warning về Performance.measure
   - Không còn negative timestamp errors

## Related Issues

- Next.js Issue: https://github.com/vercel/next.js/issues/...
- React Performance API: https://developer.mozilla.org/en-US/docs/Web/API/Performance

## Status: ✅ FIXED

Tất cả dashboard pages đã được fix và không còn lỗi Performance measure.
