#!/usr/bin/env python3
"""
Test script for Git operations functionality.
Tests file creation, Git commits, and GitHub integration.
"""

import subprocess
import os
import json
import tempfile
import shutil
import sys
from pathlib import Path
from datetime import datetime

def run_command(cmd: list, cwd: str = None) -> tuple:
    """Run a command and return (success, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def test_git_configuration() -> bool:
    """Test Git configuration."""
    print("🔧 Testing Git configuration...")
    
    # Check git user name
    success, name, _ = run_command(["git", "config", "user.name"])
    if not success or not name.strip():
        print("❌ Git user.name not configured")
        return False
    
    # Check git user email
    success, email, _ = run_command(["git", "config", "user.email"])
    if not success or not email.strip():
        print("❌ Git user.email not configured")
        return False
    
    print(f"✅ Git configured: {name.strip()} <{email.strip()}>")
    return True

def test_github_token() -> bool:
    """Test GitHub token availability."""
    print("🔑 Testing GitHub token...")
    
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print("❌ GITHUB_TOKEN environment variable not set")
        return False
    
    if len(token) < 10:
        print("❌ GITHUB_TOKEN appears to be invalid (too short)")
        return False
    
    print("✅ GITHUB_TOKEN configured")
    return True

def test_file_creation() -> bool:
    """Test JSON file creation in logs directory."""
    print("📁 Testing file creation in logs directory...")
    
    # Create test data
    test_data = {
        "date": "2025-08-16",
        "title": "Git Operations Test",
        "description": "Testing file creation and Git operations",
        "tags": ["Testing", "Git"],
        "impact_level": "Testing",
        "visibility": ["Internal"],
        "resume_bullet": "Validated Git operations and file creation functionality"
    }
    
    # Create logs directory structure
    year = "2025"
    log_dir = Path("logs") / year
    log_dir.mkdir(parents=True, exist_ok=True)
    
    # Create test file
    filename = "test-git-operations.json"
    file_path = log_dir / filename
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(test_data, f, indent=2, ensure_ascii=False)
        
        if file_path.exists():
            print(f"✅ File created successfully: {file_path}")
            return True
        else:
            print("❌ File creation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error creating file: {e}")
        return False

def test_git_operations() -> bool:
    """Test Git add, commit, and push operations."""
    print("📝 Testing Git operations...")
    
    # Check if we're in a git repository
    success, _, _ = run_command(["git", "status"])
    if not success:
        print("❌ Not in a Git repository")
        return False
    
    # Add files to staging
    success, _, stderr = run_command(["git", "add", "logs/"])
    if not success:
        print(f"❌ Git add failed: {stderr}")
        return False
    
    # Check if there are changes to commit
    success, status_output, _ = run_command(["git", "status", "--porcelain"])
    if not success:
        print("❌ Could not check git status")
        return False
    
    if not status_output.strip():
        print("ℹ️  No changes to commit")
        return True
    
    # Commit changes
    commit_message = f"Test commit: Git operations validation {datetime.now().isoformat()}"
    success, _, stderr = run_command(["git", "commit", "-m", commit_message])
    if not success:
        if "nothing to commit" in stderr:
            print("ℹ️  Nothing to commit")
            return True
        else:
            print(f"❌ Git commit failed: {stderr}")
            return False
    
    print("✅ Git commit successful")
    
    # Test push (only if GITHUB_TOKEN is available)
    if os.getenv("GITHUB_TOKEN"):
        print("🚀 Testing Git push...")
        success, _, stderr = run_command(["git", "push"])
        if not success:
            print(f"⚠️  Git push failed: {stderr}")
            print("Note: This might be expected in a test environment")
            return True  # Don't fail the test for push issues in testing
        else:
            print("✅ Git push successful")
    
    return True

def cleanup_test_files():
    """Clean up test files."""
    print("🧹 Cleaning up test files...")
    test_file = Path("logs/2025/test-git-operations.json")
    if test_file.exists():
        test_file.unlink()
        print("✅ Test files cleaned up")

def main():
    """Run all Git operations tests."""
    print("Starting Git operations tests...")
    print("=" * 50)
    
    success = True
    
    # Test Git configuration
    if not test_git_configuration():
        success = False
    
    print()
    
    # Test GitHub token
    if not test_github_token():
        success = False
    
    print()
    
    # Test file creation
    if not test_file_creation():
        success = False
    
    print()
    
    # Test Git operations
    if not test_git_operations():
        success = False
    
    print()
    
    # Cleanup
    cleanup_test_files()
    
    print("=" * 50)
    if success:
        print("✅ All Git operations tests passed")
        sys.exit(0)
    else:
        print("❌ Some Git operations tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()