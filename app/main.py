from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import db_models

# Import your routers
from app.api.quiz_routes import router as quiz_router
from app.api.data_routes import router as data_router
from app.api.clustering_routes import router as clustering_router
from app.api.guidance_routes import router as guidance_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cognitive Learning Pattern Analyzer", version="1.0.0")

# 🔥 ADD THIS CORS BLOCK 🔥
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for the hackathon
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include your routers
app.include_router(quiz_router, prefix="/quiz", tags=["Quiz"])
app.include_router(data_router, prefix="/data", tags=["Data Collection A2"])
app.include_router(clustering_router, prefix="/cluster", tags=["ML Clustering A3"])
app.include_router(guidance_router, prefix="/guidance", tags=["Guidance Chatbot A4"])

@app.get("/")
def root():
    return {"message": "Backend is running successfully 🚀"}