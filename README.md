<!-- ========================================================= -->
<!-- 🏡 HOSTFAMILYSTAY – HOMESTAY EXCHANGE APP README -->
<!-- With blue & white banner, branding for Zach Mammadov / LSBU Team 11 -->
<!-- ========================================================= -->

<!-- PROJECT BANNER -->
<p align="center">
  <img src="A_digital_graphic_design_image_serves_as_a_banner_.png" alt="HostFamilyStay Banner" width="85%">
</p>

<h1 align="center">🏡 HostFamilyStay – Homestay Exchange App</h1>

<p align="center">
  <em>Connecting Students & Older Hosts Through Shared Living and Mutual Support</em>
</p>

<!-- NAVIGATION LINKS -->
<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-team-structure">Team</a> •
  <a href="#-setup--installation">Setup</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-demonstration">Demo</a> •
  <a href="#-license">License</a>
</p>

<!-- BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/Framework-Scrum-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%2FNext.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 📖 Overview
**HostFamilyStay** is a **social impact platform** that bridges two pressing social challenges:
- Increasing **student housing costs**
- Rising **loneliness among older adults**

The app connects **students** with **older hosts** who offer free or low-cost accommodation in exchange for companionship or help with daily tasks.

Developed collaboratively at **London South Bank University (LSBU)** as part of the:
- *ICT Project Management in Practice (CSI_6_ICT)*  
- *Law & Technology (LAW_6_LAT)*  

This project follows **Scrum Agile methodology**, incorporating **legal guidance**, **safeguarding**, and **accessible design** to ensure inclusivity and trust.

---

## 🚀 Key Features

### 👩‍💼 Help Request & Offer System
- Hosts post tasks such as companionship or light chores  
- Students browse listings and apply securely  

### 🔒 Safeguarding & Legal Guidance
- ID verification and utility bill upload for hosts  
- Built-in legal FAQs covering equality, safeguarding, and dispute resolution  

### 🧭 Accessibility & Usability
- Simple, elderly-friendly design with large buttons and intuitive UI  
- Cross-platform functionality (desktop, tablet, mobile)  

### 💬 Matching & Communication
- Smart matching based on preferences and location  
- Secure chat and optional 1–2 minute video introductions  

### 🌟 Well-being & Recognition
- Dual feedback and rating system for students and hosts  
- Bronze/Silver/Gold achievement system for student contributions  
- Optional host check-in reminders  

### 🏘️ Community Hub
- Legal rights and housing guidance resources  
- Volunteering and recognition links  

---

## 🧰 Tech Stack

| **Category** | **Technologies Used** |
|---------------|----------------------|
| **Frontend** | React / Next.js, Tailwind CSS |
| **Backend** | Node.js / Express |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT, bcrypt, ID Verification API |
| **Deployment** | Vercel (Frontend), Render / AWS (Backend) |
| **Version Control** | Git + GitHub |
| **Agile Tools** | Jira / Trello, GitHub Projects |
| **Communication** | Slack / Microsoft Teams |

---

## 🔄 Agile Process (Scrum)

Our team adopted **Scrum** to deliver the app iteratively with client collaboration and sprint reviews.

- **Framework:** Scrum  
- **Duration:** 8 Weeks (4 Sprints, 2 Weeks Each)  
- **Artifacts:** Product & Sprint Backlogs, Retrospectives, Burndown Charts  

Each sprint followed the cycle:
1. **Planning:** Define goals and assign backlog items  
2. **Development & Testing:** Build, review, and integrate  
3. **Review:** Present progress to client  
4. **Retrospective:** Reflect and improve team workflow  

---

## 👥 Team Structure

Our **Team 11 (LSBU)** blends expertise from **Computer Science** and **Law** disciplines.  
Each member’s role reflects their strengths and **Belbin Team Role** for effective collaboration.

| **Name** | **Roles** | **Skills** | **Belbin Role(s)** | **Notes** |
|-----------|------------|-------------|--------------------|------------|
| **Yameen Munir** | Scrum Master / Project Manager | Time Management, Conflict Resolution | Implementor, Complete Finisher, Specialist | The implementor ensures practical application of Scrum; the Complete Finisher guarantees meeting deadlines and conflict resolution. |
| **Zachary Mammadov & Atqa Manzoor** | Client / Product Owner | Providing requirements, feedback, and strategic direction | — | Providing requirements, feedback, and strategic direction throughout the development. |
| **Suhayb Munir** | Back-End Developer | API Integration, Server-Side Logic | Implementor, Complete Finisher | The implementor ensures that the data flow is converted into a structured and reliable backend. Complete Finisher ensures security checks and stability validation for API integration. |
| **Bisma Moon** | Front-End Developer | UI Implementation, Responsiveness | Team Worker, Resource Investigator | Resource Investigator identifies external design feedback and comes up with innovative solutions, speeding up Frontend development. Team Worker fosters both smooth integrations. |
| **Tobi** | Business Analyst | Requirement Analysis, Stakeholder Communication | Plant, Monitor Evaluator | Aligning stakeholder needs with technical scope. The plant role supports problem-solving, while the Monitor evaluator ensures critical analysis. |
| **Tawhidur Rahman Nabin** | UI/UX Designer | User-Centred Design, Prototyping | Specialist, Plant | Specialist designs the user interfaces, prioritising accessibility and iterates based on user feedback. Plant drives the imaginative iteration based on Client/User feedback. |
| **Samiul Hoque / Nabilul Haque** | Tester / Quality Assurance | Validation, Bug Checking | Complete Finisher, Implementor | Complete finisher validates the product quality, spotting errors, and supporting backlog organisation thanks to his attention to detail. The implementor ensures backlog organisation. |

---

## 🧪 Setup & Installation

```bash
# Clone repository
git clone https://github.com/yourusername/hostfamilystay.git

# Navigate into project folder
cd hostfamilystay

# Install dependencies
npm install

# Run development server
npm run dev
