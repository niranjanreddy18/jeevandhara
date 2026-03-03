# 🔐 Clear Registration & Authentication Flow

Your registration now follows a **clear 4-step process** with **database persistence**.

---

## **Complete Registration Flow**

```
STEP 1: Send OTP Code
  ↓ (User provides email)
  └─→ Dummy OTP generated locally
      └─→ Code shown in browser console
          └─→ Valid for 10 minutes

STEP 2: Verify OTP Code
  ↓ (User enters the 6-digit code)
  └─→ Code validated against stored code
      └─→ Success: Continue to next step
      └─→ Failure: Show error, try again

STEP 3: Create Account in Supabase
  ↓ (OTP verified, now create auth account)
  └─→ Email and Password sent to Supabase Auth
      └─→ Account created successfully
      └─→ User gets unique ID in Supabase

STEP 4: Save Profile to Database
  ↓ (Account exists, now persist profile data)
  ├─→ Check if email is from a university
  ├─→ Assign role ("user" or "university")
  └─→ Save to profiles table in database
      └─→ Email, Username, Phone, Role stored
      └─→ Timestamp recorded
      └─→ User ID linked to profile
```

---

## **Test Registration (Step by Step)**

### **1. Open Registration Form**

Go to: `http://localhost:5173`

Click the **Register** tab

---

### **2. Fill Basic Information**

```
Email:                test@gmail.com
Username:             testuser1
Password:             Test@1234
Confirm Password:     Test@1234
```

Click **Send OTP** (Email option selected)

---

### **3. Console Output - OTP Generated**

Open DevTools: **F12 → Console tab**

You should see:

```
📧 Sending OTP to email...
✅ OTP sent successfully
🔐 TEST CODE: 123456
```

**Copy the 6-digit code: `123456`**

---

### **4. Enter OTP Code**

Below the email field, a text box appears:

```
[Enter OTP Code: ____]
```

Paste the code you copied: `123456`

---

### **5. Click Register Button**

Click the **Register** button

---

### **6. Console Output - Detailed Process**

Console shows the complete flow:

```
========== REGISTRATION STARTED ==========

📋 STEP 1: Verifying OTP code...
✅ OTP verified successfully

📋 STEP 2: Creating account in Supabase...
✅ Account created successfully
👤 User ID: 550e8400-e29b-41d4-a716-446655440000

📋 STEP 3: Checking university affiliation...
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

---

### **7. Auto-Redirect to Login**

After 2 seconds, page automatically redirects to **Login tab**

Your email is pre-filled: `test@gmail.com`

---

## **Verify Data Was Saved in Database**

### **Method 1: Supabase Dashboard**

1. Go to Supabase Dashboard → Your Project
2. Click **SQL Editor** on the left
3. Run this query:

```sql
SELECT id, email, username, role, created_at
FROM profiles
WHERE email = 'test@gmail.com'
ORDER BY created_at DESC;
```

**Result:**

```
id                                    | email        | username | role | created_at
550e8400-e29b-41d4-a716-446655440000 | test@gmail.com | testuser1 | user | 2026-03-02 15:30:45
```

---

### **Method 2: Browse in Table Editor**

1. Supabase Dashboard → **Table Editor**
2. Click `profiles` table
3. See all registered users in a grid
4. Check your new user is listed

---

## **Then: Test Login**

### **1. Stay on Login Tab**

Email should be pre-filled: `test@gmail.com`

**Enter:**

- Email: `test@gmail.com`
- Password: `Test@1234`

Click **Sign In**

---

### **2. Console Output - Login**

```
========== LOGIN STARTED ==========
🔐 Attempting login with Supabase...
✅ Login successful!
👤 User ID: 550e8400-e29b-41d4-a716-446655440000
📧 Email: test@gmail.com
========== LOGIN COMPLETE ==========
```

---

### **3. Redirect to Dashboard**

You should see:

```
Welcome Back!

You are logged in as: 550e8400-e29b-41d4-a716-446655440000

[Go to Dashboard]
[Logout]
```

---

## **Test with University Email (Optional)**

To test university role assignment:

### **1. Add Test University**

In Supabase Dashboard → **SQL Editor**, run:

```sql
INSERT INTO universities (name, official_email, total_contributed)
VALUES ('Stanford University', 'stanford.edu', 0);
```

---

### **2. Register with University Email**

```
Email:                staff@stanford.edu
Username:             stanford_admin
Password:             Test@1234
Confirm Password:     Test@1234
```

Send OTP → Enter OTP → Click Register

---

### **3. Check Console Output**

You should see:

```
📋 STEP 3: Checking university affiliation...
✅ Found university: Stanford University
✅ University check complete. Role: university
```

---

### **4. Check Database**

```sql
SELECT email, role FROM profiles
WHERE email = 'staff@stanford.edu';
```

Result:

```
email               | role
staff@stanford.edu  | university
```

---

## **Troubleshooting**

### **Problem: No OTP Code in Console**

**Check:**

- DevTools console is open BEFORE clicking "Send OTP"
- `USE_DUMMY_OTP = true` in `/src/lib/emailOTP.ts`

**Fix:**

```
cd frontend
npm run dev
```

---

### **Problem: "Invalid OTP Code"**

**Reason:** OTP code expired (10 minute limit) or typo

**Fix:**

- Click "Send OTP" again to generate a new code
- Copy the new code from console
- Enter it immediately

---

### **Problem: "Account creation failed"**

**Reason:** Email already registered in Supabase

**Fix:**

- Use a different email address
- Delete old test user from Supabase if needed

---

### **Problem: "Failed to save profile"**

**Reason:** Database connection issue

**Check:**

- `.env.local` has correct Supabase credentials
- `profiles` table exists in Supabase
- Table has all required columns

**Verify in Supabase:**

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles';
```

---

### **Problem: Login Shows "Invalid credentials"**

**Reasons:**

- Wrong email/password
- User wasn't created (check Steps 1-3 above)
- Password was changed during registration

**Fix:**

- Use exact email you registered with
- Use exact password from registration form

---

## **Complete Test Checklist**

```
REGISTRATION:
☐ Can open registration form
☐ Can fill email, username, password
☐ Click "Send OTP" generates code
☐ OTP code appears in console
☐ Can enter OTP code in form
☐ Click "Register" processes registration
☐ Console shows all 4 steps completing
☐ Page redirects to login after 2 seconds
☐ Email pre-filled in login form

DATABASE:
☐ Query profiles table shows new user
☐ All fields correct (email, username, role)
☐ Timestamp shows current time
☐ User ID matches Supabase Auth ID

LOGIN:
☐ Can enter email and password
☐ Click "Sign In" authenticates
☐ Console shows login successful
☐ Redirected to dashboard
☐ Dashboard shows correct user ID

CLEANUP:
☐ Can click "Logout"
☐ Returns to login page
☐ Can register another user
☐ Each user gets unique ID
```

---

## **What Was Fixed**

✅ **OTP Verification** - Now actually validates OTP code before allowing registration
✅ **Auth Account Creation** - Creates account in Supabase Auth after OTP verified  
✅ **Database Persistence** - Saves user profile data to database table
✅ **University Detection** - Auto-assigns role based on email domain
✅ **Clear Console Output** - Shows each step with emojis and detailed info
✅ **Error Handling** - Shows specific error messages if anything fails
✅ **Auto-Login** - Pre-fills email and pre-fills in login form after registration

---

**Everything is now working with clear, step-by-step feedback!** 🎉

The registration flow is complete, and all data is persisted to the Supabase database.
