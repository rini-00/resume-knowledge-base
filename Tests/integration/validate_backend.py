#!/usr/bin/env python3
"""
Backend validation script for comprehensive testing.
Validates API endpoints, Git operations, and backend functionality.
"""

import sys
import os
import json
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime

# Check if requests is available
try:
    import requests
    from requests.exceptions import ConnectionError, Timeout, RequestException
except ImportError:
    print("❌ requests module not found")
    print("Install with: pip install requests")
    sys.exit(1)

API_BASE_URL = "http://localhost:8000"

class BackendValidator:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.total_checks = 0
        self.passed_checks = 0
        self.failed_checks = 0

    def log(self, level, message):
        """Log a message with appropriate formatting."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        if level == 'PASS':
            print(f"[{timestamp}] ✅ {message}")
            self.passed_checks += 1
        elif level == 'FAIL':
            print(f"[{timestamp}] ❌ {message}")
            self.failed_checks += 1
            self.errors.append(message)
        elif level == 'WARN':
            print(f"[{timestamp}] ⚠️  {message}")
            self.warnings.append(message)
        elif level == 'INFO':
            print(f"[{timestamp}] ℹ️  {message}")
        else:
            print(f"[{timestamp}] {message}")
        
        self.total_checks += 1

    def check_server_availability(self) -> bool:
        """Check if the API server is running."""
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=5)
            return response.status_code == 200
        except (ConnectionError, Timeout, RequestException):
            return False

    def validate_environment(self) -> bool:
        """Validate environment setup."""
        print("\n🌍 Environment Validation")
        print("=" * 50)
        
        success = True
        
        # Check Python version
        python_version = sys.version_info
        if python_version >= (3, 9):
            self.log('PASS', f"Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
        else:
            self.log('FAIL', f"Python version too old: {python_version.major}.{python_version.minor}")
            success = False
        
        # Check required modules
        required_modules = ['fastapi', 'uvicorn', 'requests', 'json', 'os', 'subprocess']
        for module in required_modules:
            try:
                __import__(module)
                self.log('PASS', f"Module available: {module}")
            except ImportError:
                self.log('FAIL', f"Module missing: {module}")
                success = False
        
        # Check GitHub token
        if os.environ.get("GITHUB_TOKEN"):
            self.log('PASS', "GitHub token configured")
        else:
            self.log('WARN', "GitHub token not configured (some operations will fail)")
        
        # Check Git configuration
        try:
            result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and result.stdout.strip():
                self.log('PASS', f"Git user configured: {result.stdout.strip()}")
            else:
                self.log('WARN', "Git user not configured")
        except Exception:
            self.log('WARN', "Git not available or not configured")
        
        return success

    def validate_api_health(self) -> bool:
        """Validate API health endpoints."""
        print("\n🏥 API Health Validation")
        print("=" * 50)
        
        if not self.check_server_availability():
            self.log('WARN', "API server not running - skipping health checks")
            return True
        
        success = True
        
        try:
            # Test health endpoint
            response = requests.get(f"{API_BASE_URL}/health", timeout=10)
            if response.status_code == 200:
                health_data = response.json()
                self.log('PASS', "Health endpoint responding")
                
                # Validate health response structure
                required_fields = ['status', 'timestamp', 'environment']
                for field in required_fields:
                    if field in health_data:
                        self.log('PASS', f"Health response contains: {field}")
                    else:
                        self.log('FAIL', f"Health response missing: {field}")
                        success = False
                        
            else:
                self.log('FAIL', f"Health endpoint failed: {response.status_code}")
                success = False
                
        except Exception as e:
            self.log('FAIL', f"Health endpoint error: {e}")
            success = False
        
        return success

    def validate_api_endpoints(self) -> bool:
        """Validate API endpoint functionality."""
        print("\n🔌 API Endpoint Validation")
        print("=" * 50)
        
        if not self.check_server_availability():
            self.log('WARN', "API server not running - skipping endpoint validation")
            return True
        
        success = True
        
        # Test root endpoint
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                self.log('PASS', "Root endpoint responding")
            else:
                self.log('FAIL', f"Root endpoint failed: {response.status_code}")
                success = False
        except Exception as e:
            self.log('FAIL', f"Root endpoint error: {e}")
            success = False
        
        # Test log-entry endpoint with valid data
        test_data = {
            "date": "2025-08-17",
            "title": "Backend Validation Test",
            "description": "Testing the backend validation system to ensure all components are working correctly and integrated properly.",
            "tags": ["Testing", "Backend", "Validation"],
            "impact_level": "Individual",
            "visibility": ["Internal"],
            "resume_bullet": "Implemented comprehensive backend validation system ensuring system reliability and integration"
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/log-entry",
                json=test_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log('PASS', "Log entry endpoint accepting valid data")
                
                # Validate response structure
                if result.get('success'):
                    self.log('PASS', "Log entry response indicates success")
                if result.get('file_path'):
                    self.log('PASS', f"File path returned: {result['file_path']}")
                if result.get('commit_hash'):
                    self.log('PASS', f"Commit hash returned: {result['commit_hash'][:8]}...")
                    
            elif response.status_code == 500:
                error_detail = response.json().get('detail', 'Unknown error')
                if "GITHUB_TOKEN" in error_detail:
                    self.log('WARN', "GitHub token missing - expected in test environment")
                else:
                    self.log('FAIL', f"Log entry endpoint error: {error_detail}")
                    success = False
            else:
                self.log('FAIL', f"Log entry endpoint failed: {response.status_code}")
                success = False
                
        except Exception as e:
            self.log('FAIL', f"Log entry endpoint error: {e}")
            success = False
        
        # Test log-entry endpoint with invalid data
        invalid_data = {
            "date": "invalid-date",
            "title": "Hi",  # Too short
            "description": "Short",  # Too short
            "tags": [],  # Empty
            "impact_level": "Individual",
            "visibility": ["Internal"],
            "resume_bullet": "Short"  # Too short
        }
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/log-entry",
                json=invalid_data,
                timeout=10
            )
            
            if response.status_code == 422:
                self.log('PASS', "Log entry endpoint correctly rejects invalid data")
            else:
                self.log('WARN', f"Unexpected response to invalid data: {response.status_code}")
                
        except Exception as e:
            self.log('WARN', f"Invalid data test error: {e}")
        
        return success

    def validate_file_operations(self) -> bool:
        """Validate file system operations."""
        print("\n📁 File Operations Validation")
        print("=" * 50)
        
        success = True
        
        # Test log directory creation
        try:
            current_year = datetime.now().year
            log_dir = Path(f"logs/{current_year}")
            log_dir.mkdir(parents=True, exist_ok=True)
            
            if log_dir.exists():
                self.log('PASS', f"Log directory accessible: {log_dir}")
            else:
                self.log('FAIL', f"Cannot access log directory: {log_dir}")
                success = False
                
        except Exception as e:
            self.log('FAIL', f"Log directory creation failed: {e}")
            success = False
        
        # Test JSON file creation
        try:
            test_file = log_dir / "backend-validation-test.json"
            test_data = {
                "test": "backend_validation",
                "timestamp": datetime.now().isoformat(),
                "description": "Test file for backend validation"
            }
            
            with open(test_file, 'w', encoding='utf-8') as f:
                json.dump(test_data, f, indent=2, ensure_ascii=False)
            
            if test_file.exists():
                self.log('PASS', "JSON file creation successful")
                
                # Verify file content
                with open(test_file, 'r', encoding='utf-8') as f:
                    loaded_data = json.load(f)
                
                if loaded_data["test"] == "backend_validation":
                    self.log('PASS', "JSON file content verified")
                else:
                    self.log('FAIL', "JSON file content mismatch")
                    success = False
            else:
                self.log('FAIL', "JSON file creation failed")
                success = False
                
        except Exception as e:
            self.log('FAIL', f"JSON file operations failed: {e}")
            success = False
        
        return success

    def validate_git_operations(self) -> bool:
        """Validate Git operations."""
        print("\n📦 Git Operations Validation")
        print("=" * 50)
        
        success = True
        
        # Check if in Git repository
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                self.log('PASS', "Git repository detected")
            else:
                self.log('WARN', "Not in Git repository - skipping Git validation")
                return True
                
        except Exception as e:
            self.log('WARN', f"Git repository check failed: {e}")
            return True
        
        # Test Git status
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                self.log('PASS', "Git status check successful")
            else:
                self.log('WARN', "Git status check failed")
                
        except Exception as e:
            self.log('WARN', f"Git status error: {e}")
        
        # Test Git add (if test file exists)
        test_file = Path(f"logs/{datetime.now().year}/backend-validation-test.json")
        if test_file.exists():
            try:
                result = subprocess.run(
                    ["git", "add", str(test_file)],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if result.returncode == 0:
                    self.log('PASS', "Git add operation successful")
                else:
                    self.log('WARN', f"Git add failed: {result.stderr}")
                    
            except Exception as e:
                self.log('WARN', f"Git add error: {e}")
        
        return success

    def validate_dependencies(self) -> bool:
        """Validate Python dependencies."""
        print("\n📦 Dependencies Validation")
        print("=" * 50)
        
        success = True
        
        # Check if requirements.txt exists
        if Path("requirements.txt").exists():
            self.log('PASS', "requirements.txt found")
        else:
            self.log('FAIL', "requirements.txt missing")
            success = False
        
        # Check core dependencies
        core_deps = {
            'fastapi': 'FastAPI web framework',
            'uvicorn': 'ASGI server',
            'requests': 'HTTP client library',
            'pydantic': 'Data validation'
        }
        
        for dep, description in core_deps.items():
            try:
                __import__(dep)
                self.log('PASS', f"{description}: {dep}")
            except ImportError:
                self.log('FAIL', f"Missing dependency: {dep} ({description})")
                success = False
        
        return success

    def run_performance_checks(self) -> bool:
        """Run basic performance checks."""
        print("\n⚡ Performance Validation")
        print("=" * 50)
        
        if not self.check_server_availability():
            self.log('WARN', "API server not running - skipping performance checks")
            return True
        
        success = True
        
        # Test response times
        try:
            import time
            
            start_time = time.time()
            response = requests.get(f"{API_BASE_URL}/health", timeout=10)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200:
                if response_time < 1000:  # Less than 1 second
                    self.log('PASS', f"Health endpoint response time: {response_time:.2f}ms")
                else:
                    self.log('WARN', f"Slow health endpoint response: {response_time:.2f}ms")
            else:
                self.log('FAIL', f"Health endpoint failed: {response.status_code}")
                success = False
                
        except Exception as e:
            self.log('FAIL', f"Performance check error: {e}")
            success = False
        
        return success

    def print_summary(self):
        """Print validation summary."""
        print("\n" + "=" * 60)
        print("🔍 BACKEND VALIDATION SUMMARY")
        print("=" * 60)
        
        print(f"Total Checks: {self.total_checks}")
        print(f"✅ Passed: {self.passed_checks}")
        print(f"❌ Failed: {self.failed_checks}")
        print(f"⚠️  Warnings: {len(self.warnings)}")
        
        if self.errors:
            print(f"\n❌ ERRORS FOUND:")
            for i, error in enumerate(self.errors, 1):
                print(f"   {i}. {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS:")
            for i, warning in enumerate(self.warnings, 1):
                print(f"   {i}. {warning}")
        
        success_rate = (self.passed_checks / self.total_checks * 100) if self.total_checks > 0 else 0
        
        if self.failed_checks == 0:
            print(f"\n🎉 Backend validation completed successfully!")
            print(f"✅ Success rate: {success_rate:.1f}%")
            return 0
        else:
            print(f"\n❌ Backend validation failed")
            print(f"📊 Success rate: {success_rate:.1f}%")
            print(f"🔧 Fix the errors above before deployment")
            return 1

    def run(self):
        """Run all backend validation checks."""
        print("🚀 Starting Backend Validation")
        print("=" * 60)
        
        try:
            # Run all validation checks
            self.validate_environment()
            self.validate_dependencies()
            self.validate_file_operations()
            self.validate_git_operations()
            self.validate_api_health()
            self.validate_api_endpoints()
            self.run_performance_checks()
            
            # Print summary and exit
            exit_code = self.print_summary()
            sys.exit(exit_code)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Validation interrupted by user")
            sys.exit(1)
        except Exception as e:
            print(f"\n\n❌ Validation error: {e}")
            sys.exit(1)

def main():
    """Main entry point."""
    validator = BackendValidator()
    validator.run()

if __name__ == "__main__":
    main()