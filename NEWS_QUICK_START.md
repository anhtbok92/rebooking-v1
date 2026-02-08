# 🚀 News Management System - Quick Start Guide

## ✅ System Status: READY TO USE

The News Management System is fully implemented and ready for use. All components are in place.

## 🔄 Important: Restart Development Server

After the Prisma migration, you need to restart your development server to pick up the new types:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## 📝 Quick Test Guide

### Step 1: Access Admin Panel
1. Login as Admin/Staff/Doctor
2. Navigate to Admin Dashboard
3. Click on "Tin tức" (News) tab in the sidebar

### Step 2: Create Your First News Article
1. Click "Tạo tin tức" (Create News) button
2. Fill in the form:
   - **Title**: "Khai Trương Chi Nhánh Mới"
   - **Slug**: Auto-generated (tin-tuc-moi-nhat)
   - **Excerpt**: "Chào mừng chi nhánh mới tại trung tâm thành phố"
   - **Content**: "Chúng tôi vui mừng thông báo khai trương chi nhánh mới..."
   - **Cover Image**: Paste any image URL (optional)
   - **Category**: Select "EVENT" (Sự kiện)
   - **Published**: ✓ Check this box
3. Click "Lưu" (Save)

### Step 3: Verify on HomePage
1. Navigate to HomePage (mobile view)
2. Scroll to "Tin Tức & Ưu Đãi" section
3. You should see your news article displayed with:
   - Cover image
   - "SỰ KIỆN" badge in green
   - Today's date
   - Title and excerpt

### Step 4: Test Filtering (Admin Panel)
1. Go back to Admin → News
2. Try the search box
3. Try category filter dropdown
4. Try status filter (Published/Draft)

## 🎨 Category Colors Reference

When creating news, choose the appropriate category:

| Category | Label | Color | Use For |
|----------|-------|-------|---------|
| NEWS | TIN TỨC | Blue | General news, updates, announcements |
| PROMOTION | ƯU ĐÃI | Yellow | Promotions, discounts, special offers |
| EVENT | SỰ KIỆN | Green | Events, grand openings, celebrations |

## 📱 Mobile View

The news section on HomePage is optimized for mobile (max-width: 430px):
- Displays latest 2 published news
- Horizontal card layout with image on left
- Category badge with color coding
- Published date
- Title (max 2 lines)
- Excerpt (max 2 lines)

## 🔐 Permissions Quick Reference

- **CLIENT**: Can only view published news on HomePage
- **DOCTOR/STAFF/ADMIN/SUPER_ADMIN**: Full CRUD access in admin panel

## 🐛 Troubleshooting

### TypeScript Errors in IDE
If you see "Property 'news' does not exist" errors:
1. Restart your development server
2. Restart your IDE/VSCode
3. Run: `cmd /c "npx prisma generate"`

### News Not Showing on HomePage
- Make sure news is **published** (checkbox checked)
- Verify **publishedAt** date is set
- Check browser console for API errors

### Slug Already Exists Error
- Each slug must be unique
- Edit the slug manually or add a number: `news-title-2`

## 📚 Full Documentation

For detailed documentation, see:
- `NEWS_MANAGEMENT_README.md` - Complete system documentation
- `NEWS_SYSTEM_COMPLETE.md` - Implementation summary

## 🎯 Next Steps

1. **Create sample news** - Add 2-3 news articles to test
2. **Test on mobile** - View HomePage on mobile device/emulator
3. **Test permissions** - Login as different roles to verify access
4. **Customize** - Adjust colors, layout, or add features as needed

## 💡 Tips

- Use high-quality images (recommended: 800x600px)
- Keep excerpts short (under 100 characters)
- Use descriptive titles
- Choose appropriate categories
- Publish news regularly to keep content fresh

---

**Ready to go!** Start creating news articles and they'll automatically appear on your HomePage. 🎉
