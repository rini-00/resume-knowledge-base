#!/usr/bin/env python3
"""
Development server startup script for the Resume Knowledge Base API.
Starts the FastAPI server with development configuration.
"""

import os
import sys
import uvicorn
from pathlib import Path

def main():
    """Start the development server."""
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    
    # Add the API directory to Python path
    sys.path.insert(0, str(script_dir))
    
    # Set development environment variables
    os.environ.setdefault("ENVIRONMENT", "development")
    
    # Check for GitHub token
    if not os.environ.get("GITHUB_TOKEN"):
        print("⚠️  Warning: GITHUB_TOKEN environment variable not set")
        print("   Git operations will fail without this token")
        print("   Set it with: export GITHUB_TOKEN='your_token_here'")
        print("")
    
    # Server configuration
    host = "0.0.0.0"
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting Resume Knowledge Base API")
    print(f"📍 Server: http://{host}:{port}")
    print(f"📋 Health check: http://localhost:{port}/health")
    print(f"📖 API docs: http://localhost:{port}/docs")
    print(f"🔧 Environment: {os.environ.get('ENVIRONMENT', 'development')}")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the server
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=True,  # Auto-reload on file changes
            log_level="info",
            access_log=True,
            workers=1  # Single worker for development
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()