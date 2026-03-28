# DomServices v2 – Technical Plan

**Document version:** 1.0  
**Date:** 26. februar 2025  
**Status:** Draft – awaiting feedback before implementation

---

## 1. Executive Summary

This technical plan outlines how to build **DomServices**, an AI-powered marketplace for home services (repairs, cleaning, lawn care) in Slovenia. It synthesises:

- Product documentation from `/docs/`
- UI designs from **Stitch project "DomServices verzija 2"**
- MVP scope and tech choices from the business plan

---

## 2. Verification Checklist

| Item | Status |
|------|--------|
| **Stitch MCP connection** | ✅ Connected via `user-stitch` |
| **Stitch project** | ✅ "DomServices verzija 2" (ID: `3749851244900642130`) |
| **Documentation review** | ✅ All `/docs/` files analysed |
| **Plan drafted** | ✅ This document |

---

## 3. Product Overview (from `/docs/`)

### 3.1 Vision

**DomServices** is a web application that connects homeowners with local service providers (plumbers, electricians, cleaners, gardeners) offering:

- **Central marketplace** – all providers in one place
- **Real-time availability** – live calendar visibility
- **AI search** – natural-language problem description → matching providers
- **Verified reviews** – trust through verified ratings
- **Integrated payments (Stripe)** – card payments, escrow until work approval
- **In-app chat** – secure messaging without sharing phone numbers

### 3.2 Target Users

- **Primary:** Homeowners (25–65) in Slovenia
- **Secondary:** Independent service providers (plumbers, electricians, cleaners, etc.)
- **Tertiary:** Property managers, real estate agents

### 3.3 MVP User Stories (Must Have)

1. **Hitro opisovanje problema** – Describe problem in natural language (AI search)
2. **Prikaz samo preverjenih ponudnikov** – Filter by verified providers
3. **Razpoložljivost v realnem času** – Real-time availability / calendar
4. **Transparentna cena vnaprej** – Price visible before booking
5. **Pregled ocen in mnenj** – Reviews and ratings
6. **Varno plačilo s kartico** – Secure card payment
7. **Escrow – denar zadržan do potrditve** – Money held until work confirmed
8. **Obvestila o statusu naročila** – Order status notifications
9. **Vgrajen chat s ponudnikom** – In-app chat with provider
10. **Centralizirani leadi za ponudnika** – Centralised leads for providers
11. **Upravljanje urnika ponudnika** – Provider schedule management

---

## 4. Stitch UI Design Reference

### 4.1 Project Details

| Property | Value |
|----------|-------|
| **Project name** | DomServices verzija 2 |
| **Project ID** | `3749851244900642130` |
| **Device type** | Desktop |
| **Origin** | Stitch (TEXT_TO_UI_PRO) |

### 4.2 Design Theme (from Stitch)

| Property | Value |
|----------|-------|
| **Color mode** | Light |
| **Font** | Inter |
| **Roundness** | ROUND_EIGHT |
| **Primary color** | `#1d283a` |
| **Saturation** | 2 |

**Implementation note:** Use these values for Tailwind / CSS variables to match the Stitch design.

### 4.3 Screen Inventory (22 screens)

| # | Screen Title (Slovenian) | Purpose / Role |
|---|--------------------------|----------------|
| 1 | **Izbira vloge (Stranka ali Ponudnik)** | Role selection (Customer vs Provider) |
| 2 | **Prijava za stranke** | Customer login |
| 3 | **Registracija za stranke** | Customer registration |
| 4 | **Prijava za ponudnike** | Provider login |
| 5 | **Registracija za ponudnike** | Provider registration |
| 6 | **Pristajalna stran in AI iskanje** | Landing page + AI search input |
| 7 | **Rezultati iskanja - Preverjeni izvajalci** | Search results (verified providers) |
| 8 | **Profil izvajalca in koledar** | Provider profile + availability calendar |
| 9 | **Rezervacija in depozitno plačilo** | Booking + deposit payment |
| 10 | **Potrditev plačila in depozita** | Payment & deposit confirmation |
| 11 | **Pregled naročila (Stranka)** | Order overview (Customer) |
| 12 | **Moja naročila (Stranka)** | My orders (Customer) |
| 13 | **Status naročila in sledenje** | Order status and tracking |
| 14 | **Varni klepet v aplikaciji** | Secure in-app chat |
| 15 | **Oddaja ocene po končanem delu** | Submit review after completed work |
| 16 | **Potrditev oddaje ocene** | Review submission confirmation |
| 17 | **Preklic naročila** | Order cancellation |
| 18 | **Portal za izvajalce** | Provider portal (entry) |
| 19 | **Nadzorna plošča izvajalca** | Provider dashboard |
| 20 | **Podrobnosti dela (Ponudnik)** | Job details (Provider) |

**Note:** Some screens may be hidden variants in Stitch; only visible ones are listed above. HTML and screenshot URLs for each screen are available via Stitch MCP (`get_screen`).

---

## 5. Technology Stack (from `/docs/`)

### 5.1 Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js** | SSR, routing, API routes |
| **Tailwind CSS** | Responsive styling |
| **TanStack Query (React Query)** | Server state, caching |

### 5.2 Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | API server (or Next.js API routes) |
| **Socket.io** | Real-time (notifications, chat, live calendar) |

### 5.3 Data & Auth

| Technology | Purpose |
|------------|---------|
| **Firebase Realtime Database** | Real-time data sync |
| **Firebase Authentication** | Auth (Google, Facebook, email) |

### 5.4 AI & Integrations

| Technology | Purpose |
|------------|---------|
| **Perplexity PRO API** | AI understanding of problem descriptions → matching providers |
| **Stripe** | Payment Intent, Connect (payouts), Webhooks |

### 5.5 Hosting & Assets

| Technology | Purpose |
|------------|---------|
| **Vercel** | Next.js hosting + serverless |
| **Cloudinary** | Images (profiles, galleries) |
| **GitHub** | Version control, CI/CD |

### 5.6 Notifications

- **Web Push** (Push API + Notifications API)
- **Email** (Sendgrid / Mailgun / Brevo)
- **SMS** (optional, premium – Infobip, GatewayAPI)

---

## 6. Proposed Application Architecture

### 6.1 High-Level Structure

```
DomServicesV2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes (login, register, role select)
│   │   ├── (customer)/         # Customer-facing routes
│   │   ├── (provider)/         # Provider-facing routes
│   │   └── api/                # API routes
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utilities, Firebase, Stripe, Perplexity
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── public/
├── docs/                       # Product documentation (existing)
├── .env.local                  # Environment variables (not committed)
└── technical-plan.md           # This file
```

### 6.2 Data Model (Firebase)

- **users** – customer & provider profiles
- **providers** – extended provider data (services, pricing, calendar)
- **orders** – booking lifecycle
- **chats** – messages between customer & provider
- **reviews** – ratings and comments
- **availability** – provider calendar slots (real-time)

### 6.3 Key Flows

1. **Customer flow:** Role select → Login/Register → AI search → Results → Provider profile → Book + pay → Order tracking → Chat → Review
2. **Provider flow:** Role select → Login/Register → Dashboard → Job details → Accept/Reject → Manage calendar → Receive payments

---

## 7. Build Phases (Recommended Order)

### Phase 1: Foundation (Week 1–2)

- [ ] Project setup (Next.js 14+, Tailwind, TypeScript)
- [ ] Firebase init (Auth + Realtime Database)
- [ ] Design system from Stitch (colors, typography, roundness)
- [ ] Role selection + Auth screens (login, register for both roles)
- [ ] Basic routing and layout

### Phase 2: Core Customer Experience (Week 3–4)

- [ ] Landing page + AI search input (Perplexity integration)
- [ ] Search results page (verified providers)
- [ ] Provider profile + calendar (availability display)
- [ ] Booking flow UI (reservation + deposit)
- [ ] Stripe Payment Intent + escrow logic

### Phase 3: Order Management & Chat (Week 5–6)

- [ ] Order overview (customer)
- [ ] My orders list
- [ ] Order status & tracking
- [ ] In-app chat (Socket.io or Firebase)
- [ ] Order cancellation

### Phase 4: Provider Experience (Week 7–8)

- [ ] Provider portal + dashboard
- [ ] Job details (provider view)
- [ ] Provider calendar management
- [ ] Accept/Reject jobs
- [ ] Stripe Connect (payouts)

### Phase 5: Reviews & Polish (Week 9–10)

- [ ] Review submission after completion
- [ ] Notification system (push, email)
- [ ] Responsive and accessibility polish
- [ ] Performance and SEO

---

## 8. Stitch UI Usage During Build

- **HTML export:** Each Stitch screen has an `htmlCode.downloadUrl`. During implementation, fetch these to extract layout and structure.
- **Screenshots:** Use `screenshot.downloadUrl` for visual reference and design QA.
- **Design tokens:** Apply `designTheme` (color, font, roundness) in Tailwind config.

**MCP tools to use:**

- `list_screens` – list all screens for a project
- `get_screen` – get screen details (HTML, screenshot) by `name` (e.g. `projects/3749851244900642130/screens/946b3086339543509230fbbbcf751b1b`)

---

## 9. Environment Variables (Required)

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=

# Perplexity AI
PERPLEXITY_API_KEY=
PERPLEXITY_API_URL=

# Optional: Email / SMS
SENDGRID_API_KEY=
# SMS_GATEWAY_API_KEY=
```

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Perplexity API cost/limits | Start with mock responses; add rate limiting and caching |
| Firebase Realtime DB scale | Plan for Firestore if scale exceeds Realtime DB limits |
| Stripe Connect complexity | Start with simple Payment Intent; add Connect in Phase 4 |
| Real-time sync latency | Use Firebase listeners; consider optimistic updates |
| Bilingual (Slovenian/English) | Use i18n from start; all UI strings in translation files |

---

## 11. Next Steps

1. **Review this plan** – add comments, corrections, or priorities.
2. **Confirm Stitch usage** – confirm we use "DomServices verzija 2" as the sole UI reference.
3. **Approve build phases** – adjust order or scope if needed.
4. **Start implementation** – begin with Phase 1 once plan is approved.

---

## Appendix A: Stitch Project Reference

- **Project ID:** `3749851244900642130`
- **Full name:** `projects/3749851244900642130`
- **MCP server:** `user-stitch` (Stitch API key configured via Cursor)
