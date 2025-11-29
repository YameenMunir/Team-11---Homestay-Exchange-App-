-- ============================================================================
-- SECURITY DEFINER FUNCTIONS TO CREATE PROFILES (BYPASSES RLS)
-- ============================================================================
-- These functions allow creating guest_profiles and host_profiles
-- even when the user is not yet authenticated (during signup before email confirmation)
-- ============================================================================

-- Function to create guest profile
CREATE OR REPLACE FUNCTION create_guest_profile(
    p_user_id UUID,
    p_university TEXT,
    p_course TEXT,
    p_year_of_study INTEGER,
    p_skills TEXT[],
    p_bio TEXT,
    p_date_of_birth DATE
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into guest_profiles (bypasses RLS because of SECURITY DEFINER)
    INSERT INTO guest_profiles (
        user_id,
        university,
        course,
        year_of_study,
        skills,
        bio,
        date_of_birth
    )
    VALUES (
        p_user_id,
        p_university,
        p_course,
        p_year_of_study,
        p_skills,
        p_bio,
        p_date_of_birth
    )
    ON CONFLICT (user_id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating guest profile for user %: %', p_user_id, SQLERRM;
END;
$$;

-- Function to create host profile
CREATE OR REPLACE FUNCTION create_host_profile(
    p_user_id UUID,
    p_address TEXT,
    p_city TEXT,
    p_postcode TEXT,
    p_additional_info TEXT
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert into host_profiles (bypasses RLS because of SECURITY DEFINER)
    INSERT INTO host_profiles (
        user_id,
        address,
        city,
        postcode,
        additional_info
    )
    VALUES (
        p_user_id,
        p_address,
        p_city,
        p_postcode,
        p_additional_info
    )
    ON CONFLICT (user_id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating host profile for user %: %', p_user_id, SQLERRM;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_guest_profile TO authenticated, anon;
GRANT EXECUTE ON FUNCTION create_host_profile TO authenticated, anon;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check functions were created
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_guest_profile', 'create_host_profile');

-- ============================================================================
-- HOW TO USE IN CODE
-- ============================================================================

/*
In StudentSignup.jsx, replace the direct insert with an RPC call:

const { error: profileError } = await supabase.rpc('create_guest_profile', {
  p_user_id: userId,
  p_university: universityName,
  p_course: formData.courseOfStudy,
  p_year_of_study: parseInt(formData.yearOfStudy),
  p_skills: formData.servicesOffered,
  p_bio: formData.aboutYou,
  p_date_of_birth: formData.dateOfBirth,
});


In HostSignup.jsx, replace the direct insert with an RPC call:

const { error: profileError } = await supabase.rpc('create_host_profile', {
  p_user_id: userId,
  p_address: formData.address,
  p_city: formData.city || 'Not specified',
  p_postcode: formData.postcode,
  p_additional_info: formData.aboutYou,
});
*/

-- ============================================================================
-- COMPLETE!
-- ============================================================================
