# Host Family Stay - Homestay Exchange App

A modern web application connecting students seeking affordable accommodation with hosts who need support with daily tasks. Built with React, Tailwind CSS, and focused on accessibility and user experience.

## 🎯 Project Overview

Host Family Stay facilitates meaningful connections between students (primarily international) and hosts (elderly individuals or families) through a "barter" system where students provide services in exchange for free or reduced-cost accommodation.

**Mission:** Making UK education more accessible through community support and intergenerational connections.

## ✨ Key Features

### For Students
- 📝 Easy registration with university verification
- 🔍 Browse and filter available hosts by location and services
- ⭐ Recognition system (Bronze/Silver/Gold) based on performance
- 📊 Personal dashboard tracking hours and arrangements
- 💬 Facilitated connection requests (no direct messaging for safety)

### For Hosts
- 🏠 Simple, accessible interface designed for elderly users
- ✅ Comprehensive verification (ID, address, DBS check)
- 👥 View matched students based on your needs
- 📈 Two-way rating system for transparency
- 🛡️ Admin-facilitated arrangements for safety

### For Administrators
- 🔐 Verification panel for approving hosts and students
- 📋 Facilitation management dashboard
- 📊 Overview of all arrangements and pending requests
- 🔍 Document review system

### Safety & Verification
- ✓ ID verification for all users
- ✓ DBS background checks for hosts
- ✓ University admission verification for students
- ✓ Address verification for hosts
- ✓ No direct messaging between users
- ✓ Admin team facilitates all connections

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Fonts:** Inter & Poppins (Google Fonts)

## 📁 Project Structure

```
homestay-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── auth/
│   │   ├── host/
│   │   ├── student/
│   │   ├── admin/
│   │   └── common/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── HostLogin.jsx
│   │   ├── HostSignup.jsx
│   │   ├── StudentLogin.jsx
│   │   ├── StudentSignup.jsx
│   │   ├── HostDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── BrowseHosts.jsx
│   │   ├── MatchDetails.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── Help.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd homestay-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design Philosophy

### Modern & Clean
- Generous whitespace for readability
- Consistent color scheme (Blues, Purples, Grays)
- Smooth animations and transitions
- Professional card-based layouts

### Accessible for All
- **Large Text & Icons:** Especially for host-facing pages
- **Simple Navigation:** Intuitive menu structure
- **High Contrast:** WCAG compliant color combinations
- **Clear CTAs:** Prominent call-to-action buttons
- **Keyboard Navigation:** Full keyboard support

### Mobile-First & Responsive
- Fully responsive design across all breakpoints
- Touch-friendly interface elements
- Optimized for mobile, tablet, and desktop

## 📱 Key User Flows

### Student Journey
1. Sign up → Upload ID & admission letter
2. Wait for admin verification
3. Browse available hosts
4. Request facilitation for a match
5. Admin coordinates meeting
6. Begin arrangement
7. Monthly ratings and feedback

### Host Journey
1. Sign up → Upload ID, utility bill, DBS check
2. Wait for admin verification
3. Receive facilitation requests
4. Admin coordinates meetings
5. Begin arrangement
6. Monthly ratings and feedback

### Admin Workflow
1. Review pending verifications
2. Approve/reject user accounts
3. Review facilitation requests
4. Coordinate connections
5. Monitor active arrangements

## 🔑 Environment Variables

Create a `.env` file in the root directory (if needed for future API integration):

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=Host Family Stay
```

## 📊 Current Status

### ✅ Completed Features
- Complete UI/UX design
- Landing page with hero section
- Authentication pages (Host & Student)
- Multi-step registration forms
- Browse hosts page with filtering
- Match details with "Facilitate" button
- Dashboards (Host, Student, Admin)
- Help center with FAQ and Report Problem
- Rating and review system UI
- Recognition badges (Bronze/Silver/Gold)
- Responsive design across all pages
- Accessibility features for elderly users

### 🔄 Next Steps (Backend Integration)
- Connect to REST API / GraphQL backend
- Implement real authentication
- Document upload to cloud storage
- Real-time notifications
- Email notification system
- Payment integration (if needed)
- Database integration

## 🤝 Contributing

This is a university project for Law & Technology coursework. For questions or contributions:

**Client Contact:**
- Zach Mamamdov
- Email: zm@hostfamilystay.com

**Team Members:**
- Yameen, Suhayb, Bisma (Computer Science)
- Toby (Business/Legal Analyst)

## 📄 Legal & Compliance

This application requires the following legal documents (to be drafted):
- Terms and Conditions (separate for hosts and guests)
- Privacy Policy (GDPR compliant)
- Anti-Discrimination & Equality Policy
- Dispute Resolution Policy
- FAQ section

## 🔒 Security Considerations

- All user data must be encrypted
- Secure document storage
- HTTPS only in production
- Regular security audits
- GDPR compliance for UK/EU users
- Background check verification
- No direct user-to-user messaging

## 📞 Support

For help and support:
- Visit the Help Center in the app
- Email: zm@hostfamilystay.com
- Phone: +44 (0) 20 1234 5678

## 📜 License

© 2025 Host Family Stay. All rights reserved.

---

**Built with ❤️ for making education accessible**
