from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os

app = FastAPI(
    title="National Disaster Intelligence Platform - AI Service",
    description="Risk assessment analytical engine using historical disaster & environmental patterns",
    version="1.0.0"
)

# CORS Middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "AI Risk Assessment Service (FastAPI)",
        "model_status": "standby",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
