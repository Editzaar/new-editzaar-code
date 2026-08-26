# 🌟 Editzaar Codebase & Architecture Guide

Welcome to the **Editzaar** codebase! This guide is designed so that anyone (a new developer, designer, or agency manager) can easily understand the project structure, locate files, and update services, prices, designs, or features in seconds with zero confusion.

---

## 📁 Clean & Organized Folder Structure

```
new-editzaar-code/
├── index.html            👉 Main Homepage (Hero split-screen reels, testimonials, stats, WhatsApp booking)
├── services.html         👉 Services & Deliverables Catalog (Detailed breakdown of editing, web & ads)
├── pricing.html          👉 Interactive Pricing & Checkout (Dynamic package selector, Luxury Design 2 UPI QR, live coupons)
├── work.html             👉 Portfolio & Showcase (9:16 vertical phone reels, 16:9 widescreen videos, web projects)
│
├── css/
│   ├── style.css         👉 Master Website Design System (Dark/Light mode, luxury gold typography, animations)
│   └── vfx.css           👉 Visual Effects & Motion Styles
│
├── js/
│   ├── main.js           👉 Master Interactive Controller (Checkout modal engine, mobile navigation, typing effect)
│   ├── services-config.js👉 SINGLE SOURCE OF TRUTH for all Services, Live Prices & Dynamic Coupons
│   ├── nav-auth.js       👉 Universal Firebase Auth Header & Real-time Coupon Firestore Validator
│   ├── theme.js          👉 Universal Dark / Light Mode Switcher (Preserved in localStorage)
│   └── vfx.js            👉 Ambient Cursor & Particle Effects
│
├── media/                👉 Static Assets (Brand logo, showcase demo videos, favicon)
│   ├── fav-logo.png
│   └── video1.mp4, etc.
│
├── dashboard/            👉 Client, Editor & Admin Workspaces
│   ├── index.html        👉 Unified Login & Sign-up Portal (Role-based auto-redirection)
│   ├── client.html       👉 Client Portal (17 sections, project tracking pipeline, chat, Book New Project modal)
│   ├── editor.html       👉 Editor Workspace (Assigned projects, deadline changer, delivery upload, client chat)
│   ├── admin.html        👉 Agency Master Admin Dashboard (Kanban workflow, CRM, Revenue, Live Pricing & Coupon Manager)
│   └── css/
│       └── dashboard.css 👉 Dashboard Design System & Mobile Bottom Navigation
│
├── firebase.json         👉 Firebase Hosting & Routing Rules
├── firestore.rules       👉 Firebase Cloud Firestore Security Rules
├── sitemap.xml           👉 Search Engine Optimization Sitemap
├── robots.txt            👉 Search Engine Crawling Instructions
└── CNAME                 👉 Custom Domain Configuration (editzaar.in)
```

---

## 🛠️ How to Update Common Things

### 1. 💰 Updating Prices or Turnaround Times
- **Method A (No Coding - Instant Admin Control)**:
  1. Open [`dashboard/admin.html`](file:///dashboard/admin.html) and go to **Services & Pricing** (`sec-services`).
  2. Click on any price or turnaround time to edit it directly on screen.
  3. All changes propagate across the entire website instantly!
- **Method B (Code File)**:
  - Open [`js/services-config.js`](file:///js/services-config.js) and update the `DEFAULT_SERVICES` list.

### 2. 🎟️ Creating or Deleting Coupons
- **Method A (Instant Admin Manager)**:
  1. Open [`dashboard/admin.html`](file:///dashboard/admin.html) and go to **Coupons** (`sec-coupons`).
  2. Enter the Coupon Code (e.g. `SUMMER30`), Discount Type (`%` or `₹`), Discount Value (`30`), and Max Uses (`100`), then click **Publish Coupon**.
  3. It syncs to Firebase Firestore cloud in real time!
- **Method B (Code File)**:
  - Open [`js/services-config.js`](file:///js/services-config.js) and update the `DEFAULT_COUPONS` list.

### 3. 💳 Updating UPI Payment Details
- To update the UPI ID, open:
  1. [`js/services-config.js`](file:///js/services-config.js) (`UPI_ID = "nbikram704@okhdfcbank"`)
  2. [`js/main.js`](file:///js/main.js) (Search for `nbikram704@okhdfcbank`)
  3. [`dashboard/client.html`](file:///dashboard/client.html) & [`pricing.html`](file:///pricing.html)

### 4. 🎨 Changing Colors or Typography
- Open [`css/style.css`](file:///css/style.css) or [`dashboard/css/dashboard.css`](file:///dashboard/css/dashboard.css):
  - `--gold`: `#FFB800` (Luxury Gold Accent)
  - `--font-h`: `'Cormorant Garamond', serif` (Luxury Headlines)
  - `--font-b`: `'Outfit', sans-serif` (Clean Modern Body Font)

---

## 🚀 Running Locally & Deploying
- **Test Locally**: `python -m http.server 8080` (Open `http://localhost:8080`)
- **Deploy Live to Production**: `git push origin main` (Changes go live instantly on `https://editzaar.in`!)
