# 🏠 Host Family Stay App - Complete Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (create at [supabase.com](https://supabase.com))
- Git installed

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project:
1. Go to Project Settings → API
2. Copy "Project URL" as `VITE_SUPABASE_URL`
3. Copy "anon/public" key as `VITE_SUPABASE_ANON_KEY`

### 3. Database Setup

1. Go to your Supabase project → SQL Editor
2. Copy and paste the contents of `database-setup.sql` (found in this directory)
3. Run the script
4. Verify all tables were created successfully

### 4. Create Storage Bucket

1. Go to Storage in Supabase
2. Create a new bucket named `user-documents`
3. Set it to **private** (not public)

### 5. Create Admin User

1. Go to Authentication → Users in Supabase
2. Click "Add User" → "Create new user"
3. Enter email: `admin@hostfamilystay.com` (or your preferred admin email)
4. Set a secure password
5. Copy the user UUID
6. Go to SQL Editor and run:

```sql
INSERT INTO user_profiles (id, email, role, full_name, is_verified, is_active)
VALUES (
    'PASTE_ADMIN_UUID_HERE',
    'admin@hostfamilystay.com',
    'admin',
    'System Administrator',
    true,
    true
);
```

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 File Structure

```
host-family-stay-app/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── shared/
│   │   │   ├── Navbar.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── guest/
│   │   │   ├── BrowseHosts.jsx
│   │   │   ├── GuestProfile.jsx
│   │   │   └── GuestDashboard.jsx
│   │   ├── host/
│   │   └── admin/
│   │       ├── VerifyDocuments.jsx
│   │       ├── ManageRequests.jsx
│   │       └── AdminDashboard.jsx
│   ├── context/
│   │   ├── AuthContextNew.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   └── useProfile.js
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── constants.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── GuestDashboardPage.jsx
│   │   ├── HostDashboardPage.jsx
│   │   └── AdminDashboardPage.jsx
│   ├── AppNew.jsx
│   └── main.jsx
├── .env
├── database-setup.sql
└── package.json
```

## 🔑 User Roles

### Admin
- Email: `admin@hostfamilystay.com`
- Can verify documents
- Can manage facilitation requests
- Can create profiles on behalf of users

### Host
- Older adults offering accommodation
- Can create detailed property profiles
- Can browse verified students
- Can send facilitation requests

### Guest (Student)
- University students seeking accommodation
- Must upload admission proof and ID
- Can browse verified hosts
- Can send facilitation requests

## 📝 Testing the Application

### Test Flow:

1. **Create a Student Account:**
   - Go to `/signup`
   - Select "I'm a Student"
   - Fill in details
   - Upload required documents

2. **Create a Host Account:**
   - Go to `/signup`
   - Select "I'm a Host"
   - Fill in property details
   - Upload ID document

3. **Admin Verification:**
   - Log in as admin
   - Go to "Verify Documents"
   - Approve student and host documents

4. **Browse and Facilitate:**
   - Log in as student
   - Browse hosts
   - Click "Facilitate Match"
   - Admin receives notification

5. **Admin Management:**
   - Log in as admin
   - Go to "Facilitation Requests"
   - Review and approve match

## 🔒 Security Features

✅ Row Level Security (RLS) enabled on all tables
✅ Role-based access control (RBAC)
✅ Document verification system
✅ Secure file uploads to private storage
✅ Password hashing via Supabase Auth
✅ Email verification
✅ Protected API routes

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution:** Ensure `.env` file exists with correct variables

### Issue: "Cannot read properties of null"
**Solution:** Make sure you've run the database setup script

### Issue: "Storage bucket not found"
**Solution:** Create `user-documents` bucket in Supabase Storage

### Issue: "RLS policy prevents operation"
**Solution:** Ensure all RLS policies are created (check database-setup.sql)

## 📚 Key Features Implemented

✅ User authentication (signup/login)
✅ Role-based dashboards
✅ Document upload and verification
✅ Host browsing for students
✅ Facilitation request system
✅ Admin document verification
✅ Admin request management
✅ Real-time notifications
✅ Profile management
✅ Two-way rating system (database ready)
✅ Problem reporting (database ready)

## 🚢 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## 📧 Support

For issues or questions:
- Check Supabase logs: Project → Logs
- Check browser console for errors
- Verify all environment variables are set

## 🎯 Next Steps

1. Add host dashboard features
2. Implement rating system UI
3. Add problem reporting UI
4. Implement email notifications
5. Add more accessibility features
6. Create legal policy pages

---

**Built with React + Vite + Supabase + TailwindCSS**
