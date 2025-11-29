# Database Schema Column Name Fix

## Error Encountered

```
Could not find the 'available_hours' column of 'guest_profiles' in the schema cache
```

## Root Cause

The signup code was using incorrect column names that didn't match the actual database schema defined in [database-setup.sql](database-setup.sql).

---

## Actual Database Schema

### guest_profiles Table

```sql
CREATE TABLE guest_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id),
    date_of_birth DATE NOT NULL,
    university TEXT NOT NULL,
    course TEXT NOT NULL,                    -- ✅ NOT 'course_of_study'
    year_of_study INTEGER,
    student_id TEXT,
    preferred_location TEXT,
    preferred_postcode TEXT,
    bio TEXT,
    skills TEXT[],                           -- ✅ NOT 'services_offered'
    availability_start DATE,
    availability_end DATE,
    profile_picture_url TEXT,
    average_rating NUMERIC(2,1),
    total_ratings INTEGER,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

**Note**: `phone` is stored in `user_profiles.phone_number`, not in `guest_profiles`!

### host_profiles Table

```sql
CREATE TABLE host_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id),
    date_of_birth DATE,
    address TEXT NOT NULL,
    postcode TEXT NOT NULL,
    city TEXT NOT NULL,
    property_description TEXT,
    number_of_rooms INTEGER,
    amenities TEXT[],
    accessibility_features TEXT[],
    preferred_gender TEXT,
    preferred_age_range TEXT,
    support_needs TEXT,
    additional_info TEXT,                    -- ✅ NOT 'bio'
    profile_picture_url TEXT,
    average_rating NUMERIC(2,1),
    total_ratings INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

**Note**: `phone` is stored in `user_profiles.phone_number`, not in `host_profiles`!

### user_profiles Table (for phone storage)

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    full_name TEXT NOT NULL,
    phone_number TEXT,                       -- ✅ Phone stored here!
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_by UUID
);
```

---

## What Was Fixed

### StudentSignup.jsx Changes

**Before (Incorrect):**
```javascript
const { error: profileError } = await supabase
  .from('guest_profiles')
  .insert({
    id: userId,                              // ❌ Wrong: should be 'user_id'
    university: universityName,
    course_of_study: formData.courseOfStudy, // ❌ Wrong: should be 'course'
    year_of_study: formData.yearOfStudy,
    services_offered: formData.servicesOffered, // ❌ Wrong: should be 'skills'
    available_hours: formData.availableHours,   // ❌ Wrong: doesn't exist!
    bio: formData.aboutYou,
    date_of_birth: formData.dateOfBirth,
    phone: formData.phone,                      // ❌ Wrong: doesn't exist here!
  });
```

**After (Correct):**
```javascript
// Update user_profiles with phone number
const { error: updateError } = await supabase
  .from('user_profiles')
  .update({
    phone_number: formData.phone,           // ✅ Phone goes in user_profiles
  })
  .eq('id', userId);

// Create guest_profiles entry
const { error: profileError } = await supabase
  .from('guest_profiles')
  .insert({
    user_id: userId,                        // ✅ Correct: user_id reference
    university: universityName,
    course: formData.courseOfStudy,         // ✅ Correct: 'course'
    year_of_study: parseInt(formData.yearOfStudy),
    skills: formData.servicesOffered,       // ✅ Correct: 'skills' array
    bio: formData.aboutYou,
    date_of_birth: formData.dateOfBirth,
  });
```

### HostSignup.jsx Changes

**Before (Incorrect):**
```javascript
const { error: profileError } = await supabase
  .from('host_profiles')
  .insert({
    id: userId,                             // ❌ Wrong: should be 'user_id'
    address: formData.address,
    city: formData.city || 'Not specified',
    postcode: formData.postcode,
    services_needed: formData.servicesNeeded, // ❌ Wrong: doesn't exist!
    bio: formData.aboutYou,                   // ❌ Wrong: should be 'additional_info'
    phone: formData.phone,                    // ❌ Wrong: doesn't exist here!
  });
```

**After (Correct):**
```javascript
// Update user_profiles with phone number
const { error: updateError } = await supabase
  .from('user_profiles')
  .update({
    phone_number: formData.phone,           // ✅ Phone goes in user_profiles
  })
  .eq('id', userId);

// Create host_profiles entry
const { error: profileError } = await supabase
  .from('host_profiles')
  .insert({
    user_id: userId,                        // ✅ Correct: user_id reference
    address: formData.address,
    city: formData.city || 'Not specified',
    postcode: formData.postcode,
    additional_info: formData.aboutYou,     // ✅ Correct: 'additional_info'
  });
```

---

## Key Differences Summary

### guest_profiles
| ❌ Incorrect Column | ✅ Correct Column | Type |
|---------------------|-------------------|------|
| `id` | `user_id` | UUID reference |
| `course_of_study` | `course` | TEXT |
| `services_offered` | `skills` | TEXT[] |
| `available_hours` | *(doesn't exist)* | - |
| `phone` | *(in user_profiles)* | - |

### host_profiles
| ❌ Incorrect Column | ✅ Correct Column | Type |
|---------------------|-------------------|------|
| `id` | `user_id` | UUID reference |
| `services_needed` | *(doesn't exist)* | - |
| `bio` | `additional_info` | TEXT |
| `phone` | *(in user_profiles)* | - |

---

## Database Relationships

```
auth.users (Supabase managed)
    ↓ (id)
user_profiles (auto-created by trigger)
    ├── phone_number ← Phone stored here
    ├── role (guest/host/admin)
    └── full_name
        ↓ (id → user_id)
    ┌───┴───┐
    ↓       ↓
guest_profiles   host_profiles
    ├── course       ├── address
    ├── skills       ├── postcode
    ├── bio          ├── additional_info
    └── university   └── city
```

---

## Updated Signup Flow

### Student Signup:

1. **Create auth user** → `auth.users`
2. **Trigger auto-creates** → `user_profiles` (with `role='guest'`)
3. **Upload documents** → `storage.objects` bucket
4. **Update phone** → `user_profiles.phone_number`
5. **Create profile** → `guest_profiles` (with `user_id` reference)

### Host Signup:

1. **Create auth user** → `auth.users`
2. **Trigger auto-creates** → `user_profiles` (with `role='host'`)
3. **Upload documents** → `storage.objects` bucket
4. **Update phone** → `user_profiles.phone_number`
5. **Create profile** → `host_profiles` (with `user_id` reference)

---

## Testing After Fix

### Verify Student Signup:

```sql
-- Check all related records
SELECT
  au.email,
  up.role,
  up.phone_number,
  gp.university,
  gp.course,
  gp.skills,
  gp.bio
FROM auth.users au
JOIN user_profiles up ON up.id = au.id
JOIN guest_profiles gp ON gp.user_id = au.id
WHERE au.email = 'teststudent@university.ac.uk';
```

### Verify Host Signup:

```sql
-- Check all related records
SELECT
  au.email,
  up.role,
  up.phone_number,
  hp.address,
  hp.city,
  hp.postcode,
  hp.additional_info
FROM auth.users au
JOIN user_profiles up ON up.id = au.id
JOIN host_profiles hp ON hp.user_id = au.id
WHERE au.email = 'testhost@example.com';
```

---

## Why This Happened

The original code was written based on **assumed column names** rather than the actual database schema. The schema in `database-setup.sql` was the source of truth, but the signup code didn't reference it correctly.

### Lesson Learned:

Always check the database schema file **before** writing insert/update queries!

---

## Summary

✅ **Fixed**: Both signup pages now use correct column names matching `database-setup.sql`
✅ **Fixed**: Phone numbers correctly stored in `user_profiles.phone_number`
✅ **Fixed**: Foreign key relationships use `user_id` instead of `id`
✅ **Fixed**: Removed references to non-existent columns (`available_hours`, `services_needed`)
✅ **Mapped**: Form data to correct schema columns

**The signup flow should now work without schema errors!** 🎉
