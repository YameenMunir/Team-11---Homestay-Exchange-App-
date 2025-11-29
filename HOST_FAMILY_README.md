# 🏠 Host Family Stay Application

A production-ready web application connecting students with host families for affordable accommodation through intergenerational living arrangements.

## 🎯 Project Overview

**Tech Stack:**
- **Frontend:** React 18 + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** TailwindCSS
- **Deployment:** Vercel

**Key Features:**
- ✅ Role-based authentication (Admin, Host, Guest)
- ✅ Document verification system
- ✅ Facilitation request workflow
- ✅ Real-time notifications
- ✅ Secure file uploads
- ✅ Two-way rating system
- ✅ Row Level Security (RLS)

## 📁 Project Structure

```
host-family-stay-app/
├── database-setup.sql              # Complete DB schema + RLS policies
├── HOST_FAMILY_STAY_SETUP.md      # Detailed setup guide
├── FILES_CREATED_SUMMARY.md       # List of all created files
├── .env.example                    # Environment variables template
│
├── src/
│   ├── lib/
│   │   ├── supabaseClient.js      # Supabase configuration
│   │   └── constants.js           # App constants
│   │
│   ├── context/
│   │   ├── AuthContextNew.jsx     # Auth provider
│   │   └── NotificationContext.jsx # Notifications
│   │
│   ├── hooks/
│   │   └── useProfile.js          # Profile management
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── shared/
│   │   │   ├── Navbar.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── guest/
│   │   │   ├── BrowseHosts.jsx
│   │   │   ├── GuestProfile.jsx
│   │   │   └── GuestDashboard.jsx
│   │   └── admin/
│   │       ├── VerifyDocuments.jsx
│   │       ├── ManageRequests.jsx
│   │       └── AdminDashboard.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── GuestDashboardPage.jsx
│   │   ├── HostDashboardPage.jsx
│   │   └── AdminDashboardPage.jsx
│   │
│   └── AppNew.jsx                  # Main app with routing
│
└── package.json
```

## 🚀 Quick Start (5 Minutes)

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

1. Go to [Supabase SQL Editor](https://app.supabase.com)
2. Copy entire contents of `database-setup.sql`
3. Paste and run in SQL Editor
4. Verify all tables created successfully

### 4. Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name: `user-documents`
4. Set to **Private**
5. Click **Create bucket**

### 5. Create Admin User

In Supabase:
1. Go to **Authentication → Users**
2. Click **Add User**
3. Email: `admin@hostfamilystay.com`
4. Password: (choose secure password)
5. Copy the user UUID
6. Run in SQL Editor:

```sql
INSERT INTO user_profiles (id, email, role, full_name, is_verified, is_active)
VALUES (
    'PASTE_UUID_HERE'::uuid,
    'admin@hostfamilystay.com',
    'admin',
    'System Administrator',
    true,
    true
);
```

### 6. Update Main App

**Option A:** Replace existing App
```bash
mv src/App.jsx src/App.backup.jsx
mv src/AppNew.jsx src/App.jsx
```

**Option B:** Update main.jsx import
```javascript
// In src/main.jsx, change:
import App from './AppNew'
```

### 7. Run Application

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 🧪 Testing the Application

### Test User Flow:

**1. Guest Signup:**
- Go to `/signup`
- Select "I'm a Student"
- Fill: Name, Email, Password, University, Course, Year
- Upload: Government ID, Admission Proof
- ✅ Account created

**2. Host Signup:**
- Go to `/signup`
- Select "I'm a Host"
- Fill: Name, Email, Password, Address, City, Postcode
- Upload: Government ID
- ✅ Account created

**3. Admin Verification:**
- Login as admin
- Go to "Verify Documents" tab
- Review uploaded documents
- Click "Approve" or "Reject"
- ✅ Users get notification

**4. Guest Browse Hosts:**
- Login as student
- Go to "Browse Hosts" tab
- Filter by city/postcode
- Click "Facilitate Match"
- ✅ Request sent to admin

**5. Admin Manage Requests:**
- Login as admin
- Go to "Facilitation Requests"
- Review request
- Change status: "Start Review" → "Matched"
- ✅ Users notified

## 📊 Database Schema

### Core Tables:
- **user_profiles** - All users (guest, host, admin)
- **guest_profiles** - Student-specific data
- **host_profiles** - Host property data
- **user_documents** - Uploaded documents
- **facilitation_requests** - Match requests
- **ratings** - Two-way ratings
- **notifications** - Real-time alerts
- **problem_reports** - Issue tracking

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Role-based policies
- ✅ Secure storage access
- ✅ Document verification logs

## 🔐 User Roles & Permissions

| Feature | Admin | Host | Guest |
|---------|-------|------|-------|
| Verify Documents | ✅ | ❌ | ❌ |
| Create Profiles for Others | ✅ | ❌ | ❌ |
| Manage Requests | ✅ | ❌ | ❌ |
| Browse Guests | ✅ | ✅ | ❌ |
| Browse Hosts | ✅ | ❌ | ✅ |
| Upload Documents | ❌ | ✅ | ✅ |
| Send Facilitation Requests | ❌ | ✅ | ✅ |
| Rate Users | ❌ | ✅ | ✅ |

## 📱 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login form |
| `/signup` | Public | Signup with role selection |
| `/guest` | Guest only | Student dashboard |
| `/host` | Host only | Host dashboard |
| `/admin` | Admin only | Admin dashboard |

## 🛠️ Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚢 Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## 📚 Documentation

- **Setup Guide:** `HOST_FAMILY_STAY_SETUP.md`
- **Files Created:** `FILES_CREATED_SUMMARY.md`
- **Database Schema:** `database-setup.sql`

## ⚠️ Important Notes

1. **Never commit `.env`** to version control
2. **Always use RLS policies** - Never bypass with service role key
3. **Verify documents thoroughly** before approving users
4. **Keep admin credentials secure**
5. **Test in development** before deploying to production

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase env vars" | Check `.env` file exists and has correct values |
| "Cannot read properties of null" | Ensure database setup script ran successfully |
| "Storage bucket not found" | Create `user-documents` bucket in Supabase |
| "RLS policy prevents operation" | Verify all policies created in database-setup.sql |
| "User not verified" | Admin must approve user documents first |

## 🎯 Roadmap

### ✅ Completed
- User authentication & authorization
- Role-based dashboards
- Document upload & verification
- Facilitation request system
- Admin management panel
- Real-time notifications
- Database with RLS

### 🚧 In Progress
- Host dashboard features
- Enhanced profile editing
- Rating system UI

### 📋 Planned
- Email notifications
- Problem reporting UI
- Legal policy pages
- Advanced search filters
- Mobile responsiveness
- Analytics dashboard

## 📄 License

This project is part of CSI_6_ICT Coursework - Team 11

## 👥 Team

- **Yameen Munir** - Scrum Master/Project Manager
- **Zachary Mammadov** - Client/Product Owner
- **Suhayb Munir** - Back-End Developer
- **Bisma Moon** - Front-end Developer
- **Tobi** - Business Analyst
- **Tawhidur Rahman Nabin** - UI/UX Designer
- **Samiul Hoque/Nabilul Haque** - Tester/QA

## 📞 Support

For issues or questions:
1. Check `HOST_FAMILY_STAY_SETUP.md`
2. Review Supabase logs
3. Check browser console
4. Verify environment variables

---

**Status:** ✅ Production-ready MVP complete!

Built with ❤️ using React, Vite, Supabase, and TailwindCSS
