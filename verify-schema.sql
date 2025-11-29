-- ============================================================================
-- VERIFY DATABASE SCHEMA - Run this in Supabase SQL Editor
-- ============================================================================
-- This script checks if your tables have the correct columns
-- ============================================================================

-- 1. Check guest_profiles columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'guest_profiles'
ORDER BY ordinal_position;

-- Expected columns for guest_profiles:
-- ✅ id, user_id, date_of_birth, university, course, year_of_study
-- ✅ student_id, preferred_location, preferred_postcode, bio, skills
-- ✅ availability_start, availability_end, profile_picture_url
-- ✅ average_rating, total_ratings, emergency_contact_name, emergency_contact_phone
-- ✅ created_at, updated_at
-- ❌ Should NOT have: available_hours, services_offered, course_of_study, phone

-- 2. Check host_profiles columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'host_profiles'
ORDER BY ordinal_position;

-- Expected columns for host_profiles:
-- ✅ id, user_id, date_of_birth, address, postcode, city
-- ✅ property_description, number_of_rooms, amenities, accessibility_features
-- ✅ preferred_gender, preferred_age_range, support_needs, additional_info
-- ✅ profile_picture_url, average_rating, total_ratings, created_at, updated_at
-- ❌ Should NOT have: services_needed, bio, phone

-- 3. Check user_profiles columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Expected columns for user_profiles:
-- ✅ id, email, role, full_name, phone_number
-- ✅ is_verified, is_active, created_at, updated_at, created_by

-- ============================================================================
-- 4. Test Student Signup Query (Dry Run)
-- ============================================================================
-- This shows what columns the signup will try to insert
-- Replace 'test-uuid' with an actual user ID to test

-- What StudentSignup.jsx will insert:
EXPLAIN (FORMAT JSON)
INSERT INTO guest_profiles (
    user_id,
    university,
    course,
    year_of_study,
    skills,
    bio,
    date_of_birth
) VALUES (
    'test-uuid-here'::uuid,  -- Replace with real UUID
    'Test University',
    'Computer Science',
    2,
    ARRAY['Companionship', 'Tech Help'],
    'Test bio',
    '2000-01-01'
);
-- Don't actually run this, it's just to verify column names

-- ============================================================================
-- 5. Test Host Signup Query (Dry Run)
-- ============================================================================
-- What HostSignup.jsx will insert:
EXPLAIN (FORMAT JSON)
INSERT INTO host_profiles (
    user_id,
    address,
    city,
    postcode,
    additional_info
) VALUES (
    'test-uuid-here'::uuid,  -- Replace with real UUID
    '123 Test Street',
    'London',
    'SW1A 1AA',
    'Test additional info'
);
-- Don't actually run this, it's just to verify column names

-- ============================================================================
-- 6. Check for Incorrect Columns (Should Return Empty)
-- ============================================================================
-- These queries should return 0 rows if schema is correct

SELECT 'ERROR: guest_profiles has available_hours column!' as issue
FROM information_schema.columns
WHERE table_name = 'guest_profiles'
AND column_name = 'available_hours';

SELECT 'ERROR: guest_profiles has services_offered column!' as issue
FROM information_schema.columns
WHERE table_name = 'guest_profiles'
AND column_name = 'services_offered';

SELECT 'ERROR: guest_profiles has course_of_study column!' as issue
FROM information_schema.columns
WHERE table_name = 'guest_profiles'
AND column_name = 'course_of_study';

SELECT 'ERROR: host_profiles has services_needed column!' as issue
FROM information_schema.columns
WHERE table_name = 'host_profiles'
AND column_name = 'services_needed';

SELECT 'ERROR: host_profiles has bio column!' as issue
FROM information_schema.columns
WHERE table_name = 'host_profiles'
AND column_name = 'bio';

-- ============================================================================
-- EXPECTED RESULT:
-- All "ERROR" queries above should return 0 rows
-- If any return 1 row, your schema doesn't match database-setup.sql
-- ============================================================================
