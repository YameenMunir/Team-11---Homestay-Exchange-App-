# Homestay Exchange App

A full-stack platform connecting **international students** with **host families** for homestay arrangements in the UK. The application provides a secure, user-friendly ecosystem for profile creation, matching, task management, document verification, and ongoing communication between students and hosts.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [User Roles](#user-roles)
- [Authentication](#authentication)
- [API Services](#api-services)
- [Testing](#testing)
- [Deployment](#deployment)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

The Homestay Exchange App simplifies the process of matching students seeking accommodation with host families offering rooms. The platform emphasizes:

- **Security**: Document verification, Row Level Security (RLS) policies, and admin oversight
- **Accessibility**: Senior mode, color blind support, voice guidance, and responsive design
- **User Experience**: Multi-step signup, real-time notifications, and intuitive dashboards
- **Trust**: Review system, monthly feedback, and recognition badges

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Multi-Role System** | Separate interfaces for Students, Hosts, and Admins |
| **Profile Management** | Comprehensive profiles with photos, skills, preferences |
| **Document Verification** | Upload and verify IDs, DBS checks, admission letters |
| **Browse & Match** | Students browse hosts, save favorites, apply for tasks |
| **Task System** | Hosts create tasks, students apply and manage applications |
| **Reviews & Ratings** | 1-5 star platform reviews with anonymous option |
| **Monthly Feedback** | Structured feedback forms for ongoing stays |
| **Recognition System** | Badges and ratings based on user performance |

### Student Features

- Browse available host profiles
- Save favorite hosts
- Apply for tasks posted by hosts
- Submit platform reviews
- Track application status
- Submit monthly feedback during stays
- View recognition status and badges

### Host Features

- Create and manage property profiles
- Post tasks for student assistance
- Review and manage applications
- Submit platform reviews
- Track facilitation requests
- Submit monthly feedback

### Admin Features

- User verification and management
- Document review and approval
- Facilitation request handling
- Termination request processing
- Dispute resolution
- Review moderation
- Report generation and management
- Create user profiles on behalf of users

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| Vite | 6.1.0 | Build tool & dev server |
| React Router | 7.9.6 | Client-side routing |
| Tailwind CSS | 3.4.18 | Utility-first styling |
| Material-UI | 6.4.4 | Component library |
| Lucide React | 0.555.0 | Icon library |
| Formik | 2.4.6 | Form management |
| Yup | 1.6.1 | Schema validation |
| React Hot Toast | 2.5.2 | Toast notifications |
| Emotion | 11.14.0 | CSS-in-JS |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database (via Supabase) |
| Supabase Auth | Authentication |
| Supabase Storage | File uploads |
| Row Level Security | Data access control |

### Development & Deployment

| Tool | Purpose |
|------|---------|
| Vercel | Production hosting |
| ESLint | Code linting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| TypeScript | Type definitions |
| PostCSS | CSS processing |

---

## Project Structure

```
homestay-exchange-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── admin/           # Admin-specific components
│   │   ├── guest/           # Student-specific components
│   │   └── shared/          # Shared components
│   │
│   ├── pages/               # Page components (51 pages)
│   │   ├── auth/            # Authentication pages
│   │   ├── StudentSignup.jsx
│   │   ├── StudentLogin.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── HostSignup.jsx
│   │   ├── HostLogin.jsx
│   │   ├── HostDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── BrowseHosts.jsx
│   │   ├── Reviews.jsx
│   │   └── ...
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── AuthContextNew.jsx
│   │   ├── UserContext.jsx
│   │   ├── AdminContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   ├── useMonthlyFeedback.js
│   │   └── useVoiceGuidance.js
│   │
│   ├── services/            # API service modules
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── hostService.js
│   │   ├── reviewsService.js
│   │   ├── adminService.js
│   │   └── ...
│   │
│   ├── lib/                 # Utilities and constants
│   │   ├── constants.js
│   │   └── supabaseClient.js
│   │
│   ├── utils/               # Helper utilities
│   │   ├── validation.js    # Email/form validation
│   │   ├── supabase.js
│   │   ├── errorHandler.js
│   │   └── ukUniversities.js
│   │
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
│
├── supabase/
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Seed data
│
├── public/                  # Static assets
│   └── documents/           # Sample documents
│
├── docs/                    # Documentation with screenshots
│
├── database-setup.sql       # Complete database schema
├── storage-buckets-setup.sql # Storage configuration
├── vercel.json              # Vercel deployment config
├── tailwind.config.js       # Tailwind configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/homestay-exchange-app.git
   cd homestay-exchange-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials (see [Environment Variables](#environment-variables))

4. **Set up the database**
   - Run the SQL scripts in your Supabase SQL Editor (see [Database Setup](#database-setup))

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Important Security Notes

- Only variables prefixed with `VITE_` are exposed to the frontend
- **Never** expose your `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Add your production domain to Supabase's allowed redirect URLs
- Configure CORS settings in Supabase Dashboard

---

## Database Setup

### 1. Create Tables

Run `database-setup.sql` in Supabase SQL Editor to create:

- `user_profiles` - User account information
- `guest_profiles` - Student-specific data
- `host_profiles` - Host-specific data
- `platform_reviews` - User reviews
- `todos` - Task management

### 2. Configure Storage

Run `storage-buckets-setup.sql` to create:

- `user-documents` bucket (private, 5MB limit)
- `profile-pictures` bucket (public, 2MB limit)

### 3. Set Up RLS Policies

The SQL scripts include Row Level Security policies ensuring:

- Users can only access their own data
- Admins have elevated access
- Public data is readable by all authenticated users

### 4. Create Database Functions

Run `create-profile-functions.sql` for:

- `create_guest_profile()` - RPC function for student signup
- `create_host_profile()` - RPC function for host signup

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm test` | Run Vitest tests |
| `npm run test:ui` | Run tests with browser UI |

---

## User Roles

### Student (Guest)

Students seeking accommodation can:
- Create profiles with university, course, and skills
- Browse and save host profiles
- Apply for tasks
- Submit reviews and feedback

**Routes**: `/student/*`

### Host

Hosts offering accommodation can:
- Create property profiles
- Post tasks for student assistance
- Manage applications
- Submit reviews and feedback

**Routes**: `/host/*`

### Admin

Platform administrators can:
- Verify user documents
- Manage user accounts
- Handle facilitation requests
- Moderate reviews
- Generate reports

**Admin Sub-roles**:
- `super_admin` - Full access including user deletion
- `admin` - User management and verification
- `moderator` - Content moderation
- `support` - Basic support functions

**Routes**: `/admin/*`

---

## Authentication

### Implementation

The app uses **Supabase Authentication** with email/password:

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe', role: 'guest' }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Protected Routes

```jsx
// For authenticated users
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// For admin users only
<ProtectedAdminRoute>
  <AdminDashboard />
</ProtectedAdminRoute>

// For verified users only
<RequiresVerification>
  <VerifiedContent />
</RequiresVerification>
```

### Auth Context Usage

```jsx
import { useAuth } from './context/AuthContextNew';

function Component() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <LoginPrompt />;

  return <AuthenticatedContent user={user} />;
}
```

---

## API Services

### authService.js

```javascript
import { authService } from './services/authService';

// Authentication methods
await authService.signUp(email, password, metadata);
await authService.signIn(email, password);
await authService.signOut();
await authService.resetPassword(email);
```

### profileService.js

```javascript
import { profileService } from './services/profileService';

// Profile operations
await profileService.getProfile(userId);
await profileService.updateProfile(userId, data);
await profileService.uploadProfilePicture(userId, file);
```

### reviewsService.js

```javascript
import { reviewsService } from './services/reviewsService';

// Review operations
await reviewsService.getReviews();
await reviewsService.createReview(userId, rating, text, isAnonymous);
await reviewsService.updateReview(reviewId, rating, text);
await reviewsService.deleteReview(reviewId);
```

---

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test file
npm test src/App.test.jsx
```

### Test Configuration

Tests are configured in `vitest.config.js` with:
- Browser testing via Playwright
- React plugin support
- Chromium browser

### Writing Tests

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Link your GitHub repository to Vercel

2. **Configure Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel settings

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Vercel automatically deploys on push to main branch

### vercel.json Configuration

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

This enables SPA routing - all routes redirect to `index.html` for React Router.

### Supabase Configuration

1. Add your Vercel domain to **Authentication > URL Configuration**
2. Configure **CORS** to allow your production domain
3. Enable **Email confirmations** if required

---

## Accessibility

The app includes comprehensive accessibility features:

### Senior Mode

Increases font sizes and spacing for better readability:

```jsx
// Enable in user settings
await updateProfile({ senior_mode: true });
```

### Color Blind Support

Three color blind modes available:
- **Protanopia** (red-blind)
- **Deuteranopia** (green-blind)
- **Tritanopia** (blue-blind)

SVG filters are applied globally when enabled.

### Voice Guidance

Text-to-speech support for navigation and actions:

```jsx
import { useVoiceGuidance } from './hooks/useVoiceGuidance';

const { speak } = useVoiceGuidance();
speak('Welcome to the dashboard');
```

### Help Overlay

Interactive help overlay explaining UI elements:

```jsx
// Toggle help mode
<HelpOverlay enabled={helpMode} />
```

---

## Contributing

### Development Workflow

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Run linting and tests**
   ```bash
   npm run lint
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use functional components with hooks
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Keep components small and focused
- Add JSDoc comments for complex functions

### Commit Message Format

```
type: description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance
```

---

## Troubleshooting

### Common Issues

**Issue**: "Invalid API key" error
- **Solution**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

**Issue**: CORS errors
- **Solution**: Add your domain to Supabase's allowed origins

**Issue**: Storage upload fails
- **Solution**: Check bucket RLS policies and file size limits

**Issue**: Routes return 404 on refresh
- **Solution**: Ensure `vercel.json` rewrites are configured

**Issue**: Email confirmation not working
- **Solution**: Configure SMTP in Supabase Dashboard > Authentication > Email Templates

### Debug Mode

Enable console logging:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

### Useful SQL Queries

```sql
-- Check user profiles
SELECT * FROM user_profiles WHERE email = 'user@example.com';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

---

## Documentation

Additional documentation available in the project:

| File | Description |
|------|-------------|
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `SETUP_CHECKLIST.md` | Implementation checklist |
| `REVIEWS_FEATURE_IMPLEMENTATION.md` | Reviews system documentation |
| `EMAIL_CONFIRMATION_SETUP.md` | Email verification setup |
| `RLS_POLICY_FIX.md` | Row Level Security configuration |
| `TROUBLESHOOTING_SIGNUP_ERRORS.md` | Signup issue resolution |

---

## License

This project is licensed under the terms specified in the `LICENSE` file.

---

## Support

For issues and feature requests, please open a GitHub issue or contact the development team.

---

**Built with React, Supabase, and Vercel**
