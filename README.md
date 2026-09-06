# National Disaster Intelligence Platform

The **National Disaster Intelligence Platform** is an enterprise-grade, modular decision-support system designed to assess environmental risk levels, visualize geographic disaster data, enable structured citizen ground reports, and provide government authorities with actionable situational insights.

---

## ⚠️ Important Scope & Methodology Disclaimers
- **Risk Assessment vs. Prediction:** This platform is an environmental and disaster **risk assessment** system. It models vulnerability patterns from historical disaster and environmental data. It does **not** claim exact disaster timing, guaranteed predictions, or guaranteed lives saved.
- **Data Integrity:** The system processes verified datasets and does not utilize synthetic or fabricated disaster records.

---

## 🏛️ System Architecture & Repository Structure

This repository is organized as a modular monorepo supporting multi-developer collaboration:

```text
Natural-Disaster-Intelligence-Platform/
├── frontend/         # React.js (Vite) + Tailwind CSS + Leaflet.js + Chart.js
├── backend/          # Node.js + Express.js API Gateway & Business Layer
├── ai-service/       # Python + FastAPI + Scikit-learn Risk Assessment Engine
├── docs/             # Technical specifications, architecture, and team guidelines
└── .gitignore        # Universal secret protection & build artifact exclusions
```

---

## 🚀 Services Overview

### 1. Frontend (`frontend/`)
- **Technology:** React.js, Tailwind CSS, Leaflet.js, Chart.js, Vite.
- **Port:** `5173` (Default)
- **Setup:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

### 2. Main Backend (`backend/`)
- **Technology:** Node.js, Express.js, MongoDB Atlas (Cloud), JWT, bcryptjs, Cloudinary.
- **Port:** `5000`
- **Health Check:** `GET http://localhost:5000/api/health`
- **Setup:**
  ```bash
  cd backend
  npm install
  npm run dev
  ```

### 3. AI Service (`ai-service/`)
- **Technology:** Python, FastAPI, Scikit-learn, Pandas, NumPy, Uvicorn.
- **Port:** `8000`
- **Health Check:** `GET http://localhost:8000/api/health`
- **Setup:**
  ```bash
  cd ai-service
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload --port 8000
  ```

---

## 👥 Team Workflow & Git Branching
This project is maintained by a 3-member engineering team.
- Direct pushes to `main`/`master` are prohibited.
- All work must be completed on feature branches (`feature/<module-name>`) and integrated via Pull Requests.
- Refer to `docs/TEAM_WORKFLOW.md` for branching rules, commit standards, and merge workflows.
