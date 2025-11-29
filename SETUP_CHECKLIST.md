# ✅ Host Family Stay - Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📦 1. Project Files

- [ ] All files from `FILES_CREATED_SUMMARY.md` are present
- [ ] `database-setup.sql` exists in root directory
- [ ] `.env.example` exists
- [ ] `HOST_FAMILY_STAY_SETUP.md` is readable

## 🔧 2. Environment Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] Supabase URL added to `.env`
- [ ] Supabase anon key added to `.env`

## 🗄️ 3. Supabase Database

- [ ] Supabase project created at [supabase.com](https://supabase.com)
- [ ] SQL Editor opened
- [ ] `database-setup.sql` copied and executed
- [ ] All tables created successfully (check Tables section)
- [ ] No errors in SQL execution

**Verify Tables Created:**
- [ ] user_profiles
- [ ] host_profiles
- [ ] guest_profiles
- [ ] user_documents
- [ ] facilitation_requests
- [ ] ratings
- [ ] notifications
- [ ] problem_reports
- [ ] document_verification_logs

**Verify Functions Created:**
- [ ] update_updated_at_column()
- [ ] update_host_rating()
- [ ] update_guest_rating()
- [ ] notify_document_verification()
- [ ] notify_admin_facilitation()
- [ ] notify_admin_problem_report()
- [ ] is_admin()

## 📁 4. Storage Setup

- [ ] Go to Storage in Supabase
- [ ] Bucket `user-documents` created
- [ ] Bucket set to **Private** (not public)
- [ ] Storage policies applied (from database-setup.sql)

## 👤 5. Admin User

- [ ] Admin user created in Authentication
- [ ] Admin email: `admin@hostfamilystay.com` (or custom)
- [ ] Strong password set
- [ ] User UUID copied
- [ ] Admin profile inserted into `user_profiles` table
- [ ] Admin role verified as 'admin'
- [ ] `is_verified` set to true
- [ ] `is_active` set to true

**Test Admin Login:**
- [ ] Can login with admin credentials
- [ ] Redirected to `/admin` route
- [ ] Admin dashboard loads correctly
- [ ] Can see "Verify Documents" tab
- [ ] Can see "Facilitation Requests" tab

## 🎨 6. Application Setup

**Main App Configuration:**
- [ ] Choose Option A or B from setup guide
- [ ] Option A: `src/App.jsx` replaced with AppNew content
- [ ] Option B: `src/main.jsx` updated to import AppNew

**Verify Imports:**
- [ ] All component imports resolve (no red underlines)
- [ ] Context providers imported correctly
- [ ] Routes configured properly

## 🚀 7. Run Application

- [ ] `npm run dev` executes without errors
- [ ] Application opens at `http://localhost:5173`
- [ ] No console errors in browser
- [ ] Home page loads correctly

## 🧪 8. Test Core Features

### Landing Page (/)
- [ ] Home page displays correctly
- [ ] "Get Started" button goes to `/signup`
- [ ] "Sign In" button goes to `/login`

### Signup Flow
- [ ] Can access `/signup`
- [ ] Role selection buttons work (Student/Host)
- [ ] Can fill student signup form
- [ ] Can fill host signup form
- [ ] Form validation works
- [ ] Signup creates user in Supabase Auth
- [ ] Profile created in user_profiles table
- [ ] Role-specific profile created

### Login Flow
- [ ] Can access `/login`
- [ ] Can login with created account
- [ ] Redirects based on role (guest→/guest, host→/host)
- [ ] Dashboard loads after login

### Guest Dashboard
- [ ] Guest can login
- [ ] Redirected to `/guest`
- [ ] Dashboard shows tabs (Browse Hosts, My Profile, Documents)
- [ ] Browse Hosts tab shows verified hosts
- [ ] Can upload documents
- [ ] Documents appear in admin panel

### Admin Dashboard
- [ ] Admin can login
- [ ] Redirected to `/admin`
- [ ] Can see pending documents
- [ ] Can approve/reject documents
- [ ] Can view facilitation requests
- [ ] Actions trigger notifications

### Document Upload
- [ ] File upload component renders
- [ ] Can select file (PDF/Image)
- [ ] File size validation works (<5MB)
- [ ] File type validation works
- [ ] Upload creates record in user_documents
- [ ] File appears in Supabase Storage
- [ ] Admin can see pending document

### Facilitation Requests
- [ ] Guest can send facilitation request
- [ ] Request appears in admin dashboard
- [ ] Admin can change request status
- [ ] Status updates correctly

### Notifications
- [ ] Document approval triggers notification
- [ ] Facilitation request triggers notification
- [ ] Notifications appear in navbar (bell icon)
- [ ] Can mark notifications as read

## 🔐 9. Security Verification

- [ ] Cannot access `/admin` without admin role
- [ ] Cannot access `/guest` without guest role
- [ ] Cannot access `/host` without host role
- [ ] Unauthenticated users redirected to `/login`
- [ ] File uploads restricted to own user folder
- [ ] RLS policies prevent unauthorized data access

**Test RLS Policies:**
- [ ] Guest cannot see unverified hosts
- [ ] Guest cannot see other users' documents
- [ ] Host cannot approve documents
- [ ] Non-admin cannot access admin features

## 📱 10. Responsive Design

- [ ] Application works on desktop (1920x1080)
- [ ] Application works on tablet (768px)
- [ ] Application works on mobile (375px)
- [ ] Navigation responsive
- [ ] Forms responsive
- [ ] Tables/cards responsive

## 🐛 11. Error Handling

- [ ] Invalid login shows error message
- [ ] Failed signup shows error message
- [ ] File upload errors display correctly
- [ ] Network errors handled gracefully
- [ ] Loading states show correctly

## 📊 12. Data Verification

**In Supabase:**
- [ ] Check Tables → user_profiles has entries
- [ ] Check Tables → guest_profiles or host_profiles has entries
- [ ] Check Tables → user_documents has entries
- [ ] Check Storage → user-documents bucket has files
- [ ] Check Authentication → users list matches profiles

## 🚢 13. Pre-Deployment Checklist

- [ ] All features tested and working
- [ ] No console errors
- [ ] No broken images/links
- [ ] Environment variables documented
- [ ] README updated with project info
- [ ] Git repository initialized
- [ ] `.gitignore` includes `.env`

## 📈 14. Optional Enhancements

- [ ] Add email verification
- [ ] Add password reset
- [ ] Add user settings page
- [ ] Add rating system UI
- [ ] Add problem reporting UI
- [ ] Add legal policy pages
- [ ] Add search/filter improvements
- [ ] Add profile pictures
- [ ] Add email notifications

## ✅ Final Verification

- [ ] Application runs without errors
- [ ] All user roles functional
- [ ] Database properly configured
- [ ] Security policies working
- [ ] Ready for demo/testing

---

## 🎉 Completion Status

**Items Completed: ____ / Total**

When all items are checked, your Host Family Stay application is ready for use!

## 📞 Need Help?

If you're stuck:
1. ❌ Check the specific error message
2. 📖 Review `HOST_FAMILY_STAY_SETUP.md`
3. 🔍 Check Supabase logs (Project → Logs)
4. 🌐 Check browser console (F12)
5. 💾 Verify database tables created
6. 🔐 Verify `.env` file configured

## 🚀 Next Steps After Completion

1. Test with multiple users
2. Gather feedback
3. Implement additional features
4. Deploy to Vercel
5. Monitor performance
6. Add analytics

---

**Good luck with your Host Family Stay application! 🏠**
