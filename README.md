# 🏆 ISTE Awards Portal

A modern, secure, and efficient web portal to manage ISTE Awards submissions and admin evaluations. Built with Next.js 15 (App Router), Supabase, Cloudinary, and NextAuth.js.

---

## ✨ Key Features

### 🧑‍💻 For Award Applicants:
- 🔐 Secure Sign-up / Sign-in (Life Membership No. + Email verification)
- 📄 16 award-specific dynamic forms with validations
- 📤 Upload documents (PDFs, Certificates) to Cloudinary
- 📎 Auto-generated Registration Slip (PDF format)
- ✉️ Email confirmation of submission with attached slip
- 🔁 Prevent duplicate entries via unique Email/Life Membership No.

### 👩‍💼 For ISTE Admins:
- 🔐 Dedicated Admin Login via `/admin/login` (restricted access)
- 🖥️ Admin Dashboard to:
  - View and filter all submissions
  - Preview uploaded PDFs
  - Print or export submission slips
  - Perform CRUD operations on submissions
  - Export data in CSV/Excel

---

## 🛠️ Tech Stack

| Area                 | Tech / Library                      |
|----------------------|--------------------------------------|
| Frontend Framework   | [Next.js 15](https://nextjs.org/) (App Router) |
| Language             | JavaScript                          |
| Forms & State        | React `useState` / `useEffect`      |
| Authentication       | [NextAuth.js](https://next-auth.js.org/) |
| Database             | [Supabase](https://supabase.com/)   |
| File Storage         | [Cloudinary](https://cloudinary.com/) |
| PDF Generation       | [`pdf-lib`](https://pdf-lib.js.org/) (or jsPDF later) |
| Email Service        | [EmailJS](https://www.emailjs.com/) |

---

## 🔐 User Roles & Authentication Flow

### 1. Applicant
- Sign-up with:
  - Life Membership Number
  - Email (with verification)
  - Password & Confirm Password
- Role: `user`
- Access: `/dashboard` to fill and submit award forms

### 2. Admin
- Dedicated route: `/admin/login`
- Role: `admin` (defined via Supabase role field)
- Access: `/admin` dashboard with restricted features

---
## 🔃 Functional Workflow

### Applicant Side:
1. Registers → Verifies Email
2. Logs in → Sees dashboard
3. Fills specific award form
4. Uploads required documents
5. Submits → PDF slip is generated & emailed
6. Cannot resubmit using same email/Life Membership No.

### Admin Side:
1. Logs into `/admin/login`
2. Accesses dashboard
3. Filters, views, and manages submissions
4. Downloads PDFs / CSV / slips
5. Edits or deletes if needed

Maintained by [ISTE Gujarat Web Team]

For queries, contact: `support@iste.org.in`
