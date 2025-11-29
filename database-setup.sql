-- ============================================================================
-- HOST FAMILY STAY APP - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Run this entire script in your Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'host', 'guest');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE document_type AS ENUM ('government_id', 'dbs_check', 'proof_of_address', 'admission_proof');
CREATE TYPE request_status AS ENUM ('pending', 'in_review', 'matched', 'completed', 'cancelled');
CREATE TYPE problem_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE notification_type AS ENUM ('document_upload', 'verification_update', 'facilitation_request', 'problem_report', 'rating_received', 'match_update');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User Profiles Table (linked to Supabase Auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone_number IS NULL OR phone_number ~* '^\+?[0-9]{10,15}$')
);

-- Host Profiles
CREATE TABLE host_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    address TEXT NOT NULL,
    postcode TEXT NOT NULL,
    city TEXT NOT NULL,
    property_description TEXT,
    number_of_rooms INTEGER CHECK (number_of_rooms > 0),
    amenities TEXT[],
    accessibility_features TEXT[],
    preferred_gender TEXT,
    preferred_age_range TEXT,
    support_needs TEXT,
    additional_info TEXT,
    profile_picture_url TEXT,
    average_rating NUMERIC(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest (Student) Profiles
CREATE TABLE guest_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL,
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    year_of_study INTEGER CHECK (year_of_study > 0),
    student_id TEXT,
    preferred_location TEXT,
    preferred_postcode TEXT,
    bio TEXT,
    skills TEXT[],
    availability_start DATE,
    availability_end DATE,
    profile_picture_url TEXT,
    average_rating NUMERIC(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_ratings INTEGER DEFAULT 0,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18)
);

-- User Documents
CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    verification_status verification_status DEFAULT 'pending',
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES user_profiles(id),
    rejection_reason TEXT,

    UNIQUE(user_id, document_type)
);

-- Document Verification Logs
CREATE TABLE document_verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES user_profiles(id),
    action verification_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facilitation Requests
CREATE TABLE facilitation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    requester_role user_role NOT NULL,
    status request_status DEFAULT 'pending',
    message TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES user_profiles(id),
    matched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    CONSTRAINT no_self_request CHECK (requester_id != target_id)
);

-- Problem Reports
CREATE TABLE problem_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    severity problem_severity DEFAULT 'medium',
    status request_status DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES user_profiles(id)
);

-- Ratings (Two-Way)
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facilitation_id UUID NOT NULL REFERENCES facilitation_requests(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    rated_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(facilitation_id, rater_id),
    CONSTRAINT no_self_rating CHECK (rater_id != rated_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_documents_user_status ON user_documents(user_id, verification_status);
CREATE INDEX idx_facilitation_requests_status ON facilitation_requests(status);
CREATE INDEX idx_facilitation_requests_requester ON facilitation_requests(requester_id);
CREATE INDEX idx_problem_reports_status ON problem_reports(status);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_ratings_rated_id ON ratings(rated_id);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON host_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_profiles_updated_at BEFORE UPDATE ON guest_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update average rating for hosts
CREATE OR REPLACE FUNCTION update_host_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE host_profiles
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM ratings
            WHERE rated_id = NEW.rated_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM ratings
            WHERE rated_id = NEW.rated_id
        )
    WHERE user_id = NEW.rated_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update average rating for guests
CREATE OR REPLACE FUNCTION update_guest_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE guest_profiles
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM ratings
            WHERE rated_id = NEW.rated_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM ratings
            WHERE rated_id = NEW.rated_id
        )
    WHERE user_id = NEW.rated_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update ratings after insert
CREATE TRIGGER after_rating_insert
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_host_rating();

CREATE TRIGGER after_rating_insert_guest
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_guest_rating();

-- Function: Create notification on document verification
CREATE OR REPLACE FUNCTION notify_document_verification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, type, title, message, related_id)
    VALUES (
        NEW.user_id,
        'verification_update',
        'Document Verification Update',
        CASE
            WHEN NEW.verification_status = 'approved' THEN 'Your ' || NEW.document_type || ' has been approved.'
            WHEN NEW.verification_status = 'rejected' THEN 'Your ' || NEW.document_type || ' was rejected. Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified')
            ELSE 'Your document is being reviewed.'
        END,
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_document_verification
    AFTER UPDATE OF verification_status ON user_documents
    FOR EACH ROW
    WHEN (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
    EXECUTE FUNCTION notify_document_verification();

-- Function: Notify admins of new facilitation request
CREATE OR REPLACE FUNCTION notify_admin_facilitation()
RETURNS TRIGGER AS $$
DECLARE
    admin_user UUID;
BEGIN
    FOR admin_user IN
        SELECT id FROM user_profiles WHERE role = 'admin' AND is_active = TRUE
    LOOP
        INSERT INTO notifications (user_id, type, title, message, related_id)
        VALUES (
            admin_user,
            'facilitation_request',
            'New Facilitation Request',
            'A new facilitation request has been submitted.',
            NEW.id
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_facilitation_request
    AFTER INSERT ON facilitation_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_facilitation();

-- Function: Notify admins of problem reports
CREATE OR REPLACE FUNCTION notify_admin_problem_report()
RETURNS TRIGGER AS $$
DECLARE
    admin_user UUID;
BEGIN
    FOR admin_user IN
        SELECT id FROM user_profiles WHERE role = 'admin' AND is_active = TRUE
    LOOP
        INSERT INTO notifications (user_id, type, title, message, related_id)
        VALUES (
            admin_user,
            'problem_report',
            'New Problem Report (' || NEW.severity || ')',
            NEW.subject,
            NEW.id
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_problem_report
    AFTER INSERT ON problem_reports
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_problem_report();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- USER_PROFILES POLICIES
CREATE POLICY "Admins have full access to user_profiles"
    ON user_profiles FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create own profile"
    ON user_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id AND role IN ('host', 'guest'));

-- HOST_PROFILES POLICIES
CREATE POLICY "Anyone can view approved host profiles"
    ON host_profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = host_profiles.user_id AND is_verified = true
        )
    );

CREATE POLICY "Hosts can manage own profile"
    ON host_profiles FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins have full access to host_profiles"
    ON host_profiles FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- GUEST_PROFILES POLICIES
CREATE POLICY "Verified hosts and admins can view guest profiles"
    ON guest_profiles FOR SELECT
    TO authenticated
    USING (
        is_admin() OR
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up
            INNER JOIN host_profiles hp ON up.id = hp.user_id
            WHERE up.id = auth.uid() AND up.is_verified = true
        )
    );

CREATE POLICY "Guests can manage own profile"
    ON guest_profiles FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins have full access to guest_profiles"
    ON guest_profiles FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- USER_DOCUMENTS POLICIES
CREATE POLICY "Users can view own documents"
    ON user_documents FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can upload own documents"
    ON user_documents FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending documents"
    ON user_documents FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND verification_status = 'pending')
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can verify documents"
    ON user_documents FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete documents"
    ON user_documents FOR DELETE
    TO authenticated
    USING (is_admin());

-- DOCUMENT_VERIFICATION_LOGS POLICIES
CREATE POLICY "Admins can manage verification logs"
    ON document_verification_logs FOR ALL
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Users can view logs for their documents"
    ON document_verification_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_documents
            WHERE id = document_verification_logs.document_id
            AND user_id = auth.uid()
        )
    );

-- FACILITATION_REQUESTS POLICIES
CREATE POLICY "Users can view requests they're involved in"
    ON facilitation_requests FOR SELECT
    TO authenticated
    USING (
        requester_id = auth.uid() OR
        target_id = auth.uid() OR
        is_admin()
    );

CREATE POLICY "Verified users can create facilitation requests"
    ON facilitation_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        requester_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_verified = true
        )
    );

CREATE POLICY "Admins can update facilitation requests"
    ON facilitation_requests FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Requester can cancel own pending requests"
    ON facilitation_requests FOR UPDATE
    TO authenticated
    USING (requester_id = auth.uid() AND status = 'pending')
    WITH CHECK (requester_id = auth.uid() AND status = 'cancelled');

-- PROBLEM_REPORTS POLICIES
CREATE POLICY "Users can view own problem reports"
    ON problem_reports FOR SELECT
    TO authenticated
    USING (reporter_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create problem reports"
    ON problem_reports FOR INSERT
    TO authenticated
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can update problem reports"
    ON problem_reports FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- RATINGS POLICIES
CREATE POLICY "Users can view ratings for themselves"
    ON ratings FOR SELECT
    TO authenticated
    USING (
        rater_id = auth.uid() OR
        rated_id = auth.uid() OR
        is_admin()
    );

CREATE POLICY "Users can create ratings for completed facilitations"
    ON ratings FOR INSERT
    TO authenticated
    WITH CHECK (
        rater_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM facilitation_requests
            WHERE id = facilitation_id
            AND status = 'completed'
            AND (requester_id = auth.uid() OR target_id = auth.uid())
        )
    );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications (mark as read)"
    ON notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKET SETUP (Run in Storage SQL Editor)
-- ============================================================================

-- Note: Create 'user-documents' bucket manually in Supabase Storage UI
-- Then apply these storage policies:

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        ((storage.foldername(name))[1] = auth.uid()::text OR is_admin())
    );

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Admins have full storage access
CREATE POLICY "Admins have full storage access"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'user-documents' AND is_admin())
    WITH CHECK (bucket_id = 'user-documents' AND is_admin());

-- ============================================================================
-- COMPLETE! Database schema is ready
-- ============================================================================
