# 🖼️ Service Image Banner - Ảnh Banner Dịch Vụ

## ✅ Hoàn Thành

Đã thêm tính năng upload ảnh banner cho dịch vụ trong admin và hiển thị trên HomePage.

## 🎯 Tính Năng

### Database
- ✅ Thêm trường `imageUrl` vào Service model
- ✅ Nullable field (optional)
- ✅ Chạy migration thành công

### Admin Panel
- ✅ Input field "Ảnh Banner (URL)" trong form thêm dịch vụ
- ✅ Input field "Ảnh Banner (URL)" trong form sửa dịch vụ
- ✅ Preview ảnh real-time khi nhập URL
- ✅ Validation URL format
- ✅ Error handling nếu ảnh không load được

### HomePage
- ✅ Hiển thị ảnh banner từ database
- ✅ Fallback image nếu service không có ảnh
- ✅ Grid 2 cột responsive
- ✅ Aspect ratio 1:0.8 maintained

## 📊 Database Changes

### Prisma Schema
```prisma
model Service {
    id            String     @id @default(uuid())
    name          String
    price         Int
    imageUrl      String?    // ← NEW FIELD
    stripePriceId String?
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
    bookings      Booking[]
    carts         Cart[]
    favorites     Favorite[]
    ratings       Rating[]
}
```

### Migration
```bash
npx prisma db push
# Database synced successfully
```

## 🎨 Admin UI

### Add Service Form
```
┌─────────────────────────────────┐
│ Tên dịch vụ *                   │
│ [Classic Manicure]              │
│                                 │
│ Giá *                           │
│ [50.000]                        │
│                                 │
│ Ảnh Banner (URL)                │
│ [https://example.com/image.jpg] │
│                                 │
│ [Preview Image]                 │
│                                 │
│ [Thêm Dịch Vụ]                  │
└─────────────────────────────────┘
```

### Edit Service Form
- Same layout as Add form
- Pre-filled with existing imageUrl
- Preview shows current image

### Features
- **Real-time Preview**: Image shows immediately when URL is entered
- **Error Handling**: Image hides if URL is invalid
- **Optional Field**: Can leave empty (uses fallback image)
- **URL Validation**: Input type="url" for basic validation

## 📱 HomePage Display

### Service Card
```typescript
<ServiceCard 
  image={service.imageUrl || defaultServiceImage}
  title={service.name}
  subtitle={formatPrice(service.price)}
  rating={service.rating}
  ratingsCount={service.ratingsCount}
  onClick={() => handleBookService(service.id)}
/>
```

### Fallback Image
```typescript
const defaultServiceImage = 'https://lh3.googleusercontent.com/...'
```

If service has no imageUrl, uses default fallback image.

### Grid Layout
- 2 columns
- Gap: 16px
- Aspect ratio: 1:0.8
- Responsive images

## 🔄 Data Flow

### Admin → Database
1. Admin enters image URL in form
2. Click "Thêm Dịch Vụ" or "Lưu"
3. POST/PUT to `/api/v1/services`
4. Database updated with imageUrl

### Database → HomePage
1. HomePage calls `useServices()`
2. API returns services with imageUrl
3. ServiceCard displays image
4. Falls back to default if no imageUrl

## 📁 Files Modified

### Database
- `prisma/schema.prisma` - Added imageUrl field

### Types
- `lib/swr/hooks/services.ts` - Added imageUrl to Service interface

### Components
- `components/admin/ServicesManagement.tsx` - Added imageUrl input fields
- `components/home/HomePage.tsx` - Use imageUrl from service

### Documentation
- `SERVICE_IMAGE_BANNER_README.md` - This file

## 🚀 Usage

### For Admin

1. **Add New Service with Image:**
   - Go to Admin → Services
   - Click "Thêm Dịch Vụ"
   - Fill in name and price
   - Paste image URL in "Ảnh Banner (URL)"
   - Preview appears automatically
   - Click "Thêm Dịch Vụ"

2. **Edit Existing Service:**
   - Click "Edit" on any service
   - Update imageUrl field
   - Preview updates in real-time
   - Click "Lưu"

3. **Remove Image:**
   - Edit service
   - Clear imageUrl field
   - Service will use fallback image

### For Users

- View services on HomePage
- See beautiful banner images
- Click to book service

## 💡 Image Guidelines

### Recommended Specs
- **Aspect Ratio**: 1:0.8 (e.g., 800x640px)
- **Format**: JPG, PNG, WebP
- **Size**: < 500KB for fast loading
- **Resolution**: 800-1200px width
- **Quality**: High quality, professional photos

### Image Sources
- **Unsplash**: Free high-quality images
- **Pexels**: Free stock photos
- **Your own**: Upload to Imgur, Cloudinary, etc.

### Example URLs
```
https://images.unsplash.com/photo-...
https://i.imgur.com/abc123.jpg
https://res.cloudinary.com/...
```

## 🎯 Best Practices

### Image Selection
- Use relevant images for each service
- Consistent style across all services
- Professional, high-quality photos
- Good lighting and composition

### URL Management
- Use CDN for better performance
- Use HTTPS URLs only
- Test URL before saving
- Keep backup of image URLs

### Fallback Strategy
- Always have default fallback image
- Fallback should be generic but professional
- Test with and without images

## 🔮 Future Enhancements

### Recommended
1. **Image Upload** - Direct upload instead of URL
2. **Multiple Images** - Gallery for each service
3. **Image Optimization** - Auto-resize and compress
4. **Image CDN** - Cloudinary or similar integration
5. **Drag & Drop** - Easy image upload UI

### Advanced
6. **Image Cropping** - Built-in crop tool
7. **Image Filters** - Apply filters/effects
8. **AI Enhancement** - Auto-enhance image quality
9. **Stock Photos** - Built-in stock photo search
10. **Image Analytics** - Track which images perform best

## 🐛 Troubleshooting

### Image Not Showing in Admin Preview
- Check URL is valid and accessible
- Check URL starts with http:// or https://
- Try opening URL in new tab
- Check CORS settings

### Image Not Showing on HomePage
- Check service has imageUrl in database
- Check imageUrl is not null
- Verify fallback image URL is valid
- Check browser console for errors

### Image Upload Not Working
- Currently only supports URL input
- For file upload, need to implement:
  - File upload endpoint
  - Storage solution (S3, Cloudinary)
  - Upload UI component

### TypeScript Errors
- Restart TypeScript server
- Run `npx prisma generate`
- Restart dev server
- Clear TypeScript cache

## ✅ Testing Checklist

- [x] Database migration successful
- [x] Admin form shows imageUrl field
- [x] Preview works in add form
- [x] Preview works in edit form
- [x] Can save service with imageUrl
- [x] Can save service without imageUrl
- [x] HomePage displays imageUrl
- [x] HomePage shows fallback if no imageUrl
- [x] Grid layout works correctly
- [x] Images responsive on mobile
- [x] Error handling for invalid URLs
- [x] TypeScript types updated

## 📝 Summary

Service image banner feature is complete:
- ✅ Database field added
- ✅ Admin UI updated
- ✅ HomePage displays images
- ✅ Fallback image works
- ✅ Preview functionality
- ✅ Mobile responsive

**Status**: ✅ READY TO USE

---

**Next Steps**: Add image URLs to existing services in admin panel! 🎨
