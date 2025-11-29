-- ============================================================================
-- STORAGE BUCKETS SETUP FOR HOST FAMILY STAY APP
-- ============================================================================
-- This script sets up all required storage buckets and their policies
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================================

-- Insert buckets (using INSERT instead of CREATE BUCKET for consistency)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'user-documents',
    'user-documents',
    false, -- Private bucket
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  ),
  (
    'profile-pictures',
    'profile-pictures',
    true, -- Public bucket (for profile pics)
    2097152, -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 2. STORAGE POLICIES FOR user-documents BUCKET (Private)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins have full storage access" ON storage.objects;

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own documents + admins can view all
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-documents' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  )
);

-- Users can update/delete their own pending documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins have full access to all documents
CREATE POLICY "Admins have full storage access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'user-documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
)
WITH CHECK (
  bucket_id = 'user-documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- ============================================================================
-- 3. STORAGE POLICIES FOR profile-pictures BUCKET (Public)
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;

-- Users can upload their own profile picture
CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Anyone authenticated can view profile pictures (bucket is public)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-pictures');

-- Users can update their own profile picture
CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own profile picture
CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 4. VERIFY SETUP
-- ============================================================================

-- Check buckets were created
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('user-documents', 'profile-pictures');

-- Check policies were created
SELECT
  policyname,
  tablename
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY policyname;

-- ============================================================================
-- SUCCESS! Storage buckets and policies are configured
-- ============================================================================
