# Cart Tab - Tab Giỏ Hàng

## Tổng Quan
Thêm tab "Giỏ hàng" vào bottom navigation để user dễ dàng xem và quản lý giỏ hàng của mình.

## Thay Đổi

### 1. Thêm Tab Giỏ Hàng
**Trước:** 5 tabs (Trang chủ, Tin nhắn, Lịch hẹn, CTV, Cá nhân)

**Sau:** 5 tabs (Trang chủ, Tin nhắn, Lịch hẹn, **Giỏ hàng**, Cá nhân)
- Thay tab "CTV" bằng tab "Giỏ hàng"
- Icon: ShoppingCart
- Badge: Hiển thị số lượng items trong cart

### 2. Tạo CartPage Component
Component mới để hiển thị giỏ hàng trong mobile layout

**Features:**
- Hiển thị danh sách items trong cart
- Service name, date, time, price
- Edit và delete buttons
- Total price
- Checkout button
- Continue shopping button
- Empty state

### 3. Xóa Float Cart Button
**Trước:** 
- Float button ở góc dưới bên phải
- Cart sidebar slide từ bên phải

**Sau:**
- Không còn float button
- Không còn cart sidebar
- User click vào tab "Giỏ hàng" để xem

### 4. Badge Notification
Thêm badge trên icon Giỏ hàng để hiển thị số lượng items
- Badge màu đỏ
- Hiển thị số lượng (max 99+)
- Real-time update khi thêm/xóa items

## Components

### CartPage
Component hiển thị giỏ hàng trong mobile layout

**Props:**
- `onNavigateToHome?: () => void` - Callback để quay về trang chủ

**Features:**
- **Header:** Title + item count + Clear all button
- **Cart Items:** List of items với vertical card layout
- **Summary Footer:** Total price + Checkout + Continue shopping
- **Empty State:** Icon + message + Add service button

**Layout:**
```
┌─────────────────────────────────────┐
│ Header (Primary background)         │
│ - Giỏ Hàng                          │
│ - X dịch vụ                         │
│ - [Xóa tất cả]                      │
├─────────────────────────────────────┤
│ Cart Items                          │
│ ┌─────────────────────────────────┐ │
│ │ 🎨 Service Name                 │ │
│ │    Date & Time                  │ │
│ │ ─────────────────────────────── │ │
│ │ 500,000đ          [Edit] [Del]  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Fixed Footer                        │
│ - Tổng cộng: 500,000đ              │
│ - [Thanh toán]                     │
│ - [Tiếp tục mua sắm]               │
└─────────────────────────────────────┘
```

### MobileLayout (Updated)
**Changes:**
- Import CartPage và useCart
- Thay tab CTV bằng tab Cart
- Thêm badge cho cart icon
- Add cart case trong renderContent

**Tabs:**
```typescript
const tabs = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'messages', label: 'Tin nhắn', icon: MessageCircle },
  { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
  { id: 'cart', label: 'Giỏ hàng', icon: ShoppingCart, badge: cartCount },
  { id: 'profile', label: 'Cá nhân', icon: User },
]
```

### MobileBooking (Updated)
**Removed:**
- Float cart button
- Cart sidebar
- isCartOpen state
- Cart open/close logic
- CartSummary import

**Kept:**
- Auto add to cart when service, date, time selected
- Toast notification
- All booking flow logic

## User Flow

### Add to Cart
1. User chọn dịch vụ, ngày, giờ trong booking dialog
2. Auto add to cart
3. Toast notification: "Đã thêm vào giỏ hàng"
4. Badge trên tab Giỏ hàng tăng lên
5. Dialog đóng, reset về step 1

### View Cart
1. User click vào tab "Giỏ hàng"
2. Hiển thị CartPage với danh sách items
3. Xem thông tin chi tiết từng item
4. Xem tổng giá

### Edit Item
1. Click icon Edit (pencil)
2. Mở EditCartItemDialog
3. Chỉnh sửa date, time, photos
4. Save → Cart update

### Delete Item
1. Click icon Delete (trash)
2. Item bị xóa
3. Toast: "Đã xóa khỏi giỏ hàng"
4. Badge update
5. Nếu cart empty → Show empty state

### Clear All
1. Click "Xóa tất cả"
2. Toast confirmation với action buttons
3. Click "Xóa" → Clear cart
4. Show empty state

### Checkout
1. Click "Thanh toán"
2. Navigate to /checkout
3. Fill form và complete booking

### Continue Shopping
1. Click "Tiếp tục mua sắm"
2. Navigate về tab "Trang chủ"
3. Có thể thêm dịch vụ khác

## Badge Logic

### Display Rules
- Badge chỉ hiển thị khi cartCount > 0
- Hiển thị số lượng chính xác
- Max 99+ (nếu > 99)
- Position: top-right của icon
- Color: Red (#EF4444)
- Size: 16px min-width, 16px height

### Update Triggers
- Add item → Badge tăng
- Remove item → Badge giảm
- Clear cart → Badge = 0 (ẩn)
- Edit item → Badge không đổi

## Styling

### Colors
- Primary: #EAB308 (Golden Yellow)
- Red: #EF4444 (Badge, delete)
- Background: slate-50 (light), slate-900 (dark)

### Layout
- Max width: 430px
- Bottom navigation height: ~72px
- Fixed footer height: ~140px
- Content area: calc(100vh - 72px - 140px)

### Spacing
- Header padding: pt-12 pb-6 px-6
- Content padding: px-6 py-6
- Item spacing: space-y-3
- Footer padding: p-4

### Border Radius
- Cards: rounded-2xl (16px)
- Buttons: rounded-xl (12px)
- Header: rounded-b-[40px]

## Empty State

### Display
- Icon: ShoppingCart (w-10 h-10)
- Title: "Giỏ Hàng Trống"
- Description: "Thêm dịch vụ vào giỏ hàng để bắt đầu"
- Button: "Thêm dịch vụ" với Plus icon

### Behavior
- Click button → Navigate to home tab
- Centered vertically and horizontally
- Friendly, encouraging message

## Files

### Created
- `components/home/CartPage.tsx` - Cart tab component

### Modified
- `components/layout/MobileLayout.tsx` - Added cart tab, badge logic
- `components/home/MobileBooking.tsx` - Removed float button & sidebar

### Documentation
- `components/home/CART_TAB_README.md` - This file

## Benefits

### User Experience
✅ Easier access to cart (dedicated tab)
✅ Always visible badge notification
✅ No need to open sidebar
✅ Consistent with mobile app patterns
✅ Clear navigation

### UI/UX
✅ Cleaner interface (no float button)
✅ More screen space
✅ Better organization
✅ Familiar tab pattern
✅ Real-time badge updates

### Performance
✅ No sidebar animation overhead
✅ Simpler component tree
✅ Less state management
✅ Faster navigation

## Testing

### Manual Testing
1. **Add to Cart**
   - [ ] Add service → Badge appears
   - [ ] Badge shows correct count
   - [ ] Toast notification works

2. **View Cart Tab**
   - [ ] Click cart tab → Shows CartPage
   - [ ] Items display correctly
   - [ ] Total price correct
   - [ ] All buttons work

3. **Edit Item**
   - [ ] Click edit → Dialog opens
   - [ ] Change date/time → Updates
   - [ ] Badge count unchanged

4. **Delete Item**
   - [ ] Click delete → Item removed
   - [ ] Toast shows
   - [ ] Badge updates
   - [ ] Total recalculates

5. **Clear All**
   - [ ] Click clear all → Confirmation
   - [ ] Confirm → Cart cleared
   - [ ] Empty state shows
   - [ ] Badge disappears

6. **Checkout**
   - [ ] Click checkout → Navigate to /checkout
   - [ ] Cart data preserved

7. **Continue Shopping**
   - [ ] Click button → Navigate to home
   - [ ] Cart data preserved

8. **Empty State**
   - [ ] Shows when cart empty
   - [ ] Button navigates to home

9. **Badge**
   - [ ] Shows when count > 0
   - [ ] Hides when count = 0
   - [ ] Updates in real-time
   - [ ] Shows 99+ when > 99

## Migration Notes

### For Users
- No breaking changes
- Cart functionality same
- New tab for easier access
- Badge shows item count

### For Developers
- CartSummary component still used in checkout
- useCart hook unchanged
- Cart logic unchanged
- Only UI/navigation changed

## Future Enhancements

1. **Swipe to Delete**
   - Swipe left on item to delete
   - Common mobile pattern

2. **Quantity Selector**
   - Add +/- buttons
   - Book multiple of same service

3. **Save for Later**
   - Move items to wishlist
   - Book later

4. **Cart Expiry**
   - Show countdown timer
   - Auto-clear after 24h

5. **Quick Add**
   - Add from cart page
   - No need to go back to home

6. **Share Cart**
   - Share cart with friends
   - Group booking
