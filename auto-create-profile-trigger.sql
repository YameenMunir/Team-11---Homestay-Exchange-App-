-- ============================================================================
-- AUTO-CREATE USER PROFILE TRIGGER
-- ============================================================================
-- This trigger automatically creates a user_profiles entry when a new user
-- signs up through Supabase Auth
-- ============================================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
        'guest', -- Default role, will be updated during signup
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        false,
        true,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TESTING
-- ============================================================================

-- To test this trigger, create a new user via Supabase Auth or signup form
-- The user_profiles table should automatically get a new row

-- To manually verify:
-- SELECT * FROM auth.users;
-- SELECT * FROM user_profiles;

-- ============================================================================
-- NOTES
-- ============================================================================

-- This trigger will:
-- 1. Automatically create a user_profiles entry when someone signs up
-- 2. Set default role to 'guest' (you can change this in your signup logic)
-- 3. Extract full_name from user metadata if available
-- 4. Set is_verified to false (admin must verify later)
-- 5. Set is_active to true

-- Your signup logic in React should:
-- 1. Call supabase.auth.signUp() - this creates the auth.users entry
-- 2. The trigger automatically creates user_profiles entry
-- 3. Then update the user_profiles with role-specific data
-- 4. Then insert into guest_profiles or host_profiles

-- ============================================================================
