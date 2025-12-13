# Homestay Exchange App - Comprehensive Project Documentation

**Document Version:** 1.0
**Last Updated:** December 2024
**Project Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Project Architecture](#3-project-architecture)
4. [Feature Status Overview](#4-feature-status-overview)
5. [Fully Developed Features](#5-fully-developed-features)
6. [Partially Developed Features](#6-partially-developed-features)
7. [Not Yet Developed Features](#7-not-yet-developed-features)
8. [Database Schema](#8-database-schema)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Routing Structure](#10-routing-structure)
11. [Services Layer](#11-services-layer)
12. [Component Library](#12-component-library)
13. [Accessibility Features](#13-accessibility-features)
14. [Environment Setup](#14-environment-setup)
15. [Known Issues & Technical Debt](#15-known-issues--technical-debt)

---

## 1. Executive Summary

### Project Overview

The **Homestay Exchange App** is a web-based platform designed to connect international students seeking affordable accommodation in the UK with hosts (primarily elderly individuals) who can offer housing in exchange for companionship and assistance with daily tasks. This creates a mutually beneficial intergenerational arrangement.

### Core Value Proposition

- **For Students:** Free or low-cost accommodation, cultural immersion, and community recognition
- **For Hosts:** Companionship, help with daily tasks, and reduced loneliness
- **For Society:** Intergenerational connections and affordable student housing solutions

### Target Users

| User Type | Description | Role Code |
|-----------|-------------|-----------|
| **Students/Guests** | University students seeking accommodation | `guest` |
| **Hosts** | Homeowners offering accommodation | `host` |
| **Administrators** | Platform managers and moderators | `admin` |

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI library |
| **React Router DOM** | 7.9.6 | Client-side routing |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **Material UI (MUI)** | 6.4.4 | Component library |
| **Lucide React** | 0.555.0 | Icon library |
| **Emotion** | 11.14.0 | CSS-in-JS styling |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.48.1 | Backend-as-a-Service (PostgreSQL + Auth) |
| **PostgreSQL** | (via Supabase) | Relational database |

### Build & Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vite** | 6.1.0 | Build tool and dev server |
| **Vitest** | 3.0.9 | Unit testing framework |
| **Playwright** | 1.51.1 | E2E testing |
| **ESLint** | 9.20.1 | Code linting |
| **TypeScript** | 5.7.3 | Type definitions |

### Form & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Formik** | 2.4.6 | Form state management |
| **Yup** | 1.6.1 | Schema validation |

### Notifications

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hot Toast** | 2.5.2 | Toast notifications |

---

## 3. Project Architecture

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── guest/           # Student/guest components
│   ├── layout/          # Layout components (Navbar, Footer)
│   └── shared/          # Shared/common components
├── containers/          # Container components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Library configurations
├── pages/               # Page components (routes)
│   └── auth/            # Auth page variants
├── services/            # API service layer
└── utils/               # Utility functions

database/
└── migrations/          # SQL migration files

public/                  # Static assets
```

### State Management Architecture

```
App
├── AuthProvider (Authentication state)
│   └── UserProvider (User profile & accessibility)
│       └── AdminProvider (Admin sessions & permissions)
│           └── VerificationEventsProvider (Verification tracking)
│               └── AppContent (Main application)
```

---

## 4. Feature Status Overview

### Summary Table

| Category | Fully Developed | Partially Developed | Not Developed |
|----------|-----------------|---------------------|---------------|
| Authentication | 8 | 0 | 1 |
| User Management | 6 | 1 | 2 |
| Host Features | 5 | 1 | 2 |
| Student Features | 7 | 2 | 3 |
| Admin Features | 9 | 2 | 3 |
| Feedback & Recognition | 4 | 1 | 1 |
| Content & Info | 9 | 1 | 2 |
| Accessibility | 4 | 0 | 1 |
| **Total** | **52** | **8** | **15** |

### Development Progress

```
[██████████████████░░░░░░] 69% Complete
```

---

## 5. Fully Developed Features

### 5.1 Authentication System

| Feature | Description | Files |
|---------|-------------|-------|
| **Host Login** | Dedicated login page for hosts with orange theme | `HostLogin.jsx` |
| **Host Signup** | Multi-step registration with property details | `HostSignup.jsx` |
| **Student Login** | Dedicated login page for students with teal theme | `StudentLogin.jsx` |
| **Student Signup** | Registration with academic information | `StudentSignup.jsx` |
| **Admin Login** | Secure admin authentication | `AdminLogin.jsx` |
| **Session Management** | Persistent sessions via Supabase | `AuthContext.jsx` |
| **Role-Based Routing** | Protected routes based on user roles | `ProtectedRoute.jsx` |
| **Email Validation** | RFC 5322 compliant email validation | Custom validation |

### 5.2 User Profiles & Verification

| Feature | Description | Files |
|---------|-------------|-------|
| **Profile Creation** | Role-specific profile creation | `profileService.js` |
| **Document Upload** | Upload verification documents | `documentService.js`, `FileUpload.jsx` |
| **Admin Verification** | Admin workflow to verify users | `AdminUserManagement.jsx` |
| **Verification Status Banner** | Visual indicator of verification state | `VerificationStatusBanner.jsx` |
| **User Settings** | Profile and account settings | `UserSettings.jsx` |
| **Profile Display** | View user profiles with details | Various dashboard pages |

### 5.3 Host Features

| Feature | Description | Files |
|---------|-------------|-------|
| **Host Dashboard** | Overview of applications, ratings, tasks | `HostDashboard.jsx` |
| **Create Tasks** | Post tasks for students to apply | `CreateTask.jsx` |
| **Manage Tasks** | Edit, activate, close tasks | `ManageTasks.jsx` |
| **View Applications** | See student applications | `HostDashboard.jsx` |
| **Connection Management** | Accept/decline connection requests | `ConnectionRequests.jsx` |

### 5.4 Student Features

| Feature | Description | Files |
|---------|-------------|-------|
| **Student Dashboard** | Overview with matched hosts, saved hosts | `StudentDashboard.jsx` |
| **Browse Hosts** | Search and filter available hosts | `BrowseHosts.jsx` |
| **Host Details** | View detailed host profile and tasks | `MatchDetails.jsx` |
| **Save Hosts** | Favorite hosts for later | `SavedHosts.jsx`, `savedHostsService.js` |
| **Browse Tasks** | View available tasks from hosts | `BrowseTasks.jsx` |
| **Apply for Tasks** | Submit task applications | `TaskApplication.jsx` |
| **View Applications** | Track application status | `MyApplications.jsx` |

### 5.5 Facilitation System

| Feature | Description | Files |
|---------|-------------|-------|
| **Connection Requests** | Send/receive connection requests | `facilitationService.js` |
| **Request Management** | View pending, approved, declined requests | `ConnectionRequests.jsx` |
| **Admin Approval** | Admin reviews and approves matches | `AdminFacilitationRequests.jsx` |
| **Termination Requests** | Request to end arrangements | `terminationService.js` |
| **Termination Review** | Admin processes terminations | `AdminTerminationRequests.jsx` |

### 5.6 Feedback & Recognition

| Feature | Description | Files |
|---------|-------------|-------|
| **Monthly Feedback** | Submit monthly feedback for facilitations | `MonthlyFeedbackForm.jsx` |
| **Feedback History** | View past feedback received | `FeedbackHistory.jsx` |
| **Recognition Tiers** | Bronze/Silver/Gold achievement system | `RecognitionStatus.jsx` |
| **Recognition Badges** | Display badges on profiles | `RecognitionBadge.jsx` |

### 5.7 Admin Features

| Feature | Description | Files |
|---------|-------------|-------|
| **Admin Dashboard** | Overview with statistics | `AdminDashboard.jsx` |
| **User Management** | View, verify, ban, suspend users | `AdminUserManagement.jsx` |
| **Create Profiles** | Manually create user profiles | `AdminCreateProfile.jsx` |
| **Facilitation Requests** | Review connection requests | `AdminFacilitationRequests.jsx` |
| **Termination Requests** | Process termination requests | `AdminTerminationRequests.jsx` |
| **Dispute Management** | Handle user disputes | `AdminDisputes.jsx` |
| **Feedback Review** | Review monthly feedback submissions | `AdminFeedbackReview.jsx` |
| **Review Management** | Moderate platform reviews | `AdminReviewManagement.jsx` |
| **Reports Management** | View platform reports | `AdminReportsManagement.jsx` |

### 5.8 Reviews & Ratings

| Feature | Description | Files |
|---------|-------------|-------|
| **Platform Reviews** | Leave reviews for the platform | `Reviews.jsx` |
| **Review Display** | Show reviews on homepage (top 3) | `Home.jsx` |
| **My Reviews** | Manage personal reviews | `MyReviews.jsx` |
| **Admin Review Moderation** | Delete inappropriate reviews | `AdminReviewManagement.jsx` |
| **Deleted Reviews Audit** | Track deleted reviews | `deleted_reviews` table |

### 5.9 Information Pages

| Feature | Description | Files |
|---------|-------------|-------|
| **Home Page** | Landing page with features, testimonials | `Home.jsx` |
| **About Us** | Company/platform information | `AboutUs.jsx` |
| **Contact Us** | Contact form and support info | `ContactUs.jsx` |
| **Help Center** | Help resources and guides | `Help.jsx` |
| **FAQ** | Frequently asked questions | `FAQ.jsx` |
| **Terms & Conditions** | Legal terms | `TermsAndConditions.jsx` |
| **Privacy Policy** | Privacy information | `PrivacyPolicy.jsx` |
| **Anti-Discrimination Policy** | Non-discrimination guidelines | `AntiDiscriminationPolicy.jsx` |
| **Dispute Resolution** | Dispute handling procedures | `DisputeResolution.jsx` |

### 5.10 Accessibility Features

| Feature | Description | Files |
|---------|-------------|-------|
| **Senior Mode** | Larger fonts, simplified UI | `UserContext.jsx`, CSS |
| **Color Blind Modes** | Protanopia, Deuteranopia, Tritanopia filters | `App.jsx` (SVG filters) |
| **Voice Guidance** | Audio prompts hook | `useVoiceGuidance.js` |
| **Accessible Touch Targets** | Minimum 44px touch targets | `tailwind.config.js` |

---

## 6. Partially Developed Features

### 6.1 Knowledge Hub

**Status:** UI exists, content may be static
**File:** `KnowledgeHub.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Page layout | Dynamic content loading |
| Navigation | Content management system |
| Basic content display | Search functionality |

**Recommendation:** Add CMS integration or markdown-based content management.

### 6.2 Rate Experience

**Status:** Basic functionality exists
**File:** `RateExperience.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Rating form | Integration with facilitation |
| Star selection | Two-way rating flow |
| Basic submission | Rating aggregation display |

**Recommendation:** Complete integration with facilitation lifecycle.

### 6.3 Monthly Report

**Status:** Page exists, functionality needs verification
**File:** `MonthlyReport.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Report display UI | Report generation logic |
| Basic layout | PDF export |
| | Email delivery |

**Recommendation:** Implement automated report generation.

### 6.4 Admin Analytics

**Status:** Basic stats exist, advanced analytics pending
**File:** `AdminDashboardPage.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| User counts | Trend charts |
| Basic statistics | Export functionality |
| | Date range filtering |
| | Custom reports |

**Recommendation:** Add charting library (Chart.js/Recharts) for visualizations.

### 6.5 Task Application Flow

**Status:** Core flow exists, edge cases need work
**Files:** `TaskApplication.jsx`, `MyApplications.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Application submission | Application withdrawal |
| Status tracking | Host response notifications |
| Basic listing | Application editing |

**Recommendation:** Add real-time notifications for status changes.

### 6.6 Help Overlay System

**Status:** Component exists, coverage incomplete
**File:** `HelpOverlay.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Overlay component | Per-page help content |
| Toggle functionality | Interactive tutorials |
| | Contextual tips |

**Recommendation:** Add step-by-step onboarding tours.

### 6.7 Notification System

**Status:** Context exists, display needs work
**File:** `NotificationContext.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Context provider | Bell icon dropdown |
| Basic state | Mark as read |
| | Push notifications |
| | Email notifications |

**Recommendation:** Build notification dropdown in Navbar.

### 6.8 Landing Page Variants

**Status:** Multiple landing pages exist
**Files:** `LandingPage.jsx`, `HomePage.jsx`, `Home.jsx`

| Implemented | Not Implemented |
|-------------|-----------------|
| Multiple designs | A/B testing |
| Basic content | Unified design |
| | Analytics tracking |

**Recommendation:** Consolidate to single landing page or implement proper A/B testing.

---

## 7. Not Yet Developed Features

### 7.1 Real-Time Messaging

**Priority:** High
**Description:** In-app messaging between matched students and hosts

| Required Components |
|---------------------|
| Message thread UI |
| Supabase real-time subscriptions |
| Message notifications |
| Read receipts |
| File attachments |

**Estimated Effort:** 2-3 weeks

### 7.2 Push Notifications

**Priority:** High
**Description:** Browser and mobile push notifications

| Required Components |
|---------------------|
| Service worker setup |
| Notification permission handling |
| Push subscription management |
| Notification preferences UI |

**Estimated Effort:** 1-2 weeks

### 7.3 Email Notifications

**Priority:** High
**Description:** Transactional emails for key events

| Required Components |
|---------------------|
| Email service integration (SendGrid/Postmark) |
| Email templates |
| Preference management |
| Unsubscribe handling |

**Estimated Effort:** 1-2 weeks

### 7.4 Payment Integration

**Priority:** Medium
**Description:** Optional payment processing for premium features or deposits

| Required Components |
|---------------------|
| Payment gateway (Stripe) |
| Secure checkout flow |
| Payment history |
| Refund handling |

**Estimated Effort:** 2-3 weeks

### 7.5 Advanced Search & Filters

**Priority:** Medium
**Description:** Enhanced search capabilities for hosts/tasks

| Required Components |
|---------------------|
| Location-based search (maps integration) |
| Advanced filters (amenities, availability) |
| Saved searches |
| Search history |

**Estimated Effort:** 1-2 weeks

### 7.6 Calendar Integration

**Priority:** Medium
**Description:** Scheduling and availability management

| Required Components |
|---------------------|
| Availability calendar UI |
| Host availability settings |
| Student scheduling |
| Calendar sync (Google/Outlook) |

**Estimated Effort:** 2-3 weeks

### 7.7 Mobile App (Native)

**Priority:** Low
**Description:** Native mobile applications

| Required Components |
|---------------------|
| React Native setup |
| Platform-specific features |
| App store deployment |
| Push notification integration |

**Estimated Effort:** 8-12 weeks

### 7.8 Document OCR/Verification

**Priority:** Medium
**Description:** Automated document verification

| Required Components |
|---------------------|
| OCR service integration |
| Document validation rules |
| Fraud detection |
| Auto-approval workflow |

**Estimated Effort:** 3-4 weeks

### 7.9 Multi-Language Support

**Priority:** Low
**Description:** Internationalization (i18n)

| Required Components |
|---------------------|
| i18n library setup |
| Translation files |
| Language selector |
| RTL support |

**Estimated Effort:** 2-3 weeks

### 7.10 Two-Factor Authentication

**Priority:** Medium
**Description:** Enhanced security with 2FA

| Required Components |
|---------------------|
| TOTP implementation |
| SMS verification |
| Backup codes |
| Recovery flow |

**Estimated Effort:** 1-2 weeks

### 7.11 Social Login

**Priority:** Low
**Description:** OAuth login with social providers

| Required Components |
|---------------------|
| Google OAuth |
| Facebook OAuth |
| Account linking |
| Profile data mapping |

**Estimated Effort:** 1 week

### 7.12 Leaderboards

**Priority:** Low
**Description:** Public leaderboards for recognition

| Required Components |
|---------------------|
| Leaderboard UI |
| Ranking algorithm |
| Privacy controls |
| Time-based filters |

**Estimated Effort:** 1 week

### 7.13 Referral System

**Priority:** Low
**Description:** User referral program

| Required Components |
|---------------------|
| Referral code generation |
| Tracking & attribution |
| Reward system |
| Referral dashboard |

**Estimated Effort:** 1-2 weeks

### 7.14 Reporting & Analytics Dashboard

**Priority:** Medium
**Description:** Comprehensive analytics for admins

| Required Components |
|---------------------|
| Data visualization library |
| Custom report builder |
| Export functionality |
| Scheduled reports |

**Estimated Effort:** 2-3 weeks

### 7.15 API Documentation

**Priority:** Low
**Description:** Public API documentation

| Required Components |
|---------------------|
| OpenAPI/Swagger spec |
| API documentation site |
| Rate limiting |
| API keys management |

**Estimated Effort:** 1 week

---

## 8. Database Schema

### Core Tables

#### `user_profiles`
Primary user account table.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (matches auth.users) |
| `email` | TEXT | User email |
| `full_name` | TEXT | Display name |
| `phone_number` | TEXT | Contact number |
| `role` | TEXT | 'guest', 'host', or 'admin' |
| `is_verified` | BOOLEAN | Verification status |
| `is_active` | BOOLEAN | Account active status |
| `is_banned` | BOOLEAN | Ban status |
| `is_suspended` | BOOLEAN | Suspension status |
| `created_at` | TIMESTAMPTZ | Account creation date |
| `updated_at` | TIMESTAMPTZ | Last update date |

#### `guest_profiles`
Extended profile for students.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to user_profiles |
| `date_of_birth` | DATE | DOB (must be 18+) |
| `university` | TEXT | University name |
| `course` | TEXT | Course of study |
| `year_of_study` | INTEGER | Current year |
| `bio` | TEXT | Personal bio |
| `profile_picture_url` | TEXT | Avatar URL |
| `skills` | TEXT[] | Array of skills |
| `hours_per_week` | INTEGER | Available hours |
| `average_rating` | DECIMAL | Calculated rating |

#### `host_profiles`
Extended profile for hosts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to user_profiles |
| `address` | TEXT | Street address |
| `postcode` | TEXT | Postal code |
| `city` | TEXT | City name |
| `number_of_rooms` | INTEGER | Available rooms |
| `property_description` | TEXT | Property details |
| `amenities` | TEXT[] | Available amenities |
| `accessibility_features` | TEXT[] | Accessibility info |
| `profile_picture_url` | TEXT | Property/host image |
| `average_rating` | DECIMAL | Calculated rating |

#### `facilitation_requests`
Connection/matching requests.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `requester_id` | UUID | FK to user_profiles (student) |
| `target_id` | UUID | FK to user_profiles (host) |
| `status` | TEXT | 'pending', 'in_review', 'matched', 'completed', 'rejected' |
| `message` | TEXT | Introduction message |
| `created_at` | TIMESTAMPTZ | Request date |
| `matched_at` | TIMESTAMPTZ | Match confirmation date |

#### `host_tasks`
Task listings from hosts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `host_id` | UUID | FK to user_profiles |
| `title` | TEXT | Task title |
| `description` | TEXT | Detailed description |
| `services_needed` | TEXT[] | Required services |
| `hours_per_week` | INTEGER | Expected hours |
| `frequency` | TEXT | Task frequency |
| `duration` | TEXT | Expected duration |
| `compensation` | TEXT | Compensation details |
| `requirements` | TEXT | Requirements |
| `status` | TEXT | 'active', 'filled', 'closed' |

#### `monthly_feedback`
Monthly feedback submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `facilitation_id` | UUID | FK to facilitation_requests |
| `submitter_id` | UUID | FK to user_profiles |
| `recipient_id` | UUID | FK to user_profiles |
| `rating` | INTEGER | 1-5 star rating |
| `feedback_text` | TEXT | Written feedback |
| `hours_contributed` | INTEGER | Hours worked |
| `feedback_month` | DATE | Month of feedback |
| `created_at` | TIMESTAMPTZ | Submission date |

#### `platform_reviews`
Public platform reviews.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to user_profiles |
| `rating` | INTEGER | 1-5 star rating |
| `review_text` | TEXT | Review content |
| `is_anonymous` | BOOLEAN | Anonymous flag |
| `created_at` | TIMESTAMPTZ | Creation date |
| `updated_at` | TIMESTAMPTZ | Last update |

### Supporting Tables

- `user_documents` - Uploaded verification documents
- `saved_hosts` - Student's saved/favorited hosts
- `task_applications` - Task application records
- `termination_requests` - Arrangement termination requests
- `student_recognition_tiers` - Recognition tier tracking
- `deleted_reviews` - Audit trail for deleted reviews
- `notifications` - In-app notifications

---

## 9. Authentication & Authorization

### Authentication Flow

```
1. User visits signup page (Host or Student)
2. Fills registration form with role-specific fields
3. Account created in Supabase Auth + user_profiles
4. Email verification (if enabled)
5. User can login but has limited access
6. Admin verifies documents and approves
7. User gains full access to platform features
```

### Role-Based Access Control

| Role | Access Level | Key Permissions |
|------|--------------|-----------------|
| `guest` | Student features | Browse hosts, apply tasks, submit feedback |
| `host` | Host features | Create tasks, manage applications, rate students |
| `admin` | All features | User management, verification, moderation |

### Admin Permission System

```javascript
const ADMIN_PERMISSIONS = {
  super_admin: ['*'],  // All permissions
  admin: [
    'verify_documents',
    'approve_connections',
    'manage_users',
    'create_profiles',
    'view_reports',
    'moderate_content',
    'handle_disputes'
  ],
  moderator: [
    'moderate_content',
    'view_reports'
  ],
  support: [
    'view_reports',
    'handle_disputes'
  ]
};
```

### Verification States

| State | `is_verified` | `is_active` | Access |
|-------|---------------|-------------|--------|
| Pending | `false` | `true` | Limited (dashboard only) |
| Verified | `true` | `true` | Full access |
| Rejected | `false` | `false` | No access |
| Suspended | any | `true` + `is_suspended` | No access (temporary) |
| Banned | any | `true` + `is_banned` | No access (permanent) |

---

## 10. Routing Structure

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Landing page |
| `/host/login` | `HostLogin` | Host login |
| `/host/signup` | `HostSignup` | Host registration |
| `/student/login` | `StudentLogin` | Student login |
| `/student/signup` | `StudentSignup` | Student registration |
| `/admin/login` | `AdminLogin` | Admin login |
| `/help` | `Help` | Help center |
| `/faq` | `FAQ` | FAQ page |
| `/about` | `AboutUs` | About page |
| `/contact` | `ContactUs` | Contact form |
| `/terms` | `TermsAndConditions` | Terms |
| `/privacy` | `PrivacyPolicy` | Privacy policy |
| `/reviews` | `Reviews` | Platform reviews |
| `/knowledge-hub` | `KnowledgeHub` | Resources |

### Protected Host Routes

| Path | Component | Required Role | Requires Verification |
|------|-----------|---------------|----------------------|
| `/host/dashboard` | `HostDashboard` | `host` | No |
| `/host/settings` | `UserSettings` | `host` | No |
| `/host/create-task` | `CreateTask` | `host` | Yes |
| `/host/manage-tasks` | `ManageTasks` | `host` | Yes |
| `/host/edit-task/:taskId` | `CreateTask` | `host` | Yes |

### Protected Student Routes

| Path | Component | Required Role | Requires Verification |
|------|-----------|---------------|----------------------|
| `/student/dashboard` | `StudentDashboard` | `guest` | No |
| `/student/browse` | `BrowseHosts` | `guest` | Yes |
| `/student/saved-hosts` | `SavedHosts` | `guest` | Yes |
| `/student/browse-tasks` | `BrowseTasks` | `guest` | Yes |
| `/student/match/:id` | `MatchDetails` | `guest` | Yes |
| `/student/settings` | `UserSettings` | `guest` | No |
| `/student/applications` | `MyApplications` | `guest` | No |
| `/student/apply/:taskId` | `TaskApplication` | `guest` | Yes |

### Protected Admin Routes

| Path | Component | Required Permission |
|------|-----------|---------------------|
| `/admin/dashboard` | `AdminDashboard` | any |
| `/admin/users` | `AdminUserManagement` | `manage_users` |
| `/admin/facilitation-requests` | `AdminFacilitationRequests` | `manage_users` |
| `/admin/termination-requests` | `AdminTerminationRequests` | `manage_users` |
| `/admin/create-profile` | `AdminCreateProfile` | `create_profiles` |
| `/admin/reports` | `AdminReportsManagement` | `view_reports` |
| `/admin/disputes` | `AdminDisputes` | `manage_users` |
| `/admin/feedback` | `AdminFeedbackReview` | `view_reports` |
| `/admin/reviews` | `AdminReviewManagement` | `manage_users` |

---

## 11. Services Layer

### Service Files Overview

| Service | File | Purpose |
|---------|------|---------|
| **Auth Service** | `authService.js` | Authentication operations |
| **Profile Service** | `profileService.js` | User profile CRUD |
| **Document Service** | `documentService.js` | Document upload/verification |
| **Host Service** | `hostService.js` | Host operations, tasks |
| **Facilitation Service** | `facilitationService.js` | Connection/matching |
| **Feedback Service** | `feedbackService.js` | Monthly feedback |
| **Termination Service** | `terminationService.js` | End arrangements |
| **Recognition Service** | `recognitionService.js` | Tier tracking |
| **Saved Hosts Service** | `savedHostsService.js` | Favorites |
| **Dashboard Service** | `dashboardService.js` | Dashboard data |
| **Reviews Service** | `reviewsService.js` | Platform reviews |

### Key Service Methods

#### `authService.js`
- `signUp(email, password, metadata)` - Create account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `resetPassword(email)` - Password reset
- `updateUserMetadata(updates)` - Update auth metadata

#### `profileService.js`
- `getProfile(userId)` - Get user profile
- `createProfile(profileData)` - Create profile
- `updateProfile(userId, updates)` - Update profile
- `getGuestProfile(userId)` - Get student details
- `getHostProfile(userId)` - Get host details

#### `facilitationService.js`
- `createRequest(targetId, message)` - Send connection request
- `getRequestsForUser(userId)` - Get user's requests
- `getPendingRequests()` - Get pending for admin
- `updateRequestStatus(requestId, status)` - Approve/reject

#### `reviewsService.js`
- `createReview(reviewData)` - Create review
- `getAllReviews()` - Get all reviews
- `getTopReviews(limit)` - Get top-rated reviews
- `updateReview(reviewId, updates)` - Edit review
- `deleteReview(reviewId)` - Delete own review
- `getAverageRating()` - Platform average

---

## 12. Component Library

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `components/layout/Navbar.jsx` | Main navigation (role-aware, responsive) |
| `Footer` | `components/layout/Footer.jsx` | Site footer |
| `AppBar` | `containers/AppBar.jsx` | Alternative header |

### Route Protection

| Component | File | Purpose |
|-----------|------|---------|
| `ProtectedRoute` | `components/ProtectedRoute.jsx` | Role-based access |
| `ProtectedAdminRoute` | `components/ProtectedAdminRoute.jsx` | Admin permission check |
| `RequiresVerification` | `components/RequiresVerification.jsx` | Verification gate |

### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| `ConfirmationModal` | `components/ConfirmationModal.jsx` | Confirm dialogs |
| `RecognitionBadge` | `components/RecognitionBadge.jsx` | Tier badges |
| `VerificationStatusBanner` | `components/VerificationStatusBanner.jsx` | Status banner |
| `PhoneInput` | `components/PhoneInput.jsx` | Phone input with validation |
| `FileUpload` | `components/shared/FileUpload.jsx` | Document upload |
| `HelpOverlay` | `components/HelpOverlay.jsx` | Help overlay |
| `ErrorBoundary` | `components/ErrorBoundary.jsx` | Error handling |
| `ScrollToTop` | `components/ScrollToTop.jsx` | Route scroll reset |

---

## 13. Accessibility Features

### Implemented Features

#### Senior Mode
- Larger font sizes (1.2x-1.5x normal)
- Increased spacing and padding
- Simplified visual hierarchy
- Higher contrast elements

#### Color Blind Support
| Mode | Filter | Description |
|------|--------|-------------|
| Protanopia | SVG color matrix | Red-blind simulation |
| Deuteranopia | SVG color matrix | Green-blind simulation |
| Tritanopia | SVG color matrix | Blue-blind simulation |

#### Voice Guidance (Hook Available)
- `useVoiceGuidance()` hook for audio prompts
- Text-to-speech integration ready

#### Touch Accessibility
- Minimum 44px touch targets
- Enhanced button padding
- Mobile-optimized interactions

### Configuration

Settings stored in `user_profiles.accessibility_settings`:
```json
{
  "seniorMode": false,
  "voiceGuidance": false,
  "colorBlindMode": "none"
}
```

---

## 14. Environment Setup

### Required Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run linter
npm run lint
```

### Supabase Setup

1. Create Supabase project at supabase.com
2. Run database migrations from `database/migrations/`
3. Configure authentication providers
4. Set up Row Level Security (RLS) policies
5. Configure storage buckets for documents

---

## 15. Known Issues & Technical Debt

### Code Duplication

| Issue | Files Affected | Recommendation |
|-------|----------------|----------------|
| Multiple auth contexts | `AuthContext.jsx`, `AuthContextNew.jsx` | Consolidate to single context |
| Duplicate landing pages | `Home.jsx`, `HomePage.jsx`, `LandingPage.jsx` | Keep one, remove others |
| Duplicate navbar components | `layout/Navbar.jsx`, `shared/Navbar.jsx` | Consolidate |
| Multiple dashboard variants | `*Dashboard.jsx`, `*DashboardPage.jsx` | Standardize naming |

### Missing Error Handling

| Area | Issue | Impact |
|------|-------|--------|
| API calls | Some services lack try-catch | Unhandled promise rejections |
| Form submissions | Inconsistent error display | Poor UX on failures |
| Network errors | No offline handling | App breaks without internet |

### Performance Concerns

| Issue | Location | Recommendation |
|-------|----------|----------------|
| No code splitting | `App.jsx` | Implement React.lazy() |
| Large bundle size | All imports in main | Dynamic imports for routes |
| Missing memoization | List components | Add React.memo, useMemo |

### Security Considerations

| Area | Status | Recommendation |
|------|--------|----------------|
| Input sanitization | Partial | Add comprehensive XSS protection |
| Rate limiting | Not implemented | Add to API endpoints |
| CSRF protection | Via Supabase | Review token handling |
| Password strength | Basic | Enhance password requirements |

### Testing Coverage

| Area | Current | Target |
|------|---------|--------|
| Unit tests | Minimal | 70%+ coverage |
| Integration tests | None | Key flows covered |
| E2E tests | Playwright setup | Critical paths |

---

## Appendix A: File Index

### Pages (39 files)
```
src/pages/
├── AboutUs.jsx
├── AdminCreateProfile.jsx
├── AdminDashboard.jsx (alias)
├── AdminDashboardPage.jsx
├── AdminDisputes.jsx
├── AdminFacilitationRequests.jsx
├── AdminFeedbackReview.jsx
├── AdminLogin.jsx
├── AdminReportsManagement.jsx
├── AdminReviewManagement.jsx
├── AdminTerminationRequests.jsx
├── AdminUserManagement.jsx
├── AntiDiscriminationPolicy.jsx
├── BrowseHosts.jsx
├── BrowseTasks.jsx
├── ConnectionRequests.jsx
├── ContactUs.jsx
├── CreateTask.jsx
├── DisputeResolution.jsx
├── FAQ.jsx
├── FeedbackHistory.jsx
├── GuestDashboardPage.jsx
├── Help.jsx
├── Home.jsx
├── HomePage.jsx
├── HostDashboard.jsx
├── HostDashboardPage.jsx
├── HostLogin.jsx
├── HostSignup.jsx (missing - referenced)
├── KnowledgeHub.jsx
├── LandingPage.jsx
├── Login.jsx
├── ManageTasks.jsx
├── MatchDetails.jsx
├── MonthlyFeedbackForm.jsx
├── MonthlyReport.jsx
├── MyApplications.jsx
├── PrivacyPolicy.jsx
├── RateExperience.jsx
├── RecognitionStatus.jsx
├── Reviews.jsx
├── SavedHosts.jsx
├── Signup.jsx
├── StudentDashboard.jsx
├── StudentLogin.jsx
├── StudentSignup.jsx (missing - referenced)
├── TaskApplication.jsx
├── TermsAndConditions.jsx
├── UserSettings.jsx
└── auth/
    ├── SignIn.jsx
    └── SignUp.jsx
```

### Services (11 files)
```
src/services/
├── authService.js
├── dashboardService.js
├── documentService.js
├── facilitationService.js
├── feedbackService.js
├── hostService.js
├── profileService.js
├── recognitionService.js
├── reviewsService.js
├── savedHostsService.js
└── terminationService.js
```

### Components (25+ files)
```
src/components/
├── AddTodo.jsx
├── ConfirmationModal.jsx
├── ErrorBoundary.jsx
├── HelpOverlay.jsx
├── MyReviews.jsx
├── PhoneInput.jsx
├── ProtectedAdminRoute.jsx
├── ProtectedRoute.jsx
├── RecognitionBadge.jsx
├── RequiresVerification.jsx
├── ScrollToTop.jsx
├── Todo.jsx
├── Todos.jsx
├── VerificationStatusBanner.jsx
├── admin/
│   ├── AdminDashboard.jsx
│   ├── ManageRequests.jsx
│   └── VerifyDocuments.jsx
├── auth/
│   ├── AuthCallback.jsx
│   ├── LoginForm.jsx
│   ├── ProtectedRoute.jsx
│   └── SignupForm.jsx
├── guest/
│   ├── BrowseHosts.jsx
│   ├── GuestDashboard.jsx
│   └── GuestProfile.jsx
├── layout/
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── PhoneInput.jsx
└── shared/
    ├── FileUpload.jsx
    └── Navbar.jsx
```

---

## Appendix B: Database Migrations

### Available Migrations

| File | Purpose |
|------|---------|
| `create_deleted_reviews_table.sql` | Audit trail for deleted reviews |
| `add_deleted_reviews_table.sql` | Versioned migration |
| `create_monthly_feedback_system.sql` | Monthly feedback tables |

### Migration Execution

```sql
-- Run in Supabase SQL Editor in order
-- 1. Core tables (created via Supabase dashboard or initial setup)
-- 2. Monthly feedback system
-- 3. Deleted reviews audit table
```

---

## Appendix C: Color Scheme

### Primary Colors (Teal - Students)

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #f0fdf9 | Backgrounds |
| 100 | #ccfbef | Light accents |
| 500 | #14b8a6 | Primary buttons |
| 600 | #0d9488 | Primary brand |
| 700 | #0f766e | Hover states |

### Secondary Colors (Orange - Hosts)

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | #fff7ed | Backgrounds |
| 100 | #ffedd5 | Light accents |
| 500 | #f97316 | Primary buttons |
| 600 | #ea580c | Primary brand |
| 700 | #c2410c | Hover states |

---

*Document generated for Team 11 - Homestay Exchange App*
