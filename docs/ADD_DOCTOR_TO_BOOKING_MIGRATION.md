# Doctor Assignment Integration - FIXED

## Issue
Doctor selection was working in the UI (step 4 of booking flow), but `doctorId` was not being saved to the database.

## Root Cause
The `use-redux-cart.ts` hook was NOT sending `doctorId` to the API when adding items to cart, even though:
- ✅ MobileBooking.tsx was passing `doctorId` to `addToCart()`
- ✅ API endpoint `/api/v1/cart` POST was ready to accept `doctorId`
- ✅ Prisma schema had `doctorId` field in Cart model

## Fix Applied

### Updated `hooks/use-redux-cart.ts`

1. **POST request (addToCart)** - Added `doctorId` to API payload:
```typescript
body: JSON.stringify({
  serviceId: item.serviceId,
  date: item.date,
  time: item.time,
  doctorId: item.doctorId, // ✅ ADDED
}),
```

2. **Response handling** - Include `doctorId` when adding to Redux:
```typescript
dispatch(
  addToCartAction({
    id: newItem.id,
    serviceId: newItem.serviceId,
    serviceName: newItem.service.name,
    price: newItem.service.price,
    date: newItem.date,
    time: newItem.time,
    photos: [],
    doctorId: newItem.doctorId, // ✅ ADDED
  }),
)
```

3. **GET cart (load from database)** - Include `doctorId` in formatted cart:
```typescript
const formattedCart = dbCart.map((item: any) => ({
  id: item.id,
  serviceId: item.serviceId,
  serviceName: item.service.name,
  price: item.service.price,
  date: item.date,
  time: item.time,
  photos: [],
  doctorId: item.doctorId, // ✅ ADDED
}))
```

4. **PUT request (updateCartItem)** - Added `doctorId` to API updates:
```typescript
const apiUpdates: { serviceId?: string; date?: string; time?: string; doctorId?: string } = {}
if (updates.serviceId) apiUpdates.serviceId = updates.serviceId
if (updates.date) apiUpdates.date = updates.date
if (updates.time) apiUpdates.time = updates.time
if (updates.doctorId !== undefined) apiUpdates.doctorId = updates.doctorId // ✅ ADDED
```

5. **Update response handling** - Include `doctorId` in Redux update:
```typescript
dispatch(
  updateCartItemAction({
    id,
    updates: {
      serviceId: updatedItem.serviceId,
      serviceName: updatedItem.service.name,
      price: updatedItem.service.price,
      date: formattedDate,
      time: updatedItem.time,
      photos: updates.photos || [],
      doctorId: updatedItem.doctorId, // ✅ ADDED
    },
  }),
)
```

## Testing Steps

1. **Clear existing cart data**:
   - Log out and log back in (to clear Redux state)
   - Or manually clear cart items from database

2. **Test booking flow**:
   - Open mobile booking modal
   - Step 1: Select a service
   - Step 2: Select a date
   - Step 3: Select a time
   - Step 4: Select a doctor ✅
   - Step 5: Confirm booking
   - Click "Đặt lịch" button

3. **Verify doctorId is saved**:
   - Check cart in database: `SELECT * FROM Cart;`
   - Should see `doctorId` column populated
   - Check HomePage "Lịch hẹn sắp tới" - should show doctor name
   - Check AppointmentsPage "Sắp Tới" tab - should show doctor name
   - After checkout, check admin BookingTable - should show doctor in column

4. **Verify doctor display**:
   - HomePage: Shows "BS. [Doctor Name]" under booking details
   - AppointmentsPage: Shows "BS. [Doctor Name]" in booking card
   - Admin BookingTable: Shows doctor name in "Bác sĩ" column
   - BookingDetailsDialog: Shows doctor info in popup

## Files Modified
- ✅ `hooks/use-redux-cart.ts` - Added doctorId to all API calls and Redux actions

## Already Completed (Previous Work)
- ✅ `prisma/schema.prisma` - Added doctorId to Cart and Booking models
- ✅ `app/api/v1/cart/route.ts` - API accepts and saves doctorId
- ✅ `app/api/v1/checkout/route.ts` - Transfers doctorId from cart to booking
- ✅ `components/home/MobileBooking.tsx` - Passes doctorId to addToCart
- ✅ `components/home/HomePage.tsx` - Displays doctor name
- ✅ `components/home/AppointmentsPage.tsx` - Displays doctor name
- ✅ `components/admin/bookings/BookingTable.tsx` - Shows doctor column
- ✅ `store/cartSlice.ts` - CartItem type includes doctorId

## Expected Result
After this fix, when users select a doctor in step 4 of the booking flow, the `doctorId` will be:
1. ✅ Sent to the API
2. ✅ Saved in the Cart table
3. ✅ Loaded when fetching cart
4. ✅ Displayed in HomePage, AppointmentsPage, and Admin
5. ✅ Transferred to Booking table during checkout
