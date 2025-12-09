# 💊 HealthVerse: AI-Powered Medication Management Platform

[![Tech Stack: Next.js & MongoDB](https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20MongoDB-blue.svg)](https://nextjs.org/)
[![AI Integration: Gemini](https://img.shields.io/badge/AI%20Chatbot-Gemini%20API-orange.svg)](https://ai.google.com/gemini/)
![Homepage](/assets/homepage.png)
A comprehensive health management platform designed to improve patient adherence to medication schedules using smart notifications, predictive AI, and centralized caregiver monitoring.

***

## 1. Project Overview 🌟

We are building a comprehensive health management platform that acts as a **digital companion for patients (Rangers)**. The system logs medication usage, sends intelligent alerts via mobile notifications, predicts missed doses using AI, and provides a centralized dashboard (**Morpher Panel**) for caregivers and doctors to monitor vitals, sync with personal calendars, and connect patients with medical support.

***

## 2. Problem Statement (PS Number):11

Patients frequently miss essential medication doses due to busy schedules, leading to reduced treatment effectiveness and potential health complications. There is currently no dedicated system for doctors and caregivers to monitor medication adherence, predict missed doses, or track symptoms in real-time, risking patient well-being and recovery.

***

## 3. Features Implemented ✨

| Category | Feature Name | Description |
| :--- | :--- | :--- |
| **Medication Management** | **Ranger Power Capsule Management** | Complete logging system to schedule doses, mark taken/missed, and maintain a full history of adherence. |
| **Notifications** | **Dose Reminder Engine** | Automated, timely alerts for upcoming and missed doses sent to users, including snooze functionality via `cron.js`. |
| **Intelligence** | **Missed Dose Prediction Model (AI)** | Analyzes patient habits and adherence history to forecast skipped doses and issue proactive, early warnings. |
| **Monitoring** | **Health Dashboard (Morpher Panel)** | Visual display of adherence scores, missed streaks, and overall wellness for patients and caregivers. |
| **Access Control** | **Multi-Role Access** | Distinct, secure interfaces tailored for Rangers (Patients)and Doctors|
| **Support** | **AI Chatbot Health Assistant** | Intelligent assistant powered by the **GEMINI API** to answer general health queries and provide specific capsule (medication) explanations. |
| **Utility** | **Search Bar & Chat Integration** | Robust search functionality for users to filter doctor data and real-time chat for communication. |

***

## 4. Tech Stack Used 💻

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** (React) | Building fast, responsive user interfaces. |
| **Backend** | **Next.js** (API Routes) | Unified full-stack development, authentication, and core business logic. |
| **Database** | **MongoDB** | Flexible, scalable NoSQL database for all application data. |
| **AI/ML** | **GEMINI API** | Powering the contextual AI Chatbot Health Assistant. |
| **Notifications** | **`cron.js`** | Scheduling and managing recurring background jobs for dose reminder alerts. |
| **Authentication** | **Google OAuth, Token-based** | Secure user authentication and authorization. |
| **Prediction** | **Python** (ML Libraries - Inferred) | Developing and serving the Missed Dose Prediction Model. |

***

## 5. System Architecture / High-level design 📐

The application follows a **Serverless Monolithic Architecture** utilizing Next.js, where the frontend and API routes are co-located. The architecture separates persistent data (MongoDB) from business logic (Next.js API routes) and integrates dedicated external services for real-time intelligence and scheduling.

* **Next.js:** Acts as the unified server, managing API endpoints, rendering the UI, and applying role-based authentication middleware.
* **MongoDB:** Stores all patient data, medication schedules, and historical adherence logs.
* **External Integration:** The system connects to the **GEMINI API** for the chatbot and uses a server-side `cron.js` scheduler for automated alerts.



***

## 6. API Documentation 📄

The core functionality is exposed via internal Next.js API Routes, secured using **token-based authentication** and **role-based access control** middleware.

| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/api/auth/login`, `/api/auth/signup` | `POST` | User authentication and token issuance (includes Google Auth flow). | All |
| `/api/dashboard` | `POST`/`GET` | Add a new medication schedule or fetch the current schedule/history. | Ranger |
| `/api/dashboard/medicine/[id]` | `PUT` | Mark a specific dose as 'taken' or 'missed'. | Ranger |
| `/api/predict/missed` | `POST` | Endpoint to trigger or fetch results from the ML prediction model. | Ranger/Doctor |
| `/api/chat` | `POST` | Send queries to the GEMINI-powered health assistant. | All |

***

## 7. Setup Instructions (How to run the project locally) ⚙️

Follow these steps to set up and run the HealthVerse project on your local machine.

### Prerequisites

* Node.js (v18+)
* npm or yarn
* A running **MongoDB** instance (local or cloud-hosted)
* A **Google AI Studio API Key** (for GEMINI)

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/himanshi20004/Healthcare-Website.git](https://github.com/himanshi20004/Healthcare-Website.git)
    cd Healthcare-Website
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env.local` in the root directory and add the following variables:
    ```
    # Database Configuration
    MONGO_URI="YOUR_MONGODB_CONNECTION_STRING" 
    
    # NextAuth Configuration
    NEXTAUTH_SECRET="A_LONG_RANDOM_STRING_HERE_FOR_SECURITY"
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_AUTH_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_AUTH_CLIENT_SECRET"
    
    # GEMINI API Key
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY" 
    
    # Optional: Internal Server Host for cron jobs
    APP_HOST=http://localhost:3000
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  **Access the Application:**
    Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

***

## 8. Deployment Link 🔗

The project is currently deployed and accessible at:

[HealthVerse Live Demo](https://healthverse-prod-deploy.vercel.app) (***Please update this link after deployment***)

***

## 9. Screenshots / GIFs of working features 🖼️

| Screenshot/GIF Heading (Placeholder) |
| :--- |
| **Main Homepage: An Overview of HealthVerse** |
| **Signup/Login: Token-Based and Google Auth Flow** |
| **Ranger Dashboard: Adherence Score and Dose History** |
| **Doctor Dashboard: Patient Monitoring and Search Filter** |
| **AI Assistant: Interacting with the GEMINI Chatbot** |
| **Chat Feature: Real-time Messaging Integration** |
| **Medication Scheduling & Dose Logging Interface** |

***

## 10. Error Handling & Reliability Considerations 🛡️

To ensure the system's reliability, especially for health-critical functions:

* **Database Resilience:** Implemented robust connection pooling and retry logic for **MongoDB** operations to handle transient connection failures.
* **API Security:** Used Next.js middleware for strict request validation and handling structured error responses (e.g., 400 Bad Request, 401 Unauthorized).
* **UI Resilience:** Utilization of **React Error Boundaries** to gracefully catch UI component errors, preventing total application crashes and displaying user-friendly fallback messages.
* **Notification Redundancy:** The `cron.js` scheduler includes a **retry mechanism** and failure logging for dose reminders that fail to send, guaranteeing delivery.
* **AI/ML Fallback:** If the Missed Dose Prediction Model or the GEMINI API experiences an outage, the system logs the error and defaults to cached or generic responses, ensuring core functionality remains accessible.

***

## 11. AI/ML Integration Details 🤖

### 1. Missed Dose Prediction Model (ML)

* **Purpose:** To analyze patterns in user history and lifestyle data to predict *when* a patient is likely to miss a future dose.
* **Data Used:** Historical dose adherence, frequency, time patterns, and user interaction logs.
* **Outcome:** Triggers an **early warning alert** to the patient and their caregiver (Doctor) to intervene *before* the missed dose occurs.

### 2. AI Chatbot Health Assistant

* **Purpose:** Provide instant, context-aware information about health and medication.
* **Integration:** Direct API calls to the **GEMINI API**.
* **Functionality:** Answers natural language health queries, explains medication names, dosages, and potential side effects provided in the patient's schedule.

***

## 12. Team Members and Responsibilities 🧑‍💻

| Team Member | Key Responsibilities |
| :--- | :--- |
| **Himanshi Jaiswal** | Design UI/UX, implemented **token-based Login/Signup**, developed the **Chat features and AI Assistance** integration, and built the core **Notification System** logic. |
| **Aditya Sahani** | Developed **Medicine track and dose history** features, contributed to Chat functionality, integrated the **Prediction Model (ML)**, and implemented the Logout page. |
| **Shreyash Shankar Ghuge** | Integrated **Google Authentication** (OAuth), developed the dedicated **Doctor Dashboard** interface, and implemented the crucial **Search Filter** functionality for patient management. |

***

## 13. Future Improvements 📈

* **Wearable Sync:** Integrate with fitness APIs (e.g., Google Fit, Apple Health) to pull vitals (HR, sleep) for enhanced prediction accuracy.
* **Video Consultation:** Implement a WebRTC solution for direct virtual visits between Doctors and Rangers.
* **OCR for Prescriptions:** Add functionality to upload prescription photos and automatically parse medication details.
* **Geo-Fencing Notifications:** Advanced location-based reminders (e.g., reminding users to take medicine when they arrive at work or home).
* **Payment Gateway:** Integrate a payment system for premium features or consultation fees.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
