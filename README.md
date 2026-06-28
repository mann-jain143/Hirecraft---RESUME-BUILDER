# HireCraftt — Craft Your Future. Land Your Dream Job.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> **HireCraftt** is an AI-powered Career Operating System that helps students and professionals build resumes, optimize ATS scores, prepare for interviews, generate portfolios, track job applications, analyze skill gaps, receive AI career guidance, and ultimately land their dream jobs.

---

## 🚀 Key Features

*   **📝 Resume Builder**: Build high-converting CVs with ATS-friendly layouts, typography customization, and real-time guidance.
*   **🎯 ATS Optimizer**: Scan and check your resumes against job descriptions to score keyword matches and identify gaps.
*   **🌐 Portfolio Generator**: Instantly turn your resume details into a hosted professional website with multiple theme options (Modern, Minimal, Creative, Dark).
*   **💬 AI Career Coach**: Leverage our executive recruiter AI chatbot powered by Gemini for interview prep, bullet optimization, and career guidance.
*   **📊 Application Tracker**: Keep tabs on your job applications, interviews, streaks, and platform activity points.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TailwindCSS, Framer Motion, html2pdf
*   **Backend**: Node.js, Express, Nodemailer, Gemini API SDK
*   **Database**: MongoDB, Mongoose

---

## ⚙️ Quick Start

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance
*   Gemini API Key (from Google AI Studio)

### Installation

1.  Clone the repository and install dependencies for both services:
    ```bash
    npm run install:all
    ```

2.  Set up environment variables in both `backend/.env` and `frontend/.env`.

3.  Run the development servers concurrently:
    ```bash
    npm run dev
    ```

    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:5000`

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

© 2026 HireCraftt. All Rights Reserved.
