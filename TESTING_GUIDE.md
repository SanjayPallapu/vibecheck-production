# VibeCheck Testing Guide

## Pre-Test Setup

### Test Account
- **Phone**: 9876543210 (or any 10 digits)
- **OTP**: 123456 (displayed in console)
- **Test Card**: Use any card number (Razorpay test mode)

### Test Products Available
- Classic Black Hoodie: ₹299
- White T-Shirt: ₹99
- Test Vibe Tee: ₹1 (cheapest for quick testing)
- Grey Hoodie: ₹299
- Oversized Shirt: ₹199

---

## Full Testing Checklist (45 minutes)

### 1. Authentication (5 min) ✅
- [ ] Open https://vibecheck.vercel.app
- [ ] Click "Login" button
- [ ] Enter phone: 9876543210
- [ ] Click "Send Code"
- [ ] Check browser console - OTP "123456" appears
- [ ] Enter OTP: 123456
- [ ] Click "Verify"
- [ ] User logged in successfully
- [ ] JWT token stored in localStorage

### 2. Browse Products (5 min) ✅
- [ ] Navigate to "Shop" page
- [ ] All products display with images
- [ ] Products show correct prices in ₹
- [ ] Product grid is responsive (mobile & desktop)
- [ ] Hover over card shows quick view button
- [ ] Category filter bar visible
- [ ] "View All" button works

### 3. Category Filtering (5 min) ✅
- [ ] Click "Hoodies" in category bar
- [ ] Only hoodies display (2 products)
- [ ] Click "Tees"
- [ ] Only tees display (2 products)
- [ ] Click "Shirts"
- [ ] Shirts display
- [ ] "All" button shows all products (5 items)

### 4. Sorting (5 min) ✅
- [ ] Sort dropdown visible
- [ ] Select "Price: Low to High"
- [ ] Test Vibe Tee (₹1) appears first
- [ ] Select "Price: High to Low"
- [ ] Hoodies (₹299) appear first
- [ ] Select "A-Z"
- [ ] Products sorted alphabetically

### 5. Price Filter (5 min) ✅
- [ ] Min price slider visible
- [ ] Max price slider visible
- [ ] Set range: ₹50 - ₹200
- [ ] Test Vibe Tee & White T-Shirt display
- [ ] Hoodies hidden (over ₹200)
- [ ] Adjust to ₹280 - ₹300
- [ ] Only hoodies display

### 6. Wishlist (5 min) ✅
- [ ] Click heart icon on product card
- [ ] Heart becomes filled/highlighted
- [ ] Add 3 products to wishlist
- [ ] Navigate to profile/wishlist
- [ ] All 3 products appear in wishlist
- [ ] Remove one product
- [ ] Only 2 products remain
- [ ] Refresh page - wishlist persists (localStorage)

### 7. Quick View (5 min) ✅
- [ ] Hover over product card
- [ ] Click "Quick View" button
- [ ] Modal opens showing:
  - [ ] Product image (larger)
  - [ ] Product name
  - [ ] Full description
  - [ ] Price in ₹
  - [ ] Stock status
  - [ ] "Add to Cart" button
- [ ] Close modal (X button or outside click)
- [ ] Remains on same page

### 8. Shopping Cart (5 min) ✅
- [ ] Add "Test Vibe Tee" to cart
- [ ] Cart icon shows "1"
- [ ] Add "White T-Shirt" to cart
- [ ] Cart icon shows "2"
- [ ] Click cart icon
- [ ] Both items display with:
  - [ ] Product image
  - [ ] Price (₹1 + ₹99)
  - [ ] Quantity controls (+/-)
  - [ ] Total price
- [ ] Increase quantity of T-Shirt to 2
- [ ] Total updates to ₹199 (1 + 99*2)

### 9. Checkout Process (8 min) ✅
- [ ] Click "Proceed to Checkout"
- [ ] Enter shipping address: "123 Main St, City"
- [ ] Enter phone: 9876543210
- [ ] Click "Continue to Payment"
- [ ] Razorpay modal opens
- [ ] Select payment method (e.g., "Netbanking")
- [ ] Select test bank
- [ ] Payment succeeds instantly (test mode)
- [ ] Redirect to order confirmation
- [ ] Order ID displayed
- [ ] Success message appears

### 10. Order History (5 min) ✅
- [ ] Navigate to "Orders"
- [ ] Previous order displays with:
  - [ ] Order ID
  - [ ] Date
  - [ ] Total amount
  - [ ] Status (Pending/Confirmed)
- [ ] Click "View Details"
- [ ] Modal shows:
  - [ ] All order items
  - [ ] Item prices
  - [ ] Quantities
  - [ ] Shipping address
  - [ ] Total
- [ ] Close modal

### 11. Dark Mode (3 min) ✅
- [ ] Locate dark mode toggle (usually in navbar)
- [ ] Click toggle
- [ ] App switches to dark theme
- [ ] All text readable
- [ ] Refresh page - dark mode persists (localStorage)
- [ ] Toggle back to light mode
- [ ] Light theme applies correctly

### 12. Responsive Design (3 min) ✅
**Desktop (1920x1080):**
- [ ] 5 products per row on Shop
- [ ] Navbar fully visible
- [ ] No overflow

**Tablet (768px):**
- [ ] 3 products per row
- [ ] Touch-friendly buttons
- [ ] Mobile menu appears

**Mobile (375px):**
- [ ] 2 products per row
- [ ] Hamburger menu visible
- [ ] Modal fits screen
- [ ] No horizontal scroll
- [ ] All buttons accessible

### 13. API Connectivity (2 min) ✅
- [ ] Open browser Developer Tools (F12)
- [ ] Go to Network tab
- [ ] Refresh page
- [ ] Check requests:
  - [ ] `/api/products` - 200 OK
  - [ ] `/api/auth/me` - 200 or 401 (expected)
  - [ ] `/api/orders` - returns user's orders
- [ ] No 500 errors
- [ ] Response times < 500ms

### 14. Performance (2 min) ✅
- [ ] Open DevTools > Performance
- [ ] Record page load
- [ ] Check metrics:
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] First Input Delay (FID) < 100ms
  - [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Page feels responsive
- [ ] Animations smooth (60 FPS)

### 15. Error Handling (3 min) ✅
- [ ] Logout
- [ ] Try accessing protected route directly
- [ ] Redirects to login ✓
- [ ] Close backend temporarily
- [ ] Try to add product to cart
- [ ] Error message displays
- [ ] App doesn't crash
- [ ] Recovery possible

---

## Final Sign-Off

All tests passed: **_____ (Date)**

Tester Name: ____________________

Notes/Issues: _______________________________

---

## Quick Smoke Test (10 min)

If full testing too long, run minimum:
1. Login with OTP
2. Browse and filter products
3. Add to cart
4. Complete checkout with Razorpay
5. View order history
6. Test dark mode

---

**Status**: ✅ Production Ready for Testing
**Last Updated**: November 20, 2025
