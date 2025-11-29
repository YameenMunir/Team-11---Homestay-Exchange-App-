# Trigger Fix - Why Users Aren't Being Added

## The Problem You Found

You're right that there's an issue, but **not with the DROP TRIGGER line** itself. That line is correct - it removes the old trigger before creating a new one (this is standard SQL practice).

## The REAL Problem

The original trigger has **NO ERROR HANDLING**. If anything goes wrong (RLS policy block, duplicate key, etc.), the trigger fails silently and users don't get added to `user_profiles`.

---

## Original Trigger (auto-create-profile-trigger.sql)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (...)
    VALUES (...);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Issues:**
- ❌ No error handling - fails silently
- ❌ No conflict handling - fails if profile exists
- ❌ No permissions granted - might fail due to RLS
- ❌ No logging - can't debug issues

---

## Improved Trigger (auto-create-profile-trigger-IMPROVED.sql)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (...)
    VALUES (...)
    ON CONFLICT (id) DO NOTHING; -- Handle duplicates

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail signup
        RAISE WARNING 'Error in handle_new_user for user %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$;
```

**Improvements:**
- ✅ Error handling with EXCEPTION block
- ✅ Conflict handling with ON CONFLICT
- ✅ Permissions granted to all roles
- ✅ Warning logs (visible in Postgres logs)
- ✅ Won't break auth signup even if profile creation fails

---

## How to Fix

### Option 1: Use the Improved Trigger (RECOMMENDED)

Run this in **Supabase SQL Editor**:

```bash
# Copy and paste the entire contents of:
auto-create-profile-trigger-IMPROVED.sql
```

This will:
1. Drop the old trigger
2. Create new function with error handling
3. Grant necessary permissions
4. Create the trigger
5. Verify it was created

### Option 2: Check Why Original Trigger is Failing

If you want to debug the original trigger first:

1. **Check Supabase Postgres Logs**:
   - Go to Supabase Dashboard → Logs → Postgres Logs
   - Look for errors containing "handle_new_user"

2. **Check RLS Policies**:
   ```sql
   -- See if RLS is blocking inserts
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'user_profiles';
   ```

3. **Manually test the trigger**:
   ```sql
   -- Try inserting a test user
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
       'test@example.com',
       crypt('test123', gen_salt('bf')),
       now(),
       '{"full_name": "Test User", "role": "guest"}'::jsonb,
       'authenticated',
       'authenticated',
       now(),
       now()
   );

   -- Check if profile was created
   SELECT * FROM user_profiles WHERE email = 'test@example.com';

   -- Clean up
   DELETE FROM auth.users WHERE email = 'test@example.com';
   ```

---

## Understanding DROP TRIGGER

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

**What this does:**
- Removes the trigger named `on_auth_user_created` if it exists
- This is GOOD - it ensures we start fresh
- The CREATE TRIGGER command comes right after (line 39-42)

**This is NOT the problem!** It's a standard SQL pattern:

```sql
-- Step 1: Remove old version
DROP TRIGGER IF EXISTS my_trigger;

-- Step 2: Create new version
CREATE TRIGGER my_trigger ...
```

Without the DROP, you'd get an error: "trigger already exists"

---

## Quick Diagnosis

Run this in Supabase SQL Editor to see current state:

```sql
-- 1. Check if trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if function exists
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- 3. Check recent signups
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if profiles were created
SELECT id, email, role, created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;
```

**Results:**
- If #1 returns 0 rows → **Trigger doesn't exist!** Run the improved SQL
- If #2 returns 0 rows → **Function doesn't exist!** Run the improved SQL
- If #3 shows users but #4 is empty → **Trigger exists but is failing!** Use improved version
- If #3 and #4 match → Everything is working!

---

## After Running Improved Trigger

### Test it works:

1. **Try signing up a new user**
2. **Check if profile was created**:
   ```sql
   SELECT
       au.email,
       au.created_at as auth_created,
       up.id as profile_id,
       up.role,
       up.full_name
   FROM auth.users au
   LEFT JOIN user_profiles up ON up.id = au.id
   ORDER BY au.created_at DESC
   LIMIT 5;
   ```

3. **Expected result**:
   - Every row in auth.users should have a matching profile_id
   - If profile_id is NULL, trigger still isn't working

### Check logs for warnings:

```sql
-- In Supabase Dashboard, go to:
-- Logs → Postgres Logs → Filter for "WARNING"
-- Look for messages from handle_new_user
```

If you see warnings, they'll tell you exactly what's failing!

---

## Summary

1. ✅ **The DROP TRIGGER line is CORRECT** - it's not the problem
2. ❌ **The MISSING error handling is the problem** - trigger fails silently
3. ✅ **Solution: Use improved trigger** - auto-create-profile-trigger-IMPROVED.sql
4. ✅ **Benefit: Better logging** - you'll see errors in Postgres logs
5. ✅ **Benefit: Won't break signup** - even if profile creation fails, auth user is still created

Run the improved trigger and try signing up again!
