# Debug Signup Issue - Step by Step

## Issue: Users not getting added to database

### Step 1: Check Browser Console for Errors

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try to sign up
4. Look for any red error messages

**Common errors to look for:**
- "Profile update error"
- "Guest profile error" or "Host profile error"
- Network errors
- Policy violation errors

### Step 2: Verify Database Trigger Exists

Run this in **Supabase SQL Editor**:

```sql
-- Check if trigger exists
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```

**Expected Result:** Should return 1 row for trigger and 1 row for function.

**If empty:** Run `auto-create-profile-trigger.sql` again.

### Step 3: Check if User Was Created in auth.users

```sql
-- Check auth.users table
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**If user exists here but not in user_profiles:** The trigger isn't firing.

**If user doesn't exist at all:** Signup is failing at the Supabase Auth level.

### Step 4: Check user_profiles Table

```sql
-- Check user_profiles
SELECT
    id,
    email,
    role,
    full_name,
    phone_number,
    is_verified,
    is_active,
    created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;
```

### Step 5: Check Role-Specific Profiles

```sql
-- Check guest_profiles
SELECT
    gp.*,
    up.email,
    up.full_name
FROM guest_profiles gp
LEFT JOIN user_profiles up ON up.id = gp.user_id
ORDER BY gp.created_at DESC
LIMIT 5;

-- Check host_profiles
SELECT
    hp.*,
    up.email,
    up.full_name
FROM host_profiles hp
LEFT JOIN user_profiles up ON up.id = hp.user_id
ORDER BY hp.created_at DESC
LIMIT 5;
```

### Step 6: Check RLS Policies

The trigger might be failing due to RLS policies. Let's check:

```sql
-- Disable RLS temporarily for testing (DEVELOPMENT ONLY!)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE guest_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles DISABLE ROW LEVEL SECURITY;

-- Try signing up again, then re-enable:
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
```

### Step 7: Manual Test Insert

Test if the trigger works manually:

```sql
-- This should trigger the handle_new_user function
-- Replace with a test email
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
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
    now(),
    now()
);

-- Check if user_profiles was auto-created
SELECT * FROM user_profiles WHERE email = 'trigger-test@example.com';
```

### Step 8: Check Email Confirmation Settings

If email confirmation is enabled and users aren't confirming their emails, they might not be able to create profiles.

**Temporary solution for testing:**

1. Go to Supabase Dashboard
2. Authentication → Settings
3. **Disable** "Enable email confirmations" temporarily
4. Try signup again
5. Re-enable after testing

### Step 9: Check Supabase Logs

1. Go to Supabase Dashboard
2. Click **Logs** in left sidebar
3. Click **Postgres Logs**
4. Look for errors related to:
   - `handle_new_user`
   - `user_profiles`
   - INSERT/UPDATE operations

### Step 10: Test with Simplified Trigger

If the trigger still doesn't work, try this simplified version:

```sql
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create simplified function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Simple insert with minimal data
    INSERT INTO public.user_profiles (
        id,
        email,
        role,
        full_name,
        is_verified,
        is_active
    )
    VALUES (
        NEW.id,
        NEW.email,
        'guest',
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        false,
        true
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

---

## Quick Fix Checklist

Try these in order:

1. ✅ **Disable email confirmation** (Supabase Dashboard → Auth → Settings)
2. ✅ **Run simplified trigger** (Step 10 above)
3. ✅ **Disable RLS temporarily** (Step 6 above)
4. ✅ **Check browser console** for JavaScript errors
5. ✅ **Test signup again**
6. ✅ **Check database tables** (Steps 3-5)

---

## Most Common Issues & Fixes

### Issue: "Policy violation" error
**Fix:**
```sql
-- Grant necessary permissions to trigger function
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON guest_profiles TO authenticated;
GRANT ALL ON host_profiles TO authenticated;
```

### Issue: Trigger not firing
**Fix:** Make sure function has `SECURITY DEFINER`:
```sql
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;
```

### Issue: Email confirmation blocking signup
**Fix:** Disable temporarily in Auth Settings

### Issue: React app errors
**Check:**
- Is `needsEmailConfirmation` being handled correctly?
- Are there try-catch blocks in AuthContextNew.jsx?
- Check network tab for failed API calls

---

## What Should Happen (Working Flow)

1. User fills signup form → Submit
2. `supabase.auth.signUp()` called
3. User created in `auth.users` ✅
4. Trigger fires → creates `user_profiles` entry ✅
5. React updates `user_profiles` with role ✅
6. React creates `guest_profiles` or `host_profiles` ✅
7. Success message shown ✅

**If any step fails, the database won't be updated properly.**

---

## Emergency Workaround

If trigger still doesn't work, modify `AuthContextNew.jsx` to manually create profile:

```javascript
// In signUp function, replace step 2-3 with:
// 2. Manually create profile (instead of relying on trigger)
const { error: insertError } = await supabase
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

if (insertError) {
  console.error('Profile creation error:', insertError);
  throw insertError;
}
```

---

## Contact Points for Help

1. **Supabase Discord**: For trigger/database issues
2. **Browser Console**: For React/JavaScript errors
3. **Supabase Logs**: For database errors
4. **Network Tab**: For API call failures

Run through these steps and let me know which step fails!
