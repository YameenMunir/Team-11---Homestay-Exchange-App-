# Email Confirmation & Authentication Flow Setup Guide

This guide covers the complete signup and login flow with email confirmation for the Host Family Stay application.

## Overview

The authentication system now includes:
- ✅ Email confirmation after signup
- ✅ Automatic user profile creation via database trigger
- ✅ Role-based dashboard redirection
- ✅ Storage buckets for file uploads
- ✅ Secure user authentication flow

---

## 📋 Step-by-Step Setup

### Step 1: Configure Email Confirmation in Supabase

1. **Go to Supabase Dashboard**
   - Open your project at [supabase.com](https://supabase.com)

2. **Navigate to Authentication Settings**
   - Click **Authentication** in the left sidebar
   - Click **Settings**
   - Scroll to **Email Auth**

3. **Configure Email Settings**
   - ✅ **Enable email confirmations**: Turn this ON
   - Set **Confirmation URL**: `http://localhost:5173/auth/callback` (for development)
   - For production, change to: `https://yourdomain.com/auth/callback`

4. **Configure Email Templates (Optional)**
   - Click **Email Templates** tab
   - Customize the "Confirm signup" email template
   - Make sure it includes the `{{ .ConfirmationURL }}` variable

### Step 2: Run Database Setup Scripts

**Run these SQL scripts in Supabase SQL Editor in order:**

1. **Main Database Setup**
   ```bash
   # In Supabase SQL Editor, run the entire contents of:
   database-setup.sql
   ```

2. **Auto-Create Profile Trigger**
   ```bash
   # This ensures user_profiles are created automatically
   auto-create-profile-trigger.sql
   ```

3. **Storage Buckets Setup**
   ```bash
   # Creates buckets for user documents and profile pictures
   storage-buckets-setup.sql
   ```

### Step 3: Verify Storage Buckets

1. **Go to Storage in Supabase**
   - Click **Storage** in left sidebar
   - You should see two buckets:
     - `user-documents` (Private, 5MB limit)
     - `profile-pictures` (Public, 2MB limit)

2. **Check Bucket Policies**
   - Click on each bucket
   - Click **Policies** tab
   - Verify policies are created for INSERT, SELECT, UPDATE, DELETE

### Step 4: Configure Environment Variables

1. **Update your `.env` file**:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Get these values from Supabase**:
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public key**

### Step 5: Update Application Files

All necessary files have been created/updated:

✅ **AuthContextNew.jsx** - Handles email confirmation in signUp
✅ **SignupForm.jsx** - Shows confirmation message after signup
✅ **LoginForm.jsx** - Redirects based on user role
✅ **AuthCallback.jsx** - Handles email confirmation callback
✅ **AppNew.jsx** - Includes `/auth/callback` route

---

## 🔄 Authentication Flow

### Signup Flow with Email Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User fills signup form (Student or Host)                     │
│    - Full name, email, password, role-specific info             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. React calls: signUp(email, password, userData)               │
│    - Includes emailRedirectTo: '/auth/callback'                 │
│    - Stores full_name and role in user metadata                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Supabase creates user in auth.users                          │
│    - User status: PENDING (email not confirmed)                 │
│    - No session returned yet                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. 🔥 DATABASE TRIGGER FIRES: handle_new_user()                  │
│    - Automatically creates user_profiles entry                   │
│    - Sets default role to 'guest'                                │
│    - Extracts full_name from metadata                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. React updates user_profiles with correct data                │
│    - Updates role (guest/host/admin)                             │
│    - Updates full_name and phone_number                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. React creates role-specific profile                          │
│    - Inserts into guest_profiles OR host_profiles                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Supabase sends confirmation email                            │
│    - Email contains confirmation link                            │
│    - Link points to /auth/callback                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. UI shows success message                                     │
│    "Please check your email inbox and click the confirmation    │
│     link to activate your account."                              │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. User clicks link in email                                    │
│    - Redirected to /auth/callback with token in URL             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. AuthCallback component processes confirmation               │
│     - Extracts session from URL                                  │
│     - Fetches user profile from database                         │
│     - Redirects to dashboard based on role                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 11. ✅ User lands on their dashboard                              │
│     - Admin → /admin                                             │
│     - Host → /host                                               │
│     - Guest → /guest                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Login Flow with Role-Based Redirect

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User enters email and password on /login                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. React calls: signIn(email, password)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Supabase validates credentials                               │
│    - Returns session if email is confirmed                       │
│    - Returns error if email not confirmed or wrong credentials   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. React fetches user profile from user_profiles table          │
│    - Gets role field (admin/host/guest)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Redirect based on role                                       │
│    - role === 'admin' → navigate('/admin')                      │
│    - role === 'host'  → navigate('/host')                       │
│    - role === 'guest' → navigate('/guest')                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. ✅ User sees their role-specific dashboard                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the Complete Flow

### Test 1: Student Signup with Email Confirmation

1. **Start the app**: `npm run dev`
2. **Go to**: `http://localhost:5173/signup`
3. **Select**: "I'm a Student"
4. **Fill in the form**:
   - Full Name: Test Student
   - Email: teststudent@example.com
   - Password: password123
   - University: Trinity College Dublin
   - Course: Computer Science
   - Year: 2
5. **Click**: "Sign up"
6. **Expected**: Green success message appears:
   - "Account created successfully!"
   - "Please check your email inbox at teststudent@example.com..."
7. **Check email**: Look for confirmation email (check spam folder)
8. **Click**: Confirmation link in email
9. **Expected**: Redirected to `/auth/callback`
10. **Expected**: See "Email Verified!" message
11. **Expected**: Auto-redirect to `/guest` dashboard

### Test 2: Host Signup with Email Confirmation

1. **Go to**: `http://localhost:5173/signup`
2. **Select**: "I'm a Host"
3. **Fill in the form**:
   - Full Name: Test Host
   - Email: testhost@example.com
   - Password: password123
   - Address: 123 Main St
   - City: Dublin
   - Postcode: D02 XY12
4. **Click**: "Sign up"
5. **Expected**: Success message with email confirmation instructions
6. **Check email** and **click confirmation link**
7. **Expected**: Redirect to `/host` dashboard

### Test 3: Login with Role-Based Redirect

**After email is confirmed:**

1. **Go to**: `http://localhost:5173/login`
2. **Enter**: teststudent@example.com / password123
3. **Click**: "Sign in"
4. **Expected**: Redirect to `/guest` dashboard

**Test with host account:**

1. **Go to**: `http://localhost:5173/login`
2. **Enter**: testhost@example.com / password123
3. **Click**: "Sign in"
4. **Expected**: Redirect to `/host` dashboard

### Test 4: Verify Database Entries

**In Supabase SQL Editor:**

```sql
-- Check auth.users table
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Check user_profiles table
SELECT id, email, role, full_name, is_verified, is_active
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- Check guest_profiles table
SELECT gp.*, up.email, up.full_name
FROM guest_profiles gp
JOIN user_profiles up ON up.id = gp.user_id
ORDER BY gp.created_at DESC
LIMIT 5;

-- Check host_profiles table
SELECT hp.*, up.email, up.full_name
FROM host_profiles hp
JOIN user_profiles up ON up.id = hp.user_id
ORDER BY hp.created_at DESC
LIMIT 5;
```

**Expected Results**:
- ✅ User exists in `auth.users` with `email_confirmed_at` timestamp
- ✅ Matching entry in `user_profiles` with correct role
- ✅ Entry in `guest_profiles` or `host_profiles` with role-specific data

---

## 🐛 Troubleshooting

### Issue: "No confirmation email received"

**Solutions:**

1. **Check Supabase Email Settings**
   - Go to Authentication → Settings
   - Verify "Enable email confirmations" is ON
   - Check if you're on a free plan (may have email limits)

2. **Check Spam Folder**
   - Confirmation emails often go to spam

3. **Use Supabase Inbucket (Development)**
   - Free plans send emails to Supabase's test inbox
   - Go to Authentication → Email Templates
   - Click "View in Inbucket" to see test emails

4. **Disable Email Confirmation (Development Only)**
   - Go to Authentication → Settings
   - Turn OFF "Enable email confirmations"
   - Users will be auto-confirmed on signup
   - ⚠️ Re-enable before production!

### Issue: "Email confirmed but user not redirected"

**Solutions:**

1. **Check Browser Console** for errors
2. **Verify AuthCallback route** exists in AppNew.jsx
3. **Check if user_profiles entry** exists:
   ```sql
   SELECT * FROM user_profiles WHERE email = 'your-email@example.com';
   ```

### Issue: "Login redirects to wrong dashboard"

**Check the role in database:**
```sql
SELECT id, email, role FROM user_profiles WHERE email = 'your-email@example.com';
```

**Verify role is correct**: Should be 'admin', 'host', or 'guest'

### Issue: "Trigger not creating user_profiles"

**Check if trigger exists:**
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**If not found**, re-run `auto-create-profile-trigger.sql`

### Issue: "Storage bucket not found"

**Verify buckets exist:**
```sql
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id IN ('user-documents', 'profile-pictures');
```

**If empty**, run `storage-buckets-setup.sql`

---

## 🔒 Security Notes

1. **Email Confirmation**: Always enable in production to prevent spam accounts
2. **Storage Policies**: Files are restricted to user's own folder
3. **RLS Policies**: Ensure users can only access their own data
4. **HTTPS**: Use HTTPS in production for email redirect URLs
5. **Environment Variables**: Never commit `.env` file to git

---

## 📊 Database Tables Summary

| Table | Purpose | Created By |
|-------|---------|------------|
| `auth.users` | Supabase Auth users | Supabase |
| `user_profiles` | Common user data | Trigger (auto) |
| `guest_profiles` | Student-specific data | React app |
| `host_profiles` | Host-specific data | React app |
| `user_documents` | Document uploads | React app |
| `facilitation_requests` | Guest-Host requests | React app |
| `notifications` | User notifications | Database triggers |

---

## 📁 Storage Buckets

| Bucket | Access | Size Limit | File Types | Purpose |
|--------|--------|------------|------------|---------|
| `user-documents` | Private | 5MB | PDF, JPG, PNG | ID documents, verification |
| `profile-pictures` | Public | 2MB | JPG, PNG, WEBP | User profile pictures |

---

## ✅ Checklist

### Database Setup
- [ ] Ran `database-setup.sql`
- [ ] Ran `auto-create-profile-trigger.sql`
- [ ] Ran `storage-buckets-setup.sql`
- [ ] Verified all tables exist
- [ ] Verified trigger exists
- [ ] Verified storage buckets exist

### Supabase Configuration
- [ ] Email confirmation enabled
- [ ] Confirmation URL set to `/auth/callback`
- [ ] Email templates configured (optional)
- [ ] Environment variables in `.env`

### Application Setup
- [ ] Using AppNew.jsx (or merged with App.jsx)
- [ ] `/auth/callback` route exists
- [ ] AuthCallback.jsx imported
- [ ] npm install completed
- [ ] npm run dev works

### Testing
- [ ] Student signup works
- [ ] Host signup works
- [ ] Confirmation email received
- [ ] Email link redirects correctly
- [ ] Login redirects based on role
- [ ] Database entries created properly

---

## 🚀 Production Deployment

When deploying to production:

1. **Update Supabase Settings**:
   - Change confirmation URL from `localhost:5173` to your domain
   - Example: `https://yourdomain.com/auth/callback`

2. **Update Environment Variables**:
   - Use production Supabase URL and keys
   - Ensure `.env.production` or deployment platform has correct values

3. **Enable Email Confirmation**:
   - Ensure it's enabled in production
   - Test with real email addresses

4. **Monitor Email Delivery**:
   - Check Supabase logs for email sending errors
   - Consider custom SMTP provider for better deliverability

---

## 📞 Need Help?

If you encounter issues:

1. Check Supabase logs: **Project → Logs → Postgres Logs**
2. Check browser console: Press **F12** → Console tab
3. Review `TRIGGER_SETUP_INSTRUCTIONS.md` for trigger issues
4. Review `HOST_FAMILY_STAY_SETUP.md` for general setup
5. Review `SETUP_CHECKLIST.md` for step-by-step verification

---

## 🎉 Success!

When all tests pass, you have:
- ✅ Automatic user profile creation
- ✅ Email confirmation flow
- ✅ Role-based authentication
- ✅ Secure storage buckets
- ✅ Complete signup and login system

Your Host Family Stay application is ready for users to sign up and start using! 🏠
