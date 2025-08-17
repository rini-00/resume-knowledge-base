"""
FastAPI main application for Resume Knowledge Base.
Handles achievement logging with Git operations and GitHub integration.
"""

import os
from datetime import datetime
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from add_log_entry import add_log_entry

# Initialize FastAPI app
app = FastAPI(
    title="Resume Knowledge Base API",
    description="API for logging achievements with Git integration",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class AchievementRequest(BaseModel):
    date: str = Field(..., description="ISO format date (YYYY-MM-DD)")
    title: str = Field(..., min_length=5, max_length=80, description="Achievement title")
    description: str = Field(..., min_length=20, max_length=2000, description="Detailed description")
    tags: list[str] = Field(..., min_items=1, max_items=15, description="Achievement tags")
    impact_level: str = Field(..., description="Impact level of achievement")
    visibility: list[str] = Field(..., min_items=1, description="Visibility scopes")
    resume_bullet: str = Field(..., min_length=30, max_length=200, description="Resume bullet point")

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    environment: str
    github_token_configured: bool
    git_configured: bool

class AchievementResponse(BaseModel):
    success: bool
    message: str
    file_path: str = None
    commit_hash: str = None

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Resume Knowledge Base API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "log_entry": "/log-entry",
            "docs": "/docs"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring and deployment validation."""
    
    # Check GitHub token configuration
    github_token_configured = bool(os.environ.get("GITHUB_TOKEN"))
    
    # Check Git configuration (basic check)
    git_configured = True
    try:
        import subprocess
        result = subprocess.run(
            ["git", "config", "user.name"], 
            capture_output=True, 
            text=True,
            timeout=5
        )
        git_configured = result.returncode == 0 and bool(result.stdout.strip())
    except Exception:
        git_configured = False
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        environment=os.environ.get("ENVIRONMENT", "unknown"),
        github_token_configured=github_token_configured,
        git_configured=git_configured
    )

@app.post("/log-entry", response_model=AchievementResponse)
async def log_achievement(request: AchievementRequest):
    """
    Log a new achievement entry with Git commit and GitHub push.
    
    This endpoint:
    1. Validates the achievement data
    2. Creates a JSON file in the logs directory
    3. Commits the file to Git
    4. Pushes to GitHub repository
    """
    
    try:
        # Call the add_log_entry function
        result = add_log_entry(
            date=request.date,
            title=request.title,
            description=request.description,
            tags=request.tags,
            impact_level=request.impact_level,
            visibility=request.visibility,
            resume_bullet=request.resume_bullet
        )
        
        if result["success"]:
            return AchievementResponse(
                success=True,
                message=result["message"],
                file_path=result.get("file_path"),
                commit_hash=result.get("commit_hash")
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=result["message"]
            )
            
    except ValueError as e:
        # Handle validation errors (e.g., invalid date format)
        raise HTTPException(
            status_code=422,
            detail=f"Validation error: {str(e)}"
        )
    except FileNotFoundError as e:
        # Handle missing files or directories
        raise HTTPException(
            status_code=500,
            detail=f"File system error: {str(e)}"
        )
    except PermissionError as e:
        # Handle permission issues
        raise HTTPException(
            status_code=500,
            detail=f"Permission error: {str(e)}"
        )
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/status")
async def status():
    """Simple status endpoint for basic health checks."""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 8000
    port = int(os.environ.get("PORT", 8000))
    
    print(f"Starting Resume Knowledge Base API on port {port}")
    print(f"GitHub Token configured: {bool(os.environ.get('GITHUB_TOKEN'))}")
    
    uvicorn.run(app, host="0.0.0.0", port=port)