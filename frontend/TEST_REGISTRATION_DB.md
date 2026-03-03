# 🧪 Test Registration with Database Saving

Step-by-step guide to test the complete registration flow including database persistence.

---

## **1. Start the Development Server**

```bash
cd frontend
npm run dev
# or
pnpm dev
```

Open browser: `http://localhost:5173`

---

## **2. Test Registration - Regular User**

### **Step A: Fill Registration Form**

```
Email:          john@gmail.com
Username:       johndoe
Password:       Test@1234
Confirm Pass:   Test@1234
```

Click **Register**

---

### **Step B: Check Console for OTP Code**

Open DevTools: **F12 → Console tab**

Look for this message:

```
🔐 TEST OTP CODE: 123456
```

Copy the 6-digit code.

---

### **Step C: Enter OTP Code**

Input field will appear asking for OTP code.

Paste the code: `123456`

Click **Verify**

---

### **Step D: See Database Save Message**

After OTP verification, you'll see console output:

```
💾 Saving user profile to database...
🏫 Checking if email is from university...
ℹ️ No university found for this email
✅ User profile saved successfully
📊 Saved data: {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'john@gmail.com',
  phone: '+1415555267',
  role: 'user'  ← Regular user role
}
✅ User registered and data saved!
```

Page redirects to Login automatically.

---

## **3. Test Registration - University Email (Optional)**

### **Prerequisites:**

Add a test university to the `universities` table first:

**In Supabase Dashboard:**

1. Click **SQL Editor**
2. Run this SQL:

```sql
INSERT INTO universities (name, official_email, total_contributed)
VALUES ('Stanford University', 'stanford.edu', 0);
```

Click **Execute**

### **Then Test Registration:**

```
Email:          staff@stanford.edu    ← Use university domain!
Username:       stanford_staff
Password:       Test@1234
Confirm Pass:   Test@1234
```

Click **Register** → Enter OTP → See console output:

```
💾 Saving user profile to database...
🏫 Checking if email is from university...
✅ Found university: Stanford University
✅ User profile saved successfully
📊 Saved data: {
  userId: '6e0ed45f-f39c-42e5-b827-557766551111',
  email: 'staff@stanford.edu',
  phone: undefined,
  role: 'university'  ← University staff role!
}
✅ User registered and data saved!
```

---

## **4. Verify Data Was Saved in Database**

### **Method 1: Supabase Dashboard**

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** on left sidebar
3. Run this query:

```sql
SELECT id, email, username, role, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;
```

You should see your test users listed!

**Example Result:**

```
id                                    | email               | username        | role        | created_at
550e8400-e29b-41d4-a716-446655440000 | john@gmail.com      | johndoe         | user        | 2026-03-02 12:00:00
6e0ed45f-f39c-42e5-b827-557766551111 | staff@stanford.edu  | stanford_staff  | university  | 2026-03-02 12:05:00
```

### **Method 2: Table Editor**

1. Supabase Dashboard → **Table Editor**
2. Click `profiles` table
3. See all registered users in a grid view
4. Check columns: email, username, role, created_at

### **Method 3: Browser DevTools**

Open **F12 → Console tab**

The registration success messages show the exact data saved:

```
✅ User profile saved successfully
📊 Saved data: { userId, email, phone, role }
```

---

## **5. Troubleshooting**

### **Problem: No OTP Code in Console**

**Solution:**

- Make sure DevTools Console is open BEFORE clicking Register
- Check if USE_DUMMY_OTP is set to true in emailOTP.ts

### **Problem: "Failed to save user profile"**

**Solution:**

- Check Supabase connection (verify .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
- Verify `profiles` table exists in Supabase
- Check table has correct columns: id, email, phone, username, role, is_active, created_at

### **Problem: University Role Not Assigned**

**Solution:**

- Make sure `universities` table has the email domain you're testing
- Check official_email field matches (e.g., "stanford.edu" not "staff@stanford.edu")
- Run test SQL above to verify universities table is populated

### **Problem: Page Doesn't Redirect to Login**

**Solution:**

- Check browser console for error messages
- Verify Supabase auth is working (test login on login page)
- Try registering with different email

---

## **6. What's Being Tested**

✅ **Email Validation**

- Valid email formats accepted
- Invalid emails rejected

✅ **OTP Generation** (Dummy Mode)

- OTP code generated and displayed
- Code is 6 digits
- Code appears in console

✅ **OTP Verification**

- Code accepted when correct
- Rejected when incorrect

✅ **University Detection**

- Email domain checked against universities table
- Correct role assigned (user or university)

✅ **Database Persistence**

- User profile saved to profiles table
- All fields correctly stored (email, username, phone, role)
- Timestamps automatically set
- User ID matches Supabase auth ID

✅ **Error Handling**

- Database errors caught and displayed
- User sees meaningful error messages
- Can retry registration

---

## **7. Test Checklist**

Use this checklist to verify everything works:

```
☐ Can open registration form
☐ Can enter email, username, password
☐ OTP code appears in console
☐ Can enter OTP code and verify
☐ See success message in console
☐ Redirected to login page
☐ Can query profiles table in Supabase
☐ New user appears in profiles table
☐ User data shows correct email, username, role
☐ Timestamp shows current time
☐ Can register multiple users
☐ Each user gets unique ID
☐ University role assigned for university emails
☐ Regular role assigned for regular emails
```

---

## **8. Quick Test Commands**

**Check profiles table:**

```sql
SELECT COUNT(*) as total_users FROM profiles;
```

**See latest registrations:**

```sql
SELECT email, role, created_at FROM profiles
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Check universities:**

```sql
SELECT * FROM universities;
```

**Delete test user (if needed):**

```sql
DELETE FROM profiles WHERE email = 'test@example.com';
```

---

## **9. Before Moving to Real OTP**

Once database saving is working perfectly:

1. ✅ Test at least 3 registrations
2. ✅ Verify all data in Supabase database
3. ✅ Test university role assignment
4. ✅ Verify timestamps are correct
5. ✅ Test error handling (try invalid OTP)

**Then you can switch to real email OTP:**

In `/src/lib/emailOTP.ts`:

```typescript
const USE_DUMMY_OTP = false; // ← Change from true
```

This will use real Supabase email provider (after SendGrid setup).

---

**Ready to test! 🚀**
