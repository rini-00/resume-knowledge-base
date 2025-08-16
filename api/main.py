from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import os

from .add_log_entry import add_log_entry

class ResumeEntry(BaseModel):
    date: str
    title: str
    description: str
    tags: List[str]
    impact_level: str
    visibility: List[str]
    resume_bullet: str

app = FastAPI()

@app.post("/log-entry")
def create_log_entry(entry: ResumeEntry):
    os.environ["GITHUB_TOKEN"] = "ghp_exampleTokenValue"
    result = add_log_entry(
        date=entry.date,
        title=entry.title,
        description=entry.description,
        tags=entry.tags,
        impact_level=entry.impact_level,
        visibility=entry.visibility,
        resume_bullet=entry.resume_bullet,
    )
    return {"result": result}

