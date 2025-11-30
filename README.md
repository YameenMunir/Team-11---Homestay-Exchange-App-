# 🏡 Homestay Exchange App
A full-stack platform that connects **students** with **host families** for homestay arrangements. Users can create profiles, browse matches, manage bookings, and upload documents.  
Built with **React**, **Supabase**, and deployed on **Vercel**.

---

## 🎯 Purpose
The goal of this application is to provide a **simple, secure platform** that supports:
- Student & Host profile creation
- Browsing and matching
- Booking & task management
- Admin management
- Image/document uploads via cloud storage

---

## 🧰 Tech Stack

### Frontend
- React (Vite)  
- Tailwind CSS  
- React Router & Context API

### Backend
- Supabase  
  - PostgreSQL  
  - Authentication  
  - Storage  
  - RLS Security Policies

### Hosting / CI/CD
- Vercel

---

## 📁 Project Structure
```
src/           → React components, pages, hooks, context
supabase/      → seed.sql + migrations
public/        → static assets
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
git clone <repo-url>
cd homestay-exchange-app
npm install
```

### 2. Add Environment Variables
Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=server-only-key
```

### 3. Run the app
```bash
npm run dev
```

Local dev URL → http://localhost:5173

---

## 🔐 Security Notes
- Do **not** expose your Supabase service role key in the frontend.
- Only use `VITE_SUPABASE_` variables in React.
- Configure CORS & Redirect URLs in Supabase Dashboard.

---

## 🚀 Deployment (Vercel)
1. Connect the repo to Vercel  
2. Add environment vars under **Project → Settings**  
3. Build command:
```
npm run build
```
4. Output directory:
```
dist
```

---

## 🛠 Troubleshooting
- Verify Supabase URL + Anon Key  
- Allow localhost + production domain under Supabase CORS  
- Ensure Storage bucket permissions allow uploads  

---

## 📄 License
See the `LICENSE` file.
