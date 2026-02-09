# News Management System - Hệ Thống Quản Lý Tin Tức

## ✅ STATUS: COMPLETED

## Tổng Quan
Hệ thống quản lý tin tức cho phép Admin/Staff/Doctor tạo, chỉnh sửa, xóa và xuất bản tin tức. Khách hàng có thể xem tin tức đã xuất bản trên trang chủ.

## ✅ Completed Tasks

### 1. Database Migration ✅
- Added News model to Prisma schema
- Ran `npx prisma db push` successfully
- Database is now in sync with schema

### 2. Admin Integration ✅
- Added NewsManagement component to SuperAdminDashboard
- Added "News" tab with Newspaper icon
- Added translations for "news" in both en.json and vi.json
- Tab appears between "Referrals" and "Analytics"

### 3. HomePage Integration ✅
- Replaced static news data with dynamic data from API
- Integrated useNews() hook to fetch latest 2 published news
- Added loading skeleton for news section
- Added empty state when no news available
- Added helper functions for category colors and labels
- News displays with proper formatting and styling

## Database Schema

### News Model
```prisma
model News {
    id          String   @id @default(uuid())
    title       String
    slug        String   @unique
    excerpt     String?
    content     String
    coverImage  String?
    category    String   @default("NEWS") // NEWS, PROMOTION, EVENT
    tags        String[]
    published   Boolean  @default(false)
    publishedAt DateTime?
    authorId    String
    author      User     @relation(fields: [authorId], references: [id])
    viewCount   Int      @default(0)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
}
```

### Fields
- **title**: Tiêu đề tin tức
- **slug**: URL-friendly identifier (unique)
- **excerpt**: Mô tả ngắn (optional)
- **content**: Nội dung đầy đủ
- **coverImage**: URL ảnh bìa (optional)
- **category**: NEWS | PROMOTION | EVENT
- **tags**: Array of tags
- **published**: Trạng thái xuất bản
- **publishedAt**: Thời gian xuất bản
- **authorId**: ID người tạo
- **viewCount**: Số lượt xem

## Setup

### 1. Run Migration
```bash
npx prisma db push
# hoặc
npx prisma migrate dev --name add_news_model
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

## API Endpoints

### GET /api/v1/news
Lấy danh sách tin tức

**Query Parameters:**
- `page` (number): Trang hiện tại
- `limit` (number): Số items per page
- `category` (string): NEWS | PROMOTION | EVENT
- `search` (string): Tìm kiếm
- `published` (boolean): Lọc theo trạng thái

**Response:**
```json
{
  "news": [...],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Permissions:**
- Public: Chỉ xem tin đã xuất bản
- Staff+: Xem tất cả (bao gồm draft)

### POST /api/v1/news
Tạo tin tức mới

**Permissions:** Staff+ only

**Body:**
```json
{
  "title": "Tiêu đề",
  "slug": "tieu-de",
  "excerpt": "Mô tả ngắn",
  "content": "Nội dung đầy đủ",
  "coverImage": "https://...",
  "category": "NEWS",
  "tags": ["tag1", "tag2"],
  "published": false
}
```

### GET /api/v1/news/[id]
Lấy chi tiết tin tức

**Permissions:**
- Public: Chỉ xem tin đã xuất bản
- Staff+: Xem tất cả

**Auto increment viewCount**

### PUT /api/v1/news/[id]
Cập nhật tin tức

**Permissions:** Staff+ only

**Body:** Partial News object

### DELETE /api/v1/news/[id]
Xóa tin tức

**Permissions:** Staff+ only

## SWR Hooks

### useNews()
```typescript
import { useNews } from '@/lib/swr'

const { data, isLoading, mutate } = useNews({
  page: 1,
  limit: 10,
  category: 'NEWS',
  search: 'keyword',
  published: true
})
```

### useNewsItem()
```typescript
import { useNewsItem } from '@/lib/swr'

const { data, isLoading } = useNewsItem(newsId)
```

### createNews()
```typescript
import { createNews } from '@/lib/swr'

await createNews({
  title: "...",
  slug: "...",
  content: "...",
  published: true
})
```

### updateNews()
```typescript
import { updateNews } from '@/lib/swr'

await updateNews(newsId, {
  title: "New title",
  published: true
})
```

### deleteNews()
```typescript
import { deleteNews } from '@/lib/swr'

await deleteNews(newsId)
```

## Admin Component

### NewsManagement
Component quản lý tin tức trong admin panel

**Features:**
- ✅ Danh sách tin tức với pagination
- ✅ Tìm kiếm theo title, excerpt, content
- ✅ Lọc theo category (NEWS, PROMOTION, EVENT)
- ✅ Lọc theo trạng thái (Published, Draft)
- ✅ Tạo tin tức mới
- ✅ Chỉnh sửa tin tức
- ✅ Xóa tin tức
- ✅ Auto-generate slug từ title
- ✅ Preview cover image
- ✅ View count display
- ✅ Published date display

**Usage:**
```tsx
import { NewsManagement } from '@/components/admin/NewsManagement'

<NewsManagement />
```

## Integration vào Admin Dashboard

### Option 1: Add to existing tabs
```tsx
// In admin dashboard component
<Tabs>
  <TabsList>
    <TabsTrigger value="news">Tin tức</TabsTrigger>
  </TabsList>
  <TabsContent value="news">
    <NewsManagement />
  </TabsContent>
</Tabs>
```

### Option 2: Separate page
```tsx
// app/[locale]/admin/news/page.tsx
import { NewsManagement } from '@/components/admin/NewsManagement'

export default function NewsPage() {
  return <NewsManagement />
}
```

## Display News on HomePage

### Update HomePage.tsx
```tsx
import { useNews } from '@/lib/swr'

// In HomePage component
const { data: newsData } = useNews({ 
  limit: 2, 
  published: true,
  category: undefined // or specific category
})
const news = newsData?.news || []

// Replace static NewsCard with dynamic data
{news.map((item) => (
  <NewsCard
    key={item.id}
    image={item.coverImage || defaultImage}
    tag={item.category}
    tagColor={getCategoryColor(item.category)}
    date={format(new Date(item.publishedAt), 'dd/MM/yyyy')}
    title={item.title}
    description={item.excerpt || item.content.substring(0, 100)}
  />
))}
```

### Category Colors
```tsx
function getCategoryColor(category: string) {
  switch (category) {
    case 'NEWS':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    case 'PROMOTION':
      return 'text-primary bg-yellow-50 dark:bg-yellow-900/20'
    case 'EVENT':
      return 'text-green-500 bg-green-50 dark:bg-green-900/20'
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
  }
}
```

### Category Labels
```tsx
function getCategoryLabel(category: string) {
  switch (category) {
    case 'NEWS':
      return 'TIN TỨC'
    case 'PROMOTION':
      return 'ƯU ĐÃI'
    case 'EVENT':
      return 'SỰ KIỆN'
    default:
      return category
  }
}
```

## Permissions

### Who can CRUD?
- ✅ SUPER_ADMIN
- ✅ ADMIN
- ✅ STAFF
- ✅ DOCTOR
- ❌ CLIENT (read-only published news)

### Permission Check
```typescript
import { canAccessResource } from '@/lib/rbac'

if (!canAccessResource(userRole, "STAFF")) {
  // Forbidden
}
```

## Features

### Auto Slug Generation
Tự động tạo slug từ title:
- Chuyển thành lowercase
- Loại bỏ dấu tiếng Việt
- Thay thế khoảng trắng bằng dấu gạch ngang
- Loại bỏ ký tự đặc biệt

Example: "Tin Tức Mới Nhất" → "tin-tuc-moi-nhat"

### View Count
Tự động tăng view count mỗi khi GET /api/v1/news/[id]

### Published Date
- Tự động set publishedAt khi published = true lần đầu
- Set null khi unpublish

### Draft Mode
- Tin tức có published = false là draft
- Chỉ Staff+ mới xem được draft
- Public chỉ xem được published news

## Testing

### Create Test News
1. Login as Admin/Staff
2. Go to Admin → News Management
3. Click "Tạo tin tức"
4. Fill form:
   - Title: "Khai Trương Chi Nhánh Mới"
   - Slug: auto-generated
   - Excerpt: "Chào mừng chi nhánh mới..."
   - Content: Full content
   - Cover Image: URL
   - Category: EVENT
   - Published: ✓
5. Click "Lưu"
6. Verify: News appears in list
7. Go to HomePage
8. Verify: News appears in "Tin Tức & Ưu Đãi"

### Test Permissions
1. **As CLIENT:**
   - Cannot access /api/v1/news POST/PUT/DELETE
   - Can only GET published news

2. **As STAFF:**
   - Can CRUD all news
   - Can see drafts
   - Can publish/unpublish

## Files Created

### Database
- `prisma/schema.prisma` - Added News model

### API Routes
- `app/api/v1/news/route.ts` - GET, POST
- `app/api/v1/news/[id]/route.ts` - GET, PUT, DELETE

### Hooks
- `lib/swr/hooks/news.ts` - SWR hooks
- `lib/swr/index.ts` - Export news hooks

### Components
- `components/admin/NewsManagement.tsx` - Admin UI

### Documentation
- `NEWS_MANAGEMENT_README.md` - This file

## Next Steps

1. **Run Migration:**
   ```bash
   npx prisma db push
   ```

2. **Add to Admin Dashboard:**
   - Add "Tin tức" tab to admin panel
   - Import and use NewsManagement component

3. **Update HomePage:**
   - Replace static news with dynamic data
   - Use useNews() hook
   - Map news data to NewsCard

4. **Optional Enhancements:**
   - Rich text editor (TinyMCE, Quill)
   - Image upload (Cloudinary, S3)
   - Tags management
   - SEO meta tags
   - Social sharing
   - Comments system
   - Related news
   - News detail page

## Troubleshooting

### Slug already exists
- Change slug to unique value
- Add timestamp: `slug-${Date.now()}`

### Image not loading
- Check URL is valid
- Use HTTPS URLs
- Consider image upload feature

### Permission denied
- Check user role
- Verify canAccessResource logic
- Check session authentication

## Notes

- Slug must be unique
- Published news cannot be unpublished (can be updated to allow)
- View count increments on every GET request
- Author is automatically set from session
- All Staff+ roles can manage news
- Clients can only view published news
