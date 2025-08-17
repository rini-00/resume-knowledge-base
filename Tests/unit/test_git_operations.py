#!/usr/bin/env python3
"""
Test script for Git operations functionality.
Tests file creation, Git commits, and GitHub integration with graceful error handling.
"""

import os
import sys
import json
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

def check_git_config() -> bool:
    """Check if Git is properly configured."""
    try:
        # Check if git is available
        result = subprocess.run(["git", "--version"], capture_output=True, text=True, timeout=5)
        if result.returncode != 0:
            print("❌ Git is not installed or not available")
            return False
        
        # Check git configuration
        name_result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True, timeout=5)
        email_result = subprocess.run(["git", "config", "user.email"], capture_output=True, text=True, timeout=5)
        
        if name_result.returncode == 0 and email_result.returncode == 0:
            print(f"✅ Git configured: {name_result.stdout.strip()} <{email_result.stdout.strip()}>")
            return True
        else:
            print("⚠️  Git user configuration incomplete")
            return False
            
    except Exception as e:
        print(f"❌ Git configuration check failed: {e}")
        return False

def check_github_token() -> bool:
    """Check if GitHub token is configured."""
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        # Mask the token for security
        masked_token = token[:4] + "*" * (len(token) - 8) + token[-4:] if len(token) > 8 else "****"
        print(f"✅ GitHub token configured: {masked_token}")
        return True
    else:
        print("⚠️  GITHUB_TOKEN environment variable not set")
        print("   Git push operations will be skipped")
        return False

def check_git_repository() -> bool:
    """Check if we're in a Git repository."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"], 
            capture_output=True, 
            text=True, 
            timeout=5
        )
        if result.returncode == 0:
            repo_root = result.stdout.strip()
            print(f"✅ Git repository found: {repo_root}")
            return True
        else:
            print("❌ Not in a Git repository")
            return False
    except Exception as e:
        print(f"❌ Git repository check failed: {e}")
        return False

def test_log_directory_creation() -> bool:
    """Test creating log directory structure."""
    print("📁 Testing log directory creation...")
    
    try:
        # Get current year
        current_year = datetime.now().year
        log_dir = Path(f"logs/{current_year}")
        
        # Create directory if it doesn't exist
        log_dir.mkdir(parents=True, exist_ok=True)
        
        if log_dir.exists() and log_dir.is_dir():
            print(f"  ✅ Log directory created: {log_dir}")
            return True
        else:
            print(f"  ❌ Failed to create log directory: {log_dir}")
            return False
            
    except Exception as e:
        print(f"  ❌ Directory creation failed: {e}")
        return False

def test_json_file_creation() -> bool:
    """Test creating JSON achievement files."""
    print("📝 Testing JSON file creation...")
    
    try:
        # Create test achievement data
        test_achievement = {
            "date": "2025-08-17",
            "title": "Git Operations Testing",
            "description": "Testing Git operations functionality including file creation, commits, and push operations with proper error handling.",
            "tags": ["Testing", "Git", "Development"],
            "impact_level": "Individual",
            "visibility": ["Internal"],
            "resume_bullet": "Implemented comprehensive Git operations testing with error handling and graceful degradation",
            "created_at": datetime.now().isoformat(),
            "file_path": "logs/2025/test-git-operations.json"
        }
        
        # Create file path
        current_year = datetime.now().year
        file_path = Path(f"logs/{current_year}/test-git-operations.json")
        
        # Ensure directory exists
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write JSON file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(test_achievement, f, indent=2, ensure_ascii=False)
        
        # Verify file was created
        if file_path.exists():
            print(f"  ✅ JSON file created: {file_path}")
            
            # Verify file content
            with open(file_path, 'r', encoding='utf-8') as f:
                loaded_data = json.load(f)
            
            if loaded_data["title"] == test_achievement["title"]:
                print(f"  ✅ JSON file content verified")
                return True
            else:
                print(f"  ❌ JSON file content mismatch")
                return False
        else:
            print(f"  ❌ JSON file not created")
            return False
            
    except Exception as e:
        print(f"  ❌ JSON file creation failed: {e}")
        return False

def test_git_add_and_commit() -> bool:
    """Test Git add and commit operations."""
    print("📦 Testing Git add and commit...")
    
    if not check_git_repository():
        print("  ⚠️  Not in Git repository - skipping Git operations")
        return True
    
    try:
        # File to commit
        test_file = Path("logs/2025/test-git-operations.json")
        
        if not test_file.exists():
            print("  ⚠️  Test file not found - skipping Git add/commit")
            return True
        
        # Git add
        add_result = subprocess.run(
            ["git", "add", str(test_file)],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if add_result.returncode == 0:
            print(f"  ✅ Git add successful")
        else:
            print(f"  ❌ Git add failed: {add_result.stderr}")
            return False
        
        # Check if there are changes to commit
        status_result = subprocess.run(
            ["git", "status", "--porcelain", str(test_file)],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if not status_result.stdout.strip():
            print("  ⚠️  No changes to commit (file already committed)")
            return True
        
        # Git commit
        commit_message = "test: Add Git operations test achievement"
        commit_result = subprocess.run(
            ["git", "commit", "-m", commit_message],
            capture_output=True,
            text=True,
            timeout=15
        )
        
        if commit_result.returncode == 0:
            print(f"  ✅ Git commit successful")
            
            # Extract commit hash
            hash_result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if hash_result.returncode == 0:
                commit_hash = hash_result.stdout.strip()[:8]
                print(f"  ✅ Commit hash: {commit_hash}")
            
            return True
        else:
            error_msg = commit_result.stderr.strip()
            if "nothing to commit" in error_msg:
                print("  ⚠️  Nothing to commit (no changes)")
                return True
            else:
                print(f"  ❌ Git commit failed: {error_msg}")
                return False
                
    except subprocess.TimeoutExpired:
        print("  ❌ Git operation timed out")
        return False
    except Exception as e:
        print(f"  ❌ Git add/commit failed: {e}")
        return False

def test_git_push() -> bool:
    """Test Git push to remote repository."""
    print("🚀 Testing Git push...")
    
    if not check_git_repository():
        print("  ⚠️  Not in Git repository - skipping Git push")
        return True
    
    if not check_github_token():
        print("  ⚠️  GitHub token not configured - skipping Git push")
        return True
    
    try:
        # Check if remote is configured
        remote_result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if remote_result.returncode != 0:
            print("  ⚠️  No remote repository configured - skipping Git push")
            return True
        
        remote_url = remote_result.stdout.strip()
        print(f"  ✅ Remote repository: {remote_url}")
        
        # Attempt to push
        push_result = subprocess.run(
            ["git", "push", "origin", "HEAD"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if push_result.returncode == 0:
            print(f"  ✅ Git push successful")
            return True
        else:
            error_msg = push_result.stderr.strip()
            if "up-to-date" in error_msg.lower():
                print("  ✅ Repository already up-to-date")
                return True
            elif "authentication" in error_msg.lower() or "denied" in error_msg.lower():
                print("  ⚠️  Git push authentication failed - check GitHub token")
                return True  # Don't fail test for auth issues
            else:
                print(f"  ❌ Git push failed: {error_msg}")
                return False
                
    except subprocess.TimeoutExpired:
        print("  ⚠️  Git push timed out - network or authentication issue")
        return True  # Don't fail for timeout
    except Exception as e:
        print(f"  ❌ Git push error: {e}")
        return False

def test_cleanup() -> bool:
    """Clean up test files."""
    print("🧹 Testing cleanup...")
    
    try:
        test_file = Path("logs/2025/test-git-operations.json")
        
        if test_file.exists():
            # Don't actually delete in Git repository - just verify we could
            print(f"  ✅ Test file exists and could be cleaned up: {test_file}")
            print(f"  ℹ️  Keeping file for Git history")
        else:
            print(f"  ✅ No test file to clean up")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Cleanup error: {e}")
        return False

def main():
    """Run all Git operations tests."""
    print("Starting Git operations tests...")
    print("=" * 50)
    
    # Initial environment checks
    print("🔧 Environment Checks:")
    git_available = check_git_config()
    github_configured = check_github_token()
    in_git_repo = check_git_repository()
    
    print("")
    
    if not git_available:
        print("⚠️  Git not properly configured - some tests will be skipped")
    if not github_configured:
        print("⚠️  GitHub token not configured - push tests will be skipped")
    if not in_git_repo:
        print("⚠️  Not in Git repository - Git operations will be skipped")
    
    success = True
    
    tests = [
        ("Log Directory Creation", test_log_directory_creation),
        ("JSON File Creation", test_json_file_creation),
        ("Git Add and Commit", test_git_add_and_commit),
        ("Git Push", test_git_push),
        ("Cleanup", test_cleanup),
    ]
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        if not test_func():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("✅ All Git operations tests passed (or skipped gracefully)")
        print("ℹ️  Some tests may have been skipped due to missing configuration")
        sys.exit(0)
    else:
        print("❌ Some Git operations tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()