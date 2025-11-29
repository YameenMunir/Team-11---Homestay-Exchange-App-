-- ============================================================================
-- IMPROVED AUTO-CREATE USER PROFILE TRIGGER (WITH ERROR HANDLING)
-- ============================================================================
-- This trigger automatically creates a user_profiles entry when a new user
-- signs up through Supabase Auth
-- INCLUDES: Error handling, logging, and better robustness
-- ============================================================================

-- Drop existing function and trigger
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
    -- Try to insert into user_profiles
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
    )
    ON CONFLICT (id) DO NOTHING; -- If profile already exists, skip

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but DON'T fail the auth user creation
        RAISE WARNING 'Error in handle_new_user for user %: %', NEW.email, SQLERRM;
        RETURN NEW; -- Still return NEW so auth user is created
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

-- Check if function exists
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- Check if trigger exists
SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================================================
-- TESTING
-- ============================================================================

/*
-- Test 1: Create a test user
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
    'test-trigger@example.com',
    crypt('testpassword123', gen_salt('bf')),
    now(),
    '{"full_name": "Trigger Test User", "role": "guest"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
);

-- Test 2: Verify user_profiles was created
SELECT * FROM user_profiles WHERE email = 'test-trigger@example.com';

-- Test 3: Clean up
DELETE FROM auth.users WHERE email = 'test-trigger@example.com';
*/

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- The trigger is now set up with:
-- ✓ Error handling (won't break auth signup if it fails)
-- ✓ Conflict handling (ON CONFLICT DO NOTHING)
-- ✓ Warning logs (check Postgres logs for issues)
-- ✓ Proper permissions granted
-- ✓ SECURITY DEFINER (runs with creator's privileges)
-- ============================================================================
