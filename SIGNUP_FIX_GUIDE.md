# Signup Issue Fix Guide

## Problem: Users not getting added to database

This guide will help you diagnose and fix why users aren't being added to the database during signup.

---

## Quick Diagnostic Steps

### Step 1: Open Browser Console (F12)

1. Open your app in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to sign up
5. **Look for errors** (red text)

**Common errors you might see:**
- `Profile update error:` - Role-specific profile creation failed
- `Policy violation` - RLS policy blocking insert
- `Trigger error` - Database trigger not firing
- `Email already exists` - User already registered

---

## Step 2: Check Database Tables

Run these queries in **Supabase SQL Editor**:

### A. Check if user exists in auth.users
```sql
SELECT
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**What to look for:**
- ✅ If user appears here: Auth signup worked
- ❌ If user doesn't appear: Signup is failing at Supabase Auth level

---

### B. Check if profile was created
```sql
SELECT
    id,
    email,
    role,
    full_name,
    is_verified,
    created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;
```

**What to look for:**
- ✅ If user appears here: Trigger worked
- ❌ If user in auth.users but NOT here: **Trigger is not firing**

---

### C. Check role-specific profiles
```sql
-- For students
SELECT
    gp.*,
    up.email,
    up.full_name
FROM guest_profiles gp
LEFT JOIN user_profiles up ON up.id = gp.user_id
ORDER BY gp.created_at DESC
LIMIT 5;

-- For hosts
SELECT
    hp.*,
    up.email,
    up.full_name
FROM host_profiles hp
LEFT JOIN user_profiles up ON up.id = hp.user_id
ORDER BY hp.created_at DESC
LIMIT 5;
```

**What to look for:**
- ✅ If entry appears: Complete signup worked
- ❌ If missing: React app failed to create role profile

---

## Step 3: Verify Database Trigger

### Check if trigger exists:
```sql
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected result:** 1 row showing the trigger

**If empty (0 rows):**
👉 **Run this SQL script:** `auto-create-profile-trigger.sql`

---

### Check if function exists:
```sql
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';
```

**Expected result:** 1 row showing the function

**If empty (0 rows):**
👉 **Run this SQL script:** `auto-create-profile-trigger.sql`

---

## Step 4: Test Trigger Manually

Run this to test if trigger works:

```sql
-- Delete test user if exists
DELETE FROM auth.users WHERE email = 'trigger-test@example.com';

-- Try to insert test user
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'trigger-test@example.com',
    crypt('testpassword123', gen_salt('bf')),
    now(),
    '{"full_name": "Test User", "role": "guest"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
);

-- Check if user_profiles was created
SELECT * FROM user_profiles WHERE email = 'trigger-test@example.com';
```

**Expected result:** Should see 1 row in user_profiles

**If no row appears:**
👉 Trigger is NOT working - proceed to Step 5

---

## Step 5: Fix the Trigger (If Not Working)

### Option A: Use the improved trigger

Run this in Supabase SQL Editor:

```sql
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into user_profiles
    INSERT INTO public.user_profiles (
        id,
        email,
        role,
        full_name,
        is_verified,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'guest')::user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        false,
        true,
        NOW(),
        NOW()
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the auth user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

### Test again with Step 4

---

## Step 6: Check Row Level Security (RLS)

RLS might be blocking the trigger. Try this temporarily:

```sql
-- Check current RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('user_profiles', 'guest_profiles', 'host_profiles');

-- TEMPORARILY disable RLS for testing (DEVELOPMENT ONLY!)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE guest_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles DISABLE ROW LEVEL SECURITY;

-- Try signup again

-- Re-enable RLS after testing
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
```

**If signup works with RLS disabled:**
👉 The RLS policies are too restrictive

**Fix:** Update RLS policies to allow inserts:

```sql
-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their guest profile
CREATE POLICY "Users can insert own guest profile"
ON guest_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert their host profile
CREATE POLICY "Users can insert own host profile"
ON host_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

---

## Step 7: Disable Email Confirmation (Temporary)

Email confirmation might be preventing profile creation.

1. Go to **Supabase Dashboard**
2. **Authentication** → **Settings**
3. **Disable** "Enable email confirmations"
4. Try signup again
5. **Re-enable** after testing

---

## Step 8: Check Supabase Logs

1. Go to Supabase Dashboard
2. Click **Logs** → **Postgres Logs**
3. Look for errors containing:
   - `handle_new_user`
   - `user_profiles`
   - `INSERT`
   - `trigger`

**Common errors:**
- `relation does not exist` - Table missing
- `permission denied` - RLS blocking
- `violates foreign key constraint` - Data integrity issue

---

## Step 9: Alternative - Manual Profile Creation

If trigger still doesn't work, modify `AuthContextNew.jsx` to manually create profiles:

### Update the signUp function:

```javascript
const signUp = async (email, password, userData) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;

    // 2. MANUALLY create user_profiles (don't rely on trigger)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: email,
        role: userData.role,
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        is_verified: false,
        is_active: true,
      }]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If profile already exists (trigger created it), just update
      await supabase
        .from('user_profiles')
        .update({
          role: userData.role,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
        })
        .eq('id', authData.user.id);
    }

    // 3. Create role-specific profile
    if (userData.role === 'host') {
      await supabase.from('host_profiles').insert([{
        user_id: authData.user.id,
        address: userData.address,
        postcode: userData.postcode,
        city: userData.city,
        date_of_birth: userData.date_of_birth,
      }]);
    } else if (userData.role === 'guest') {
      await supabase.from('guest_profiles').insert([{
        user_id: authData.user.id,
        date_of_birth: userData.date_of_birth,
        university: userData.university,
        course: userData.course,
        year_of_study: userData.year_of_study,
      }]);
    }

    return {
      data: authData,
      error: null,
      needsEmailConfirmation: !authData.session
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error };
  }
};
```

---

## Troubleshooting Checklist

Work through these in order:

- [ ] Opened browser console and checked for errors
- [ ] Verified user appears in `auth.users` table
- [ ] Checked if user appears in `user_profiles` table
- [ ] Verified trigger exists in database
- [ ] Tested trigger manually
- [ ] Checked RLS policies (temporarily disabled for testing)
- [ ] Disabled email confirmation temporarily
- [ ] Checked Supabase logs for errors
- [ ] Applied manual profile creation code if needed

---

## Quick Fixes Summary

### Issue: Trigger not firing
**Fix:** Run `auto-create-profile-trigger.sql` again

### Issue: RLS blocking inserts
**Fix:** Add INSERT policies shown in Step 6

### Issue: Email confirmation blocking
**Fix:** Disable in Auth Settings (temporarily)

### Issue: Trigger doesn't exist
**Fix:** Run improved trigger from Step 5

### Issue: Still not working
**Fix:** Use manual profile creation from Step 9

---

## After Fixing

Once signup works:

1. **Test with different roles:**
   - Sign up as student
   - Sign up as host
   - Verify both appear in database

2. **Check all tables:**
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 3;
   SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 3;
   SELECT * FROM guest_profiles ORDER BY created_at DESC LIMIT 3;
   SELECT * FROM host_profiles ORDER BY created_at DESC LIMIT 3;
   ```

3. **Re-enable security:**
   - Re-enable RLS if you disabled it
   - Re-enable email confirmation
   - Verify signup still works

---

## Get Help

If still not working, provide this information:

1. **Browser console errors** (screenshot)
2. **Results from Step 2 queries** (what's in each table?)
3. **Results from Step 3** (does trigger exist?)
4. **Supabase logs** (any errors?)

This will help diagnose the exact issue!
