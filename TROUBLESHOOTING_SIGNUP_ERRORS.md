# Troubleshooting Signup Schema Errors

## Error: "Could not find the 'available_hours' column"

This error means your code is trying to insert into a column that doesn't exist in the database.

---

## ✅ The Fix is Already Applied

The code in [StudentSignup.jsx](src/pages/StudentSignup.jsx) and [HostSignup.jsx](src/pages/HostSignup.jsx) has been corrected to use the proper column names from your database schema.

**However**, if you're still seeing the error, it's due to **caching**.

---

## Step-by-Step Resolution

### Step 1: Hard Reload Browser

The browser might be caching the old JavaScript code.

**Chrome/Edge/Firefox:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Or manually:**
1. Open DevTools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

### Step 2: Restart Development Server

```bash
# Stop the server (Ctrl + C in terminal)

# Clear node modules cache (optional but recommended)
rm -rf .next  # if using Next.js
# or
rm -rf dist   # if using Vite

# Restart
npm run dev
```

---

### Step 3: Verify Database Schema

Run [verify-schema.sql](verify-schema.sql) in **Supabase SQL Editor** to check your table structure.

**What to look for:**

✅ **guest_profiles should have:**
- `user_id` (UUID)
- `course` (TEXT) ← NOT `course_of_study`
- `skills` (TEXT[]) ← NOT `services_offered` or `available_hours`
- `bio` (TEXT)

❌ **guest_profiles should NOT have:**
- `available_hours`
- `services_offered`
- `course_of_study`
- `phone`

✅ **host_profiles should have:**
- `user_id` (UUID)
- `additional_info` (TEXT) ← NOT `bio`
- `address`, `city`, `postcode`

❌ **host_profiles should NOT have:**
- `services_needed`
- `bio`
- `phone`

✅ **user_profiles should have:**
- `phone_number` (TEXT) ← Phone is stored here!

---

### Step 4: Check Your Database Setup

**Did you run [database-setup.sql](database-setup.sql)?**

If not, your tables might have the wrong schema. Run it now in Supabase SQL Editor:

```bash
# In Supabase Dashboard:
1. Go to SQL Editor
2. Copy entire contents of database-setup.sql
3. Click "Run"
```

**Important:** This will drop and recreate all tables, so only do this if you have no production data!

---

## What the Fixed Code Does

### StudentSignup.jsx (Lines 142-152)

```javascript
const { error: profileError } = await supabase
  .from('guest_profiles')
  .insert({
    user_id: userId,              // ✅ Correct: foreign key reference
    university: universityName,   // ✅ Correct
    course: formData.courseOfStudy,  // ✅ Correct: 'course' column
    year_of_study: parseInt(formData.yearOfStudy), // ✅ Correct
    skills: formData.servicesOffered,  // ✅ Correct: 'skills' array
    bio: formData.aboutYou,       // ✅ Correct
    date_of_birth: formData.dateOfBirth, // ✅ Correct
  });
```

**Removed:**
- ❌ `available_hours` (doesn't exist)
- ❌ `phone` (moved to user_profiles)

### HostSignup.jsx (Lines 138-146)

```javascript
const { error: profileError } = await supabase
  .from('host_profiles')
  .insert({
    user_id: userId,              // ✅ Correct: foreign key reference
    address: formData.address,    // ✅ Correct
    city: formData.city || 'Not specified', // ✅ Correct
    postcode: formData.postcode,  // ✅ Correct
    additional_info: formData.aboutYou, // ✅ Correct: 'additional_info' column
  });
```

**Removed:**
- ❌ `services_needed` (doesn't exist)
- ❌ `bio` (should be `additional_info`)
- ❌ `phone` (moved to user_profiles)

---

## Still Getting Errors?

### Error: "new row violates foreign key constraint"

**Cause:** The `user_id` doesn't exist in `user_profiles`.

**Solution:** Ensure the database trigger is creating `user_profiles` entries:
```bash
# Run in Supabase SQL Editor
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If empty, run [auto-create-profile-trigger-IMPROVED.sql](auto-create-profile-trigger-IMPROVED.sql).

---

### Error: "duplicate key value violates unique constraint"

**Cause:** Trying to create a profile that already exists.

**Solution:** Check if the user already has a profile:
```sql
SELECT * FROM guest_profiles WHERE user_id = 'your-user-id';
SELECT * FROM host_profiles WHERE user_id = 'your-user-id';
```

If it exists, delete it and try again:
```sql
DELETE FROM guest_profiles WHERE user_id = 'your-user-id';
-- or
DELETE FROM host_profiles WHERE user_id = 'your-user-id';
```

---

### Error: "null value in column violates not-null constraint"

**Cause:** Required field is missing.

**Check these required fields:**

**guest_profiles:**
- `user_id` ✅
- `university` ✅
- `course` ✅
- `date_of_birth` ✅

**host_profiles:**
- `user_id` ✅
- `address` ✅
- `city` ✅
- `postcode` ✅

**Solution:** Ensure form data is being passed correctly:
```javascript
console.log('Form data:', formData);
console.log('User ID:', userId);
```

---

## Test Signup Flow

### Test Student Signup:

1. Navigate to `/student/signup`
2. Fill all fields in Step 1
3. Click "Continue"
4. Fill Step 2
5. Click "Continue"
6. Upload documents in Step 3
7. Click "Complete Registration"

**Open Browser DevTools Console:**
- Look for any errors
- Check Network tab for failed requests
- Check the Supabase request payload

**Expected:**
- ✅ Green success message
- ✅ Email sent
- ✅ Redirect to login after 3 seconds
- ✅ No console errors

---

### Test Host Signup:

Same process but navigate to `/host/signup`.

---

## Verify Data in Database

After successful signup, run:

```sql
-- Check student signup
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
LEFT JOIN guest_profiles gp ON gp.user_id = au.id
WHERE au.email = 'your-test-email@example.com';

-- Check host signup
SELECT
  au.email,
  up.role,
  up.phone_number,
  hp.address,
  hp.city,
  hp.additional_info
FROM auth.users au
JOIN user_profiles up ON up.id = au.id
LEFT JOIN host_profiles hp ON hp.user_id = au.id
WHERE au.email = 'your-test-email@example.com';
```

---

## Quick Checklist

- [ ] Hard reload browser (`Ctrl + Shift + R`)
- [ ] Restart dev server
- [ ] Verify [database-setup.sql](database-setup.sql) was run
- [ ] Verify [auto-create-profile-trigger-IMPROVED.sql](auto-create-profile-trigger-IMPROVED.sql) was run
- [ ] Run [verify-schema.sql](verify-schema.sql) to check columns
- [ ] Check browser console for errors
- [ ] Check Supabase Dashboard → Logs for errors
- [ ] Test signup with a new email address

---

## Summary

The code is **already fixed**. The error you're seeing is most likely:

1. **Browser cache** → Hard reload
2. **Dev server cache** → Restart server
3. **Wrong database schema** → Run database-setup.sql

After doing all three, the signup should work perfectly! 🎉

---

## Need More Help?

If you're still stuck:

1. **Check browser console** → Copy error message
2. **Check Supabase logs** → Database → Logs → Postgres Logs
3. **Check Network tab** → See exact request/response
4. **Share the exact error** → Copy full error message

The fix is in place - it's just a matter of clearing caches and ensuring your database schema matches the code!
