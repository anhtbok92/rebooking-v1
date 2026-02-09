# 📝 Rich Text Editor - Hướng Dẫn Sử Dụng

## ✅ Đã Tích Hợp Thành Công

Rich Text Editor (Tiptap) đã được tích hợp vào hệ thống quản lý tin tức, cho phép soạn thảo nội dung chuyên nghiệp với đầy đủ tính năng.

## 🎨 Tính Năng Editor

### Toolbar Buttons

| Icon | Chức năng | Phím tắt |
|------|-----------|----------|
| **B** | Bold (In đậm) | Ctrl/Cmd + B |
| *I* | Italic (In nghiêng) | Ctrl/Cmd + I |
| H1 | Heading 1 (Tiêu đề lớn) | Ctrl/Cmd + Alt + 1 |
| H2 | Heading 2 (Tiêu đề vừa) | Ctrl/Cmd + Alt + 2 |
| • | Bullet List (Danh sách gạch đầu dòng) | Ctrl/Cmd + Shift + 8 |
| 1. | Ordered List (Danh sách đánh số) | Ctrl/Cmd + Shift + 7 |
| " | Blockquote (Trích dẫn) | Ctrl/Cmd + Shift + B |
| <> | Code Block (Khối code) | Ctrl/Cmd + Alt + C |
| 🔗 | Link (Thêm liên kết) | - |
| 🖼️ | Image (Thêm hình ảnh) | - |
| ↶ | Undo (Hoàn tác) | Ctrl/Cmd + Z |
| ↷ | Redo (Làm lại) | Ctrl/Cmd + Shift + Z |

## 📋 Hướng Dẫn Sử Dụng

### 1. Copy/Paste Từ Web

**Cách làm:**
1. Mở bài viết trên web (VD: báo điện tử, blog)
2. Bôi đen và copy nội dung (Ctrl+C)
3. Click vào editor
4. Paste (Ctrl+V)

**Kết quả:**
- Tự động giữ định dạng: bold, italic, headings, lists
- Tự động chuyển đổi links
- Loại bỏ các style không cần thiết

### 2. Thêm Heading (Tiêu đề)

**Cách 1: Dùng toolbar**
- Bôi đen text
- Click nút H1 hoặc H2

**Cách 2: Dùng Markdown**
- Gõ `# ` (dấu cách sau #) cho H1
- Gõ `## ` cho H2
- Gõ `### ` cho H3

**Ví dụ:**
```
# Tiêu đề chính
## Tiêu đề phụ
### Tiêu đề nhỏ
```

### 3. Thêm Danh Sách

**Bullet List (gạch đầu dòng):**
- Click nút • trong toolbar
- Hoặc gõ `- ` (dấu gạch + dấu cách)

**Ordered List (đánh số):**
- Click nút 1. trong toolbar
- Hoặc gõ `1. ` (số + chấm + dấu cách)

**Ví dụ:**
```
- Mục 1
- Mục 2
  - Mục con 2.1
  - Mục con 2.2
- Mục 3

1. Bước 1
2. Bước 2
3. Bước 3
```

### 4. Thêm Link (Liên kết)

**Cách làm:**
1. Bôi đen text cần thêm link
2. Click nút 🔗 trong toolbar
3. Nhập URL trong popup
4. Click OK

**Ví dụ:**
- Text: "Xem thêm tại đây"
- URL: "https://example.com"
- Kết quả: [Xem thêm tại đây](https://example.com)

### 5. Thêm Hình Ảnh

**Cách làm:**
1. Click nút 🖼️ trong toolbar
2. Nhập URL hình ảnh
3. Click OK

**Lưu ý:**
- Chỉ hỗ trợ URL hình ảnh (không upload file)
- URL phải là link trực tiếp đến ảnh (.jpg, .png, .gif, .webp)
- Ảnh sẽ tự động responsive (co giãn theo màn hình)

**Ví dụ URL hợp lệ:**
```
https://example.com/image.jpg
https://i.imgur.com/abc123.png
https://cdn.example.com/photo.webp
```

### 6. Thêm Trích Dẫn (Quote)

**Cách 1: Dùng toolbar**
- Bôi đen text
- Click nút " trong toolbar

**Cách 2: Dùng Markdown**
- Gõ `> ` (dấu lớn hơn + dấu cách)

**Ví dụ:**
```
> Đây là một trích dẫn
> Có thể nhiều dòng
```

### 7. Thêm Code Block

**Cách làm:**
- Click nút <> trong toolbar
- Hoặc gõ ``` (3 dấu backtick)

**Sử dụng cho:**
- Code snippet
- Dữ liệu kỹ thuật
- Thông tin cần format đặc biệt

**Ví dụ:**
```
function hello() {
  console.log("Hello World")
}
```

### 8. Bold & Italic

**Bold (In đậm):**
- Bôi đen text → Click nút **B**
- Hoặc Ctrl+B (Windows) / Cmd+B (Mac)
- Hoặc gõ `**text**` hoặc `__text__`

**Italic (In nghiêng):**
- Bôi đen text → Click nút *I*
- Hoặc Ctrl+I (Windows) / Cmd+I (Mac)
- Hoặc gõ `*text*` hoặc `_text_`

**Ví dụ:**
```
**Chữ in đậm**
*Chữ in nghiêng*
***Vừa đậm vừa nghiêng***
```

## 💡 Tips & Tricks

### Copy Từ Word/Google Docs
1. Copy nội dung từ Word/Google Docs
2. Paste vào editor
3. Editor tự động làm sạch format
4. Giữ lại: headings, bold, italic, lists, links

### Copy Từ Website
1. Copy từ bất kỳ website nào
2. Paste vào editor
3. Tự động loại bỏ: ads, scripts, styles không cần thiết
4. Giữ lại: nội dung chính, format cơ bản

### Keyboard Shortcuts
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + Alt + 1**: Heading 1
- **Ctrl/Cmd + Alt + 2**: Heading 2
- **Ctrl/Cmd + Shift + 8**: Bullet list
- **Ctrl/Cmd + Shift + 7**: Ordered list

### Markdown Support
Editor hỗ trợ Markdown syntax:
- `# Heading 1`
- `## Heading 2`
- `**bold**`
- `*italic*`
- `- list item`
- `1. numbered item`
- `> quote`
- ``` code block ```

## 🎯 Use Cases

### 1. Tin Tức Thông Thường
```
# Khai Trương Chi Nhánh Mới

Chúng tôi vui mừng thông báo **khai trương chi nhánh mới** tại:

- Địa chỉ: 123 Đường ABC, Quận 1
- Điện thoại: 0123456789
- Giờ mở cửa: 8:00 - 20:00

> "Chúng tôi cam kết mang đến dịch vụ tốt nhất"

[Xem bản đồ](https://maps.google.com)
```

### 2. Ưu Đãi/Khuyến Mãi
```
# 🎉 Giảm Giá 50% Tất Cả Dịch Vụ

**Thời gian:** 01/03 - 31/03/2026

**Áp dụng cho:**
1. Khách hàng mới
2. Đặt lịch online
3. Thanh toán trước

*Số lượng có hạn - Đặt ngay!*
```

### 3. Sự Kiện
```
# Workshop Chăm Sóc Da Miễn Phí

## Thông tin sự kiện
- **Thời gian:** 15/03/2026, 14:00
- **Địa điểm:** Phòng khám WinSmile
- **Diễn giả:** BS. Nguyễn Văn A

## Nội dung
1. Cách chăm sóc da mùa hè
2. Sản phẩm phù hợp
3. Q&A

> Đăng ký ngay để nhận quà tặng!
```

## 🔧 Troubleshooting

### Paste không giữ format
- **Nguyên nhân:** Browser block clipboard access
- **Giải pháp:** Cho phép clipboard access khi browser hỏi

### Hình ảnh không hiển thị
- **Nguyên nhân:** URL không hợp lệ hoặc bị chặn CORS
- **Giải pháp:** 
  - Kiểm tra URL có truy cập được không
  - Dùng URL từ CDN công khai (Imgur, Cloudinary)
  - Upload ảnh lên hosting riêng

### Link không click được
- **Nguyên nhân:** Đang ở chế độ edit
- **Giải pháp:** Link chỉ click được khi xem preview/published

### Mất format khi save
- **Nguyên nhân:** Lỗi validation
- **Giải pháp:** Kiểm tra console log, báo lỗi cho dev

## 📱 Mobile Support

Editor hoạt động tốt trên mobile:
- Touch-friendly toolbar
- Auto-resize keyboard
- Responsive layout
- Copy/paste từ mobile browser

## 🎨 Styling

Editor tự động áp dụng style:
- Light mode: Nền trắng, text đen
- Dark mode: Nền tối, text trắng
- Responsive: Tự động co giãn
- Professional: Font, spacing chuẩn

## 📚 Advanced Features

### HTML Output
Editor lưu nội dung dưới dạng HTML:
```html
<h1>Tiêu đề</h1>
<p>Đoạn văn với <strong>chữ đậm</strong> và <em>chữ nghiêng</em></p>
<ul>
  <li>Mục 1</li>
  <li>Mục 2</li>
</ul>
```

### Safe HTML
- Tự động sanitize HTML
- Loại bỏ script tags
- Loại bỏ inline styles nguy hiểm
- Giữ lại format an toàn

### Extensible
Có thể thêm extensions:
- Table support
- Color picker
- Font size
- Text alignment
- Emoji picker
- Mention (@user)
- Hashtag (#tag)

## 🚀 Best Practices

### Mô Tả Ngắn (Excerpt)
- Giữ ngắn gọn (2-3 câu)
- Không dùng heading
- Có thể dùng bold để nhấn mạnh
- Tránh dùng hình ảnh

### Nội Dung (Content)
- Dùng heading để chia section
- Dùng list cho thông tin dễ đọc
- Thêm hình ảnh minh họa
- Thêm link tham khảo
- Dùng quote cho điểm nhấn

### SEO Tips
- Dùng H1 cho tiêu đề chính (1 lần)
- Dùng H2 cho các section
- Dùng H3 cho sub-section
- Thêm alt text cho ảnh (trong URL)
- Thêm internal links

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console (F12)
2. Thử refresh page
3. Thử browser khác
4. Liên hệ dev team

---

**Chúc bạn soạn thảo nội dung hiệu quả!** 🎉
