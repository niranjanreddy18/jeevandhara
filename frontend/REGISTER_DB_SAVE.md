# ✅ User Registration - Database Storage

After successful registration, user data is automatically saved to Supabase database.

---

## **What Gets Saved:**

### **Primary Table: `profiles`**

When user registers, their profile is saved with:

```
{
  id:         UUID (from Supabase auth)
  email:      "user@example.com"
  phone:      "+1234567890" (if phone verification used)
  username:   "john_doe"
  role:       "user" or "university" (auto-detected)
  is_active:  true
  created_at: "2026-03-02T19:30:00Z"
}
```

---

## **Role Assignment Logic:**

**Automatic Role Detection:**

```
User registers with: user@gmail.com
  ↓
System checks: Is this a university email?
  ↓
NO → role = "user" (default)
  ↓
Save to database
```

**If University Email:**

```
User registers with: someone@institution.edu
  ↓
System checks: Does universities table have official_email = "institution.edu"?
  ↓
YES → role = "university"
  ↓
Save to database with university role
```

---

## **Database Tables Used:**

### **1. `profiles` table**

Stores user account information

- **id** (UUID) - Supabase user ID
- **email** (string) - User email
- **phone** (string, optional) - User phone
- **username** (string) - Username
- **role** (enum) - 'user', 'university', 'admin'
- **is_active** (boolean) - Account active status
- **created_at** (timestamp) - Registration timestamp

### **2. `universities` table** (checked during registration)

Stores university information

- **id** (UUID)
- **name** (string) - University name
- **official_email** (string) - Official email domain (e.g., "institution.edu")
- **total_contributed** (numeric) - Total funding contributed

---

## **Registration Flow with DB Save:**

```
1. User enters: email, username, password, OTP
   ↓
2. OTP verified ✅
   ↓
3. Check universities table for email match
   ↓
4. Determine role (user or university)
   ↓
5. Save profile to database
   ↓
6. Display success message
   ↓
7. User can log in
```

---

## **Example Registration Data:**

**Registration 1: Regular User**

```
Email:    john@gmail.com
Username: john_doe
Phone:    +14155552671
OTP:      verified ✅

↓ SAVED TO DATABASE ↓

profiles table:
{
  id:         "550e8400-e29b-41d4-a716-446655440000",
  email:      "john@gmail.com",
  phone:      "+14155552671",
  username:   "john_doe",
  role:       "user",              ← Auto-detected (not a university email
  is_active:  true,
  created_at: "2026-03-02T12:00:00Z"
}
```

**Registration 2: University Staff**

```
Email:    staff@stanford.edu
Username: stanford_admin
Phone:    +14085551234
OTP:      verified ✅

↓ Checks universities table ↓
Found: stanford.edu is in universities table!

↓ SAVED TO DATABASE ↓

profiles table:
{
  id:         "6e0ed45f-f39c-42e5-b827-557766551111",
  email:      "staff@stanford.edu",
  phone:      "+14085551234",
  username:   "stanford_admin",
  role:       "university",        ← Auto-detected (university email)
  is_active:  true,
  created_at: "2026-03-02T12:05:00Z"
}
```

---

## **Console Output After Registration:**

```
💾 Saving user profile to database...
🏫 Checking if email is from university...
ℹ️ No university found for this email
✅ User profile saved successfully
📊 Saved data: {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'john@gmail.com',
  phone: '+14155552671',
  role: 'user'
}
✅ User registered and data saved!
```

---

## **How to Verify Data Was Saved:**

1. **In Supabase Dashboard:**
   - Go to your project
   - Click **SQL Editor**
   - Run:
     ```sql
     SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
     ```
   - You should see your new user!

2. **Browser Console:**
   - Open DevTools (F12)
   - Console tab shows:
     ```
     ✅ User profile saved successfully
     📊 Saved data: { userId, email, role, ... }
     ```

---

## **What NOT Stored:**

❌ **Passwords** - Supabase handles authentication
❌ **OTP Codes** - Only used for verification, then deleted
❌ **Sessions** - Supabase manages auth sessions
❌ **Sensitive Data** - Use RLS policies to protect data

---

## **Next Steps (If Needed):**

- Set university email domain in `universities` table
- Create additional profile fields (location, profile picture, etc.)
- Implement role-based dashboards
- Add profile update functionality
- Create admin approval workflow

---

## **Database Structure Check:**

To see your actual database tables and structure:

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You'll see all tables with columns and data types
4. `profiles` table shows all registered users
5. `universities` table shows registered institutions

---

**Your registration data is now persistent in Supabase! 🎉**
