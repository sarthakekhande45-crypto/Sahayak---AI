# SAHAYAK — AI-Powered Mental Wellness Platform
> *“Your feelings deserve a safe space.”*

SAHAYAK is a privacy-aware mental wellness platform engineered for college students. It enables students to track their emotional wellness, journal privately, observe gradual mood pattern changes (such as drift during exam seasons), and receive compassionate guidance from campus mentors — **without automatically disclosing their private journal entries or personal identities**.

Built for hackathons and educational demonstrations, SAHAYAK illustrates the paradigm of **sensitive-data minimization and contextual theme extraction** versus naive keyword filtering or invasive surveillance.

---

## 🌟 Key Application Surfaces

### 1. Student Dashboard & 14-Day Wellness Curve
- **Daily Mood Check-In:** 5-point discrete baseline (`Very low`, `Low`, `Okay`, `Good`, `Great`) paired with granular emotion tags (`Stressed`, `Calm`, `Anxious`, `Motivated`, `Tired`, `Hopeful`, `Overwhelmed`, `Happy`) and optional notes.
- **14-Day Interactive Line Graph:** Built with [Recharts](https://recharts.org/), featuring 7-day and 14-day filters, customizable tooltips, and self-reported baseline annotations. Updates immediately upon saving.
- **Organic Growth Tree:** An interactive visual SVG tree that blossoms with new leaves as students complete voluntary check-ins. Designed intentionally with **zero streak guilt or penalties**.
- **Mindful 4-4-4 Box Breathing:** Interactive calming breathing exercise with animated guide for pre-exam anxiety.
- **Drift Detected Alert:** Gently flags meaningful shifts between early (e.g. 4.0/5.0) and recent (2.1/5.0) check-ins without alarming alarms or clinical pathologizing.
- **Recent Private Reflections & Mentor Support:** Lists local private entries and received mentor check-in notes with in-app reply controls.

### 2. Private AI Journalling & Reflection Companion
- **Local Private Storage:** Journal drafts and history are stored directly on the student's device. Mentors never receive raw diary prose.
- **Dedicated AI Service Layer:** Provides clean provider abstraction between **AI Mode** (using Google Gemini 3.8 Flash via `@google/genai` server-side) and **Demo Mode** (using transparent local deterministic NLP analysis). Operates fully without API credentials.
- **Contextual Reflection Analyzer (`POST /api/analyze-reflection`):** Accepts synthetic student reflections and returns structured JSON conforming strictly to schema:
  - `possibleMood`: Estimated emotional mood category (e.g. Stressed, Calm, Overwhelmed).
  - `themes`: General student themes (e.g. Academic Workload, Sleep, Peer Balance).
  - `possibleStressIndicators`: Observed non-clinical cues.
  - `summary`: Neutral 1-2 sentence pattern summary without leaking raw diary sentences.
  - `reflectionSuggestion`: Gentle, low-risk self-reflection question.
  - `uncertaintyNote`: Clarifies: *"This is an AI-generated interpretation, not a diagnosis."*
- **Privacy-Aware Summary Generation (`POST /api/privacy-summary`):** Dedicated redaction and abstraction pipeline:
  - Identifies and scrubs PII (names, emails, student IDs, phone numbers, course codes, dorm rooms) replacing them with `[REDACTED: ...]` tokens.
  - Produces a **Mentor-Safe Briefing** rewritten in neutral third person with zero student sentences.
  - Suggests proactive, empathetic mentor outreach prompts.
- **Reflection Companion (`POST /api/chat-companion`):** Conversational reflection assistant that maintains session context, responds with warmth and zero judgment, offers practical low-risk exercises (Box Breathing, 5-4-3-2-1 Sensory Grounding, 10-Minute Worry Delay), and includes instant clear session controls.
- **Data Portability:** Complete export of personal reflection logs in standard JSON format and one-click erasure controls.

### 3. Mentor Wellbeing Overview
- **Anonymous Cohort Directory:** Displays student profiles as shielded tokens (`Student #01` through `Student #05`) with trend statuses (`Stable pattern`, `Pattern changed`, `Check-in may be helpful`).
- **Live Search & Filter:** Filter cohort by stability status or search by anonymous token ID.
- **Zero Raw Diary Access:** Mentor drawer payload only receives high-level themes and suggested actions. Raw diary entries are strictly excluded.
- **Supportive Care Messaging:** Mentors can send non-intrusive check-in notes (with quick empathetic templates) that appear directly on the student's dashboard.
- **Revocable Consent Demonstrator:** Illustrates the cryptographic workflow required before an anonymous identifier can be unmasked.

### 4. Showcase Innovation Lab (Hackathon Center)
- **Experiment A (Compare Lab):** Direct side-by-side contrast between naive keyword detection and contextual theme extraction using custom user inputs or judge presets (including negation tests).
- **Experiment B (Privacy Proof):** 3-stage animated transformation illustrating the boundary between the student's private diary and the mentor's sanitized insight payload. Includes live JSON payload diff inspection.

### 5. Authentication & Role Selection
- Persona switcher between **Alex Sharma (Student)** and **Dr. Meera Rao (Campus Mentor)**.
- Permissions and boundary restrictions breakdown, demonstrating the distinction between client-side role toggling and backend zero-trust RBAC.

### 6. Privacy Charter & Safety Guidelines
- Discloses the technical distinction between client-side demo prototypes and production zero-trust architecture.
- Prominently displays 24/7 emergency crisis hotlines:
  - **India:** Tele-MANAS `14416`, KIRAN `1800-599-0019` (24/7 Toll-Free)
  - **US & Canada:** Dial or Text `988` (Suicide & Crisis Lifeline)
  - **UK & Europe:** NHS `111` / Shout `85258` / Emergency `999` or `112`

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Recharts 3.x, Canvas-Confetti
- **Backend:** Node.js, Express, `tsx`
- **AI & Reasoning:** Google Gemini API (`@google/genai` with model `gemini-3.8-flash`) via secure server-side proxy
- **Demo Mode:** Fully functional offline or without API keys via transparent deterministic NLP rules

---

## 🔑 Environment Variables

The project uses the following environment variables (defined in `.env.example`):

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | API key for Gemini 3.8 Flash model. If omitted, app operates in demo mode. | `""` |
| `PORT` | Optional | Port for the Express server to listen on. | `3000` |
| `NODE_ENV` | Optional | Runtime mode (`development` or `production`). | `development` |
| `APP_URL` | Optional | Base URL of the deployment. | `http://localhost:3000` |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 20+ installed
- npm or bun

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/sahayak-wellness.git
cd sahayak-wellness
npm install
```

### 2. Environment Setup (Optional)
```bash
cp .env.example .env
```
To enable real-time Gemini AI analysis, set your Gemini API key in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
```
*(If left blank, SAHAYAK runs in Demo Mode with transparent deterministic theme extraction—no payment or API key required).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New Project** and import your repository.
3. **Framework Preset:** `Vite`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:**
   - Add `GEMINI_API_KEY` (Optional; if omitted, the app gracefully falls back to deterministic client-side demo analysis).
7. Click **Deploy**.

---

## 🧭 Hackathon Guided Demo Walkthrough

Judges and evaluators can click **"Start Guided Demo"** in the top navigation bar to launch an interactive 6-step tour:
1. **Student Mood Check-In:** Save a daily mood and watch the 14-day graph and Growth Tree blossom.
2. **AI Journalling:** Write a reflection and trigger contextual theme analysis.
3. **Mentor Overview:** Find Student #03 with the "Pattern changed" status.
4. **Supportive Messaging:** Send an empathetic check-in note from mentor to student.
5. **Showcase Lab:** Test Experiment A (Keyword vs Contextual) and Experiment B (Privacy Proof).
6. **Privacy Charter:** Inspect the technical distinction between demo prototypes and production privacy standards.

---

## ⚖️ Important Educational Prototype Notice
SAHAYAK is an educational concept prototype created to research privacy-preserving human-computer interaction in mental health contexts. AI-generated mood summaries and theme extractions are statistical estimates and do not represent psychological diagnosis, therapy, or crisis emergency care.
