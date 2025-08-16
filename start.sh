#!/usr/bin/env bash
set -e

# Launch the FastAPI server
exec uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}
