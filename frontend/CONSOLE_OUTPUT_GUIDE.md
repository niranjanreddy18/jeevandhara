# 📊 Expected Console Output Reference

This guide shows **exactly** what you should see in the browser console at each step.

---

## **Registration Flow - Full Console Output**

### **STEP 1: Click "Send OTP"**

```
📧 Sending OTP to email...
✅ OTP sent successfully
🔐 TEST CODE: 123456
```

✅ **Expected:** You see these three lines
❌ **Problem if:** Nothing appears (check DevTools is open)

**Action:** Copy the number `123456`

---

### **STEP 2: Enter OTP and Click "Register"**

```
========== REGISTRATION STARTED ==========

📋 STEP 1: Verifying OTP code...
✅ OTP verified successfully

📋 STEP 2: Creating account in Supabase...
✅ Account created successfully
👤 User ID: 550e8400-e29b-41d4-a716-446655440000

📋 STEP 3: Checking university affiliation...
ℹ️ No university found for this email
✅ University check complete. Role: user

📋 STEP 4: Saving profile to database...
💾 Saving user profile to database...
✅ User profile saved successfully
📊 Saved data: {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@gmail.com',
  phone: undefined,
  role: 'user'
}

========== REGISTRATION SUCCESSFUL ==========
```

✅ **Expected:** All 4 steps show success
✅ **Page:** Redirects to Login after 2 seconds
❌ **Problem if:** Any step shows error

---

## **If OTP Verification Fails**

If you entered wrong OTP code:

```
========== REGISTRATION STARTED ==========

📋 STEP 1: Verifying OTP code...
❌ OTP Verification Failed: OTP code expired or invalid
```

❌ **Action:**

1. Click "Send OTP" again (generates new code)
2. Copy new code from console
3. Enter it immediately
4. Try again

---

## **If Account Creation Fails**

If email already exists:

```
📋 STEP 2: Creating account in Supabase...
❌ Account Creation Failed: User already registered

========== REGISTRATION STOPPED ==========
```

❌ **Action:**

- Use a **different email address**
- Or delete the old test user from Supabase

---

## **If Database Save Fails**

If database connection is broken:

```
📋 STEP 4: Saving profile to database...
❌ Exception in saveUserProfile: Error: No authenticated user found

==========
```

❌ **Reason:** Supabase Auth succeeded but database save failed
❌ **Action:**

- Check `.env.local` has correct Supabase credentials
- Verify `profiles` table exists in Supabase
- Check table has all required columns

---

## **Login Flow - Full Console Output**

### **Click "Sign In"**

```
========== LOGIN STARTED ==========
🔐 Attempting login with Supabase...
✅ Login successful!
👤 User ID: 550e8400-e29b-41d4-a716-446655440000
📧 Email: test@gmail.com
========== LOGIN COMPLETE ==========
```

✅ **Expected:** All lines show success
✅ **Page:** Redirects to Dashboard
❌ **Problem if:** Shows error

---

## **If Login Fails**

### **Wrong Password**

```
========== LOGIN STARTED ==========
🔐 Attempting login with Supabase...
❌ Login Error: Invalid login credentials
```

❌ **Action:** Check password is correct

---

### **User Not Found**

```
========== LOGIN STARTED ==========
🔐 Attempting login with Supabase...
❌ Login Error: Email not registered
```

❌ **Action:** Register first, or use correct email

---

## **University Email Test - Console Output**

### **Register with stanford@stanford.edu**

First, add university to database:

```sql
INSERT INTO universities (name, official_email, total_contributed)
VALUES ('Stanford University', 'stanford.edu', 0);
```

Then register:

```
========== REGISTRATION STARTED ==========

📋 STEP 1: Verifying OTP code...
✅ OTP verified successfully

📋 STEP 2: Creating account in Supabase...
✅ Account created successfully
👤 User ID: 6e0ed45f-f39c-42e5-b827-557766551111

📋 STEP 3: Checking university affiliation...
✅ Found university: Stanford University
✅ University check complete. Role: university

📋 STEP 4: Saving profile to database...
💾 Saving user profile to database...
✅ User profile saved successfully
📊 Saved data: {
  userId: '6e0ed45f-f39c-42e5-b827-557766551111',
  email: 'staff@stanford.edu',
  phone: undefined,
  role: 'university'
}

========== REGISTRATION SUCCESSFUL ==========
```

✅ **Notice:** Role is `"university"` not `"user"`

---

## **Verify Data in Database - SQL Output**

### **Query All Profiles**

```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
```

**Result:**

```
id          | email              | username      | role        | is_active | created_at
=========================================================================================================
550e8400... | test@gmail.com     | testuser1     | user        | true      | 2026-03-02 15:30:45.123
6e0ed45f... | staff@stanford.edu | stanford_admin| university  | true      | 2026-03-02 15:35:22.456
```

✅ **Check:**

- Email matches registration
- Username matches registration
- Role is "user" or "university" based on email
- Timestamps are recent
- is_active is true

---

## **Common Console Issues**

### **Issue: "No authenticated user found"**

**Old Error (Before Fix):**

```
💥 Exception in saveUserProfile: Error: No authenticated user found
```

**Reason:** Registration was trying to save before creating auth account

**Status:** ✅ FIXED - Now creates auth account first

---

### **Issue: "Undefined OTP code"**

**If you see:**

```
🔐 TEST CODE: undefined
```

**Reason:** emailOTP.ts not correctly importing dummyOTP

**Check:**

```typescript
// In /src/lib/emailOTP.ts - should be true
const USE_DUMMY_OTP = true;
```

---

### **Issue: TypeError in Console**

**If you see:**

```
TypeError: Cannot read property 'verifyDummyOTP' of undefined
```

**Reason:** Import statement missing or incorrect

**Check file:**

```typescript
// /src/lib/emailOTP.ts
import { generateDummyEmailOTP, verifyDummyOTP } from "./dummyOTP";
```

---

### **Issue: Network Error**

**If you see:**

```
Failed to fetch
TypeError: Failed to fetch
```

**Reason:**

- Supabase URL is wrong or unreachable
- No internet connection
- CORS issue

**Check:**

```
/.env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## **Step-by-Step Debugging**

### **If Registration Doesn't Work**

1. **Open DevTools:** F12 → Console tab
2. **Click "Send OTP"**
   - ✅ See "✅ OTP sent successfully"?
   - ❌ See error? → Check emailOTP.ts imports
3. **Enter OTP Code**
   - See code in console (line 3)?
   - Copy and paste exactly
4. **Click Register**
   - ✅ See "STEP 1: Verifying OTP"?
   - ❌ See error? → Check dummyOTP.ts

### **If "STEP 2: Creating account" Fails**

- ❌ Check Supabase URL in `.env.local`
- ❌ Check Supabase ANON_KEY in `.env.local`
- ❌ Check internet connection

### **If "STEP 4: Saving profile" Fails**

- ❌ Check `profiles` table exists in Supabase
- ❌ Check table columns match code expectations
- ❌ Check Supabase auth actually succeeded (STEP 2)

---

## **Quick Reference - What Success Looks Like**

```
✅ OTP sent     → See TEST CODE in console
✅ OTP verified → Step 1 completes
✅ Account created → Step 2 shows User ID
✅ University check → Step 3 shows role
✅ Profile saved → Step 4 shows database data
✅ Redirected → Page goes to login
✅ Logged in → Can enter dashboard
```

---

**Use this guide to understand exactly what's happening at each step!** 🚀
