# 🔧 Service Image API Fix

## ✅ Đã Fix

API endpoints đã được cập nhật để xử lý trường `imageUrl` đúng cách.

## Vấn Đề

Khi gọi PUT `/api/v1/services/[id]` với imageUrl trong body, response vẫn trả về `imageUrl: null` vì API không xử lý trường này.

## Nguyên Nhân

API routes chỉ xử lý `name` và `price`, không có `imageUrl`:

```typescript
// ❌ BEFORE - Missing imageUrl
const { name, price } = body
const service = await prisma.service.update({
  where: { id },
  data: {
    name,
    price,
  },
})
```

## Giải Pháp

### 1. PUT Endpoint - Update Service
File: `app/api/v1/services/[id]/route.ts`

```typescript
// ✅ AFTER - Added imageUrl
const { name, price, imageUrl } = body
const service = await prisma.service.update({
  where: { id },
  data: {
    name,
    price,
    imageUrl,  // ← Added
  },
})
```

### 2. POST Endpoint - Create Service
File: `app/api/v1/services/route.ts`

```typescript
// ✅ AFTER - Added imageUrl
const { name, price } = validation.data
const { imageUrl } = body

const service = await prisma.service.create({
  data: {
    name,
    price,
    imageUrl: imageUrl || null,  // ← Added
    stripePriceId,
  },
})
```

### 3. GET Endpoint - List Services
File: `app/api/v1/services/route.ts`

```typescript
// ✅ AFTER - Include imageUrl in response
return {
  id: service.id,
  name: service.name,
  price: service.price,
  imageUrl: service.imageUrl,  // ← Added
  stripePriceId: service.stripePriceId,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
  rating: Math.round(averageRating * 10) / 10,
  ratingsCount,
}
```

## Files Modified

- `app/api/v1/services/[id]/route.ts` - PUT endpoint
- `app/api/v1/services/route.ts` - POST and GET endpoints

## Testing

### Test PUT (Update Service)
```bash
curl 'http://localhost:3000/api/v1/services/SERVICE_ID' \
  -X 'PUT' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name":"Service Name",
    "price":599000,
    "imageUrl":"https://example.com/image.jpg"
  }'
```

**Expected Response:**
```json
{
  "id": "...",
  "name": "Service Name",
  "price": 599000,
  "imageUrl": "https://example.com/image.jpg",  // ✅ Not null
  "stripePriceId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Test POST (Create Service)
```bash
curl 'http://localhost:3000/api/v1/services' \
  -X 'POST' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name":"New Service",
    "price":299000,
    "imageUrl":"https://example.com/image.jpg"
  }'
```

**Expected Response:**
```json
{
  "id": "...",
  "name": "New Service",
  "price": 299000,
  "imageUrl": "https://example.com/image.jpg",  // ✅ Not null
  "stripePriceId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Test GET (List Services)
```bash
curl 'http://localhost:3000/api/v1/services'
```

**Expected Response:**
```json
{
  "services": [
    {
      "id": "...",
      "name": "Service Name",
      "price": 599000,
      "imageUrl": "https://example.com/image.jpg",  // ✅ Included
      "rating": 4.5,
      "ratingsCount": 10
    }
  ],
  "pagination": {...}
}
```

## Verification Steps

1. **Restart dev server** (if needed)
2. **Update a service** with imageUrl in admin panel
3. **Check response** - imageUrl should not be null
4. **Refresh HomePage** - image should display
5. **Create new service** with imageUrl
6. **Verify** image appears on HomePage

## Summary

✅ **PUT endpoint** - Now accepts and saves imageUrl
✅ **POST endpoint** - Now accepts and saves imageUrl
✅ **GET endpoint** - Now returns imageUrl in response
✅ **Database** - Already has imageUrl field
✅ **Admin UI** - Already sends imageUrl
✅ **HomePage** - Already displays imageUrl

**Status**: ✅ FULLY FIXED - API now handles imageUrl correctly!

---

**Test it now**: Update a service in admin panel and verify the image appears on HomePage! 🎨
