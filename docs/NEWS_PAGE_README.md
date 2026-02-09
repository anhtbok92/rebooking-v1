# 📰 News Page - Trang Xem Tất Cả Tin Tức

## ✅ Hoàn Thành

Đã tạo trang NewsPage để hiển thị tất cả tin tức với đầy đủ tính năng tìm kiếm, lọc và phân trang.

## 🎯 Tính Năng

### HomePage Updates
- ✅ Hiển thị **3 tin tức mới nhất** (thay vì 2)
- ✅ Button "Xem tất cả" ở header section
- ✅ Click "Xem tất cả" → Navigate sang NewsPage

### NewsPage Features
- ✅ **Header** với nút Back về HomePage
- ✅ **Search** - Tìm kiếm theo tiêu đề, mô tả, nội dung
- ✅ **Filter** - Lọc theo danh mục (Tất cả, Tin tức, Ưu đãi, Sự kiện)
- ✅ **Pagination** - Phân trang 10 tin/trang
- ✅ **View Count** - Hiển thị số lượt xem
- ✅ **Loading State** - Skeleton loading
- ✅ **Empty State** - Thông báo khi không có tin tức
- ✅ **Responsive** - Tối ưu cho mobile (max-width: 430px)

## 📱 UI Components

### Header
```
┌─────────────────────────────────┐
│ ← Tin Tức & Ưu Đãi             │
│   Cập nhật tin tức mới nhất     │
└─────────────────────────────────┘
```

### Filters
```
┌─────────────────────────────────┐
│ 🔍 Tìm kiếm tin tức...          │
│ ▼ Tất cả danh mục               │
└─────────────────────────────────┘
```

### News Card
```
┌─────────────────────────────────┐
│ [IMG] TIN TỨC  01/03/2026       │
│       Tiêu đề tin tức...        │
│       Mô tả ngắn...             │
│       👁 123 lượt xem            │
└─────────────────────────────────┘
```

### Pagination
```
┌─────────────────────────────────┐
│ Trang 1 / 5    [Trước] [Sau]   │
└─────────────────────────────────┘
```

## 🔄 Navigation Flow

```
HomePage
  ↓ (Click "Xem tất cả")
NewsPage
  ↓ (Click "←" Back button)
HomePage
```

## 📊 Data Flow

### HomePage
```typescript
useNews({ 
  limit: 3,           // Show 3 latest
  published: true     // Only published
})
```

### NewsPage
```typescript
useNews({
  page: 1,            // Current page
  limit: 10,          // 10 per page
  search: "keyword",  // Search query
  category: "NEWS",   // Filter by category
  published: true     // Only published
})
```

## 🎨 Styling

### Category Colors
- **NEWS** (Tin tức): Blue
- **PROMOTION** (Ưu đãi): Yellow (Primary)
- **EVENT** (Sự kiện): Green

### Layout
- Max width: 430px
- Padding: 24px (px-6)
- Gap between cards: 16px
- Border radius: 24px (rounded-3xl)

## 🔍 Search & Filter

### Search
- Tìm kiếm trong: title, excerpt, content
- Case-insensitive
- Real-time search (onChange)
- Reset page to 1 when search

### Filter
- **Tất cả danh mục**: Show all
- **Tin tức**: NEWS only
- **Ưu đãi**: PROMOTION only
- **Sự kiện**: EVENT only
- Reset page to 1 when filter

## 📄 Pagination

### Logic
- 10 tin tức per page
- Show "Trang X / Y"
- "Trước" button: Go to previous page (disabled on page 1)
- "Sau" button: Go to next page (disabled on last page)
- Scroll to top when change page

### Display
- Only show pagination if pages > 1
- Current page highlighted
- Disabled state for buttons

## 💡 Features Detail

### View Count
- Display: "👁 123 lượt xem"
- Auto increment when view news detail (future feature)
- Show on each news card

### Loading State
- Show 5 skeleton cards
- Animated pulse effect
- Same layout as actual cards

### Empty State
- Icon: Newspaper (16x16)
- Title: "Không tìm thấy tin tức"
- Message: 
  - With filter: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
  - No filter: "Chưa có tin tức nào được xuất bản"

### Strip HTML
- Remove HTML tags from excerpt/content
- Display plain text only
- Prevent XSS attacks

## 📁 Files

### Created
- `components/home/NewsPage.tsx` - News list page component
- `NEWS_PAGE_README.md` - This documentation

### Modified
- `components/home/HomePage.tsx` - Added onNavigateToNews prop, changed limit to 3
- `components/layout/MobileLayout.tsx` - Added NewsPage navigation

## 🚀 Usage

### For Users

1. **View Latest News on HomePage:**
   - Scroll to "Tin Tức & Ưu Đãi" section
   - See 3 latest news articles

2. **View All News:**
   - Click "Xem tất cả" button
   - Navigate to NewsPage

3. **Search News:**
   - Type keyword in search box
   - Results update automatically

4. **Filter by Category:**
   - Select category from dropdown
   - Results filtered instantly

5. **Navigate Pages:**
   - Click "Sau" for next page
   - Click "Trước" for previous page

6. **Go Back:**
   - Click "←" button in header
   - Return to HomePage

### For Developers

```typescript
// Import NewsPage
import NewsPage from '@/components/home/NewsPage'

// Use in component
<NewsPage onBack={() => setActiveTab('home')} />

// Or with custom navigation
<NewsPage onBack={handleBack} />
```

## 🎯 User Experience

### Smooth Navigation
- No page reload
- Instant tab switching
- Preserve scroll position on back

### Fast Search
- Real-time results
- No delay
- Clear feedback

### Clear Feedback
- Loading states
- Empty states
- Error states (future)

### Mobile Optimized
- Touch-friendly buttons
- Readable text sizes
- Proper spacing
- Responsive images

## 🔮 Future Enhancements

### Recommended
1. **News Detail Page** - Full article view
2. **Share Button** - Share to social media
3. **Bookmark** - Save favorite news
4. **Related News** - Show similar articles
5. **Comments** - User comments section

### Advanced
6. **Infinite Scroll** - Load more on scroll
7. **Pull to Refresh** - Refresh news list
8. **Offline Mode** - Cache news for offline
9. **Push Notifications** - Notify new news
10. **Read Progress** - Track reading progress

## 📊 Analytics (Future)

Track user behavior:
- Most viewed news
- Most searched keywords
- Popular categories
- Average time on page
- Click-through rate

## 🐛 Troubleshooting

### News not showing
- Check if news is published
- Check publishedAt date
- Verify API response

### Search not working
- Check search query
- Verify API endpoint
- Check network tab

### Filter not working
- Check category value
- Verify API parameter
- Check console logs

### Pagination not working
- Check page number
- Verify total pages
- Check pagination logic

## ✅ Testing Checklist

- [x] HomePage shows 3 news
- [x] "Xem tất cả" button works
- [x] Navigate to NewsPage
- [x] Back button returns to HomePage
- [x] Search works
- [x] Filter works
- [x] Pagination works
- [x] Loading state shows
- [x] Empty state shows
- [x] View count displays
- [x] Category colors correct
- [x] Mobile responsive
- [x] Dark mode works

## 📝 Summary

NewsPage provides a complete news browsing experience with:
- ✅ Search functionality
- ✅ Category filtering
- ✅ Pagination
- ✅ View count
- ✅ Mobile-optimized UI
- ✅ Loading & empty states
- ✅ Smooth navigation

**Status**: ✅ READY TO USE

---

**Enjoy browsing news!** 📰✨
