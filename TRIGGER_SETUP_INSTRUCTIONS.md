# 🔧 Auto-Create User Profile Trigger - Setup Instructions

## Problem
When users sign up through Supabase Auth, they are only added to the `auth.users` table, but NOT to your `user_profiles` table. This causes the app to fail because it can't find the user profile.

## Solution
We've created a database trigger that automatically creates a `user_profiles` entry whenever a new user signs up.

---

## 📋 Step-by-Step Setup

### Step 1: Run the Trigger SQL

1. **Open Supabase SQL Editor**
   - Go to your Supabase project
   - Click on **SQL Editor** in the left sidebar

2. **Run the Trigger Script**
   - Copy the entire contents of `auto-create-profile-trigger.sql`
   - Paste into the SQL Editor
   - Click **RUN** (or press `Ctrl+Enter`)

3. **Verify Success**
   - You should see: `Success. No rows returned`
   - This means the function and trigger were created successfully

### Step 2: Test the Trigger

**Option A: Test via SQL**
```sql
-- This simulates what happens when someone signs up
-- The trigger should automatically create a user_profiles entry

-- Check current profiles
SELECT * FROM user_profiles;

-- Create a test user via Auth (if you want to test manually)
-- Or just try signing up through your app
```

**Option B: Test via App**
1. Go to your signup page (`/signup`)
2. Fill in the form as a student or host
3. Click "Sign up"
4. Check Supabase:
   - **Authentication → Users** should have the new user
   - **Table Editor → user_profiles** should automatically have a matching entry

### Step 3: Verify the Updated React Code

The `AuthContextNew.jsx` has been updated to work with the trigger:

**What changed:**
- ✅ Adds `full_name` to user metadata during signup
- ✅ Trigger automatically creates basic `user_profiles` entry
- ✅ App updates the profile with role and phone number
- ✅ App creates role-specific profile (guest_profiles or host_profiles)

**No changes needed on your part** - it's already updated!

---

## 🧪 Testing Checklist

### Test Guest Signup:
- [ ] Go to `/signup`
- [ ] Select "I'm a Student"
- [ ] Fill in: Name, Email, Password, University, Course, Year
- [ ] Click "Sign up"
- [ ] **Expected Results:**
  - ✅ User created in `auth.users`
  - ✅ Profile automatically created in `user_profiles` (via trigger)
  - ✅ Profile updated with role='guest'
  - ✅ Entry created in `guest_profiles`
  - ✅ Redirected to `/guest` dashboard

### Test Host Signup:
- [ ] Go to `/signup`
- [ ] Select "I'm a Host"
- [ ] Fill in: Name, Email, Password, Address, City, Postcode
- [ ] Click "Sign up"
- [ ] **Expected Results:**
  - ✅ User created in `auth.users`
  - ✅ Profile automatically created in `user_profiles` (via trigger)
  - ✅ Profile updated with role='host'
  - ✅ Entry created in `host_profiles`
  - ✅ Redirected to `/host` dashboard

### Verify in Supabase:

**After signup, check these tables:**

1. **auth.users**
   ```sql
   SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```
   Should show your new user

2. **user_profiles**
   ```sql
   SELECT id, email, role, full_name, is_verified FROM user_profiles ORDER BY created_at DESC LIMIT 5;
   ```
   Should show matching profile with correct role

3. **guest_profiles or host_profiles**
   ```sql
   -- For guest
   SELECT * FROM guest_profiles ORDER BY created_at DESC LIMIT 5;

   -- For host
   SELECT * FROM host_profiles ORDER BY created_at DESC LIMIT 5;
   ```
   Should show role-specific data

---

## 🐛 Troubleshooting

### Issue: "user_profiles table is still empty after signup"

**Solution 1: Check if trigger was created**
```sql
-- List all triggers
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```
If no results, the trigger wasn't created. Re-run `auto-create-profile-trigger.sql`

**Solution 2: Check function exists**
```sql
-- List all functions
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```
If no results, re-run the trigger script

**Solution 3: Check for errors**
- Go to Supabase → Logs → Postgres Logs
- Look for any errors related to the trigger
- Common issue: Permission errors (the function uses SECURITY DEFINER)

### Issue: "Error: duplicate key value violates unique constraint"

This means the trigger created the profile, but the app is trying to insert again.

**Solution:** Make sure you're using the updated `AuthContextNew.jsx` which uses UPDATE instead of INSERT.

### Issue: "Role is 'guest' when I signed up as 'host'"

**Solution:** The trigger creates a default 'guest' profile, then the app updates it. Make sure the update query is running:
```javascript
// This should be in your signUp function
const { error: updateError } = await supabase
  .from('user_profiles')
  .update({
    role: userData.role, // This updates from 'guest' to actual role
    full_name: userData.full_name,
    phone_number: userData.phone_number,
  })
  .eq('id', authData.user.id);
```

### Issue: "Signup works but profile has no role-specific data"

**Check:** Are guest_profiles or host_profiles being created?

**Debug Query:**
```sql
-- Check if guest profile exists
SELECT gp.*, up.full_name, up.email
FROM guest_profiles gp
JOIN user_profiles up ON up.id = gp.user_id
WHERE up.email = 'your-test-email@example.com';

-- Check if host profile exists
SELECT hp.*, up.full_name, up.email
FROM host_profiles hp
JOIN user_profiles up ON up.id = hp.user_id
WHERE up.email = 'your-test-email@example.com';
```

---

## 🔍 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  User fills signup form and clicks "Sign Up"                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  React: supabase.auth.signUp({ email, password })           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase: Creates user in auth.users table                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  🔥 TRIGGER FIRES: handle_new_user()                         │
│  Automatically creates basic entry in user_profiles          │
│  - id (from auth.users)                                      │
│  - email (from auth.users)                                   │
│  - role = 'guest' (default)                                  │
│  - full_name (from metadata or 'New User')                   │
│  - is_verified = false                                       │
│  - is_active = true                                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  React: Updates user_profiles with correct role             │
│  - Updates role (guest → actual role)                        │
│  - Updates full_name                                         │
│  - Updates phone_number                                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  React: Creates role-specific profile                       │
│  - Inserts into guest_profiles OR host_profiles              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  ✅ Signup Complete!                                          │
│  User has:                                                   │
│  - auth.users entry                                          │
│  - user_profiles entry                                       │
│  - guest_profiles or host_profiles entry                     │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Verification Commands

Run these in Supabase SQL Editor to verify everything is working:

```sql
-- 1. Verify trigger exists
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verify function exists
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 3. Check user profiles match auth users
SELECT
    au.email as auth_email,
    up.email as profile_email,
    up.role,
    up.full_name,
    up.is_verified
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 4. Check for users with missing profiles (should be empty)
SELECT au.email, au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
WHERE up.id IS NULL;
```

---

## 📚 Additional Notes

### Email Confirmation
By default, Supabase requires email confirmation. During development:
1. Go to **Authentication → Settings**
2. Disable "Enable email confirmations" for testing
3. Re-enable before going to production

### Existing Users
If you already have users in `auth.users` without profiles:

```sql
-- Create profiles for existing auth users
INSERT INTO user_profiles (id, email, role, full_name, is_verified, is_active)
SELECT
    id,
    email,
    'guest' as role,
    COALESCE(raw_user_meta_data->>'full_name', 'User') as full_name,
    false as is_verified,
    true as is_active
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles);
```

---

## 🎉 Success!

If all tests pass, your automatic profile creation is working! New users will now:
1. ✅ Automatically get a user_profiles entry
2. ✅ Have their role set correctly
3. ✅ Have their role-specific profile created
4. ✅ Be able to login and access their dashboard

---

**Need help?** Check the main `HOST_FAMILY_STAY_SETUP.md` for more troubleshooting tips.
