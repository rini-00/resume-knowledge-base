# Backend Workflow Validation & Testing Prompt Template

## **Objective Statement**
Validate and test the Resume Achievement Logger FastAPI backend, ensuring robust API endpoints, secure Git operations, comprehensive error handling, production-ready deployment configuration, and automated testing capabilities with terminal execution.

## **Validation Scope**

### **Primary Files to Review & Update**
- `/api/main.py` - FastAPI application entry point and routing
- `/api/add_log_entry.py` - Core business logic and Git operations
- `/api/openapi.yaml` - API specification and documentation
- `/requirements.txt` - Python dependencies and versions
- `/start.sh` - Deployment startup script
- `/Tests/test_log_entry.py` - Existing test implementation
- `/logs/` - Directory structure and sample data validation

### **Standards Compliance Checklist**

#### **API Endpoint Validation**
- [ ] **POST /log-entry**: Proper request/response handling
- [ ] **Pydantic Model**: Complete `ResumeEntry` validation
- [ ] **Error Responses**: Standard HTTP status codes (400, 422, 500)
- [ ] **CORS Configuration**: Frontend integration support
- [ ] **Content-Type**: JSON request/response handling
- [ ] **API Documentation**: OpenAPI 3.1 compliance

#### **Data Processing Pipeline**
- [ ] **Date Processing**: ISO format validation and parsing
- [ ] **Slug Generation**: URL-safe filename creation
- [ ] **Path Construction**: Year-based directory organization
- [ ] **JSON Structure**: Consistent data format validation
- [ ] **File Operations**: Atomic writes with UTF-8 encoding
- [ ] **Directory Creation**: Automatic parent directory handling

#### **Git Operations & Security**
- [ ] **Git Configuration**: User name/email setup
- [ ] **Branch Management**: Main branch checkout and operations
- [ ] **Commit Process**: Descriptive commit messages
- [ ] **Remote Operations**: GitHub token authentication
- [ ] **Push Verification**: Success/failure status checking
- [ ] **Error Recovery**: Graceful failure handling

#### **Environment & Deployment**
- [ ] **Environment Variables**: GITHUB_TOKEN security
- [ ] **Process Management**: Uvicorn server configuration
- [ ] **Port Configuration**: Dynamic port binding (${PORT:-8000})
- [ ] **Logging Setup**: Error tracking and debugging
- [ ] **Health Monitoring**: Service availability checks

## **Code Quality Requirements**

### **Python Standards**
```python
# Expected patterns:
def add_log_entry(date: str, title: str, description: str, 
                 tags: List[str], impact_level: str, 
                 visibility: List[str], resume_bullet: str) -> str:
    """Docstring with full parameter documentation"""
    try:
        # Implementation with proper error handling
        return "Success message"
    except Exception as exc:
        return f"Failed to write log entry: {exc}"
```

### **Error Handling Standards**
- [ ] **Input Validation**: Pydantic model enforcement
- [ ] **Exception Catching**: Comprehensive try/except blocks
- [ ] **Error Messages**: Clear, actionable user feedback
- [ ] **Logging**: Detailed error traces for debugging
- [ ] **Status Codes**: HTTP-compliant response codes

### **Security Implementation**
- [ ] **Token Management**: Secure GitHub token handling
- [ ] **Input Sanitization**: Slug generation safety
- [ ] **Path Validation**: Prevent directory traversal
- [ ] **Process Security**: Subprocess command validation
- [ ] **Environment Isolation**: Production/development separation

## **Automated Testing Implementation**

### **Required Test Suite**
Create comprehensive tests covering:

#### **Unit Testing**
- [ ] **add_log_entry() Function**: All success/failure scenarios
- [ ] **Date Processing**: Valid/invalid ISO date handling
- [ ] **Slug Generation**: Special character handling and edge cases
- [ ] **File Operations**: Directory creation and JSON writing
- [ ] **Git Operations**: Command execution and error handling

#### **Integration Testing**
- [ ] **API Endpoints**: Request/response validation
- [ ] **End-to-End Workflow**: Frontend-to-GitHub complete flow
- [ ] **Environment Testing**: GitHub token authentication
- [ ] **Error Scenarios**: Network failures, invalid data, Git conflicts
- [ ] **Performance Testing**: Response time and throughput

#### **Production Testing**
- [ ] **Deployment Validation**: Render.com environment testing
- [ ] **GitHub Integration**: Real repository operations
- [ ] **Error Recovery**: Service restart and data persistence
- [ ] **Load Testing**: Concurrent request handling

### **Testing Framework Setup**
```python
# requirements-test.txt
pytest>=7.4.0
pytest-asyncio>=0.21.0
httpx>=0.24.0
pytest-mock>=3.11.0
pytest-cov>=4.1.0

# Test structure
tests/
├── __init__.py
├── test_add_log_entry.py      # Unit tests
├── test_api_endpoints.py      # API integration tests
├── test_git_operations.py     # Git workflow tests
├── test_error_handling.py     # Error scenario tests
└── conftest.py                # Test configuration and fixtures
```

### **Test Implementation Template**
```python
import pytest
import tempfile
import subprocess
from pathlib import Path
from unittest.mock import patch, MagicMock

from api.add_log_entry import add_log_entry

class TestAddLogEntry:
    def test_successful_entry_creation(self):
        """Test successful log entry creation and git operations"""
        pass
    
    def test_invalid_date_format(self):
        """Test handling of invalid ISO date strings"""
        pass
    
    def test_missing_github_token(self):
        """Test error handling when GITHUB_TOKEN is missing"""
        pass
    
    def test_git_commit_failure(self):
        """Test handling of git commit failures"""
        pass
    
    def test_slug_generation_edge_cases(self):
        """Test slug generation with special characters"""
        pass
```

## **Terminal Testing Instructions**

### **Setup Commands**
```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx pytest-mock pytest-cov

# Install development requirements
pip install -r requirements.txt
pip install -r requirements-test.txt

# Set up test environment
export GITHUB_TOKEN="your_test_token_here"
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### **Test Execution Guide**
```bash
# 1. Run all tests
pytest

# 2. Run specific test file
pytest tests/test_add_log_entry.py

# 3. Run tests with coverage
pytest --cov=api --cov-report=html

# 4. Run integration tests only
pytest -m integration

# 5. Run tests with verbose output
pytest -v --tb=short

# 6. Run tests in parallel
pytest -n auto
```

### **Local API Testing**
```bash
# Start local server
uvicorn api.main:app --reload --port 8000

# Test endpoint with curl
curl -X POST "http://localhost:8000/log-entry" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-08-16",
    "title": "Test Achievement",
    "description": "Test description",
    "tags": ["Testing", "API"],
    "impact_level": "Strategic",
    "visibility": ["Internal"],
    "resume_bullet": "Tested API endpoint successfully"
  }'

# Test with Python requests
python -c "
import requests
response = requests.post('http://localhost:8000/log-entry', json={
    'date': '2025-08-16',
    'title': 'Test Achievement',
    'description': 'Test description',
    'tags': ['Testing', 'API'],
    'impact_level': 'Strategic',
    'visibility': ['Internal'],
    'resume_bullet': 'Tested API endpoint successfully'
})
print(response.json())
"
```

### **Expected Test Output**
```
================================ test session starts ================================
platform darwin -- Python 3.9.18, pytest-7.4.0
collected 15 items

tests/test_add_log_entry.py ........                                    [ 53%]
tests/test_api_endpoints.py ....                                         [ 80%]
tests/test_git_operations.py ...                                         [100%]

============================== 15 passed in 12.34s ==============================

Coverage Report:
Name                    Stmts   Miss  Cover
-------------------------------------------
api/__init__.py             0      0   100%
api/main.py                15      0   100%
api/add_log_entry.py       45      2    96%
-------------------------------------------
TOTAL                      60      2    97%
```

## **Production Validation**

### **Deployment Testing**
```bash
# Test production endpoint
curl -X POST "https://rini-sandbox.site/log-entry" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-08-16",
    "title": "Production Test",
    "description": "Testing production deployment",
    "tags": ["Production", "Validation"],
    "impact_level": "Confirmed",
    "visibility": ["Internal"],
    "resume_bullet": "Validated production API deployment successfully"
  }'

# Verify git commit in repository
git log --oneline -5
```

### **Monitoring & Health Checks**
```bash
# Add health check endpoint to main.py
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Test health endpoint
curl https://rini-sandbox.site/health
```

### **Environment Validation**
```bash
# Verify environment setup
python -c "
import os
import subprocess
print('GITHUB_TOKEN:', 'SET' if os.getenv('GITHUB_TOKEN') else 'MISSING')
print('Git config:', subprocess.run(['git', 'config', 'user.name'], capture_output=True, text=True).stdout.strip())
"
```

## **Error Scenario Testing**

### **Network & Authentication Failures**
```python
def test_github_authentication_failure():
    """Test handling of invalid GitHub tokens"""
    with patch.dict(os.environ, {'GITHUB_TOKEN': 'invalid_token'}):
        result = add_log_entry(
            date="2025-08-16",
            title="Test",
            description="Test",
            tags=["Test"],
            impact_level="Test",
            visibility=["Test"],
            resume_bullet="Test"
        )
        assert "Git push failed" in result
```

### **File System Errors**
```python
def test_file_permission_error():
    """Test handling of file system permission errors"""
    with patch('pathlib.Path.mkdir', side_effect=PermissionError()):
        result = add_log_entry(...)
        assert "Failed to write log entry" in result
```

### **Git Operation Failures**
```python
def test_git_commit_no_changes():
    """Test handling when no changes to commit"""
    with patch('subprocess.run') as mock_run:
        mock_run.return_value.returncode = 1
        mock_run.return_value.stderr.decode.return_value = "nothing to commit"
        result = add_log_entry(...)
        assert "No changes to commit" in result
```

## **Performance & Load Testing**

### **Concurrent Request Testing**
```python
import asyncio
import aiohttp

async def load_test():
    """Test concurrent API requests"""
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(10):
            task = session.post('http://localhost:8000/log-entry', json={
                'date': '2025-08-16',
                'title': f'Load Test {i}',
                'description': f'Load testing request {i}',
                'tags': ['LoadTest'],
                'impact_level': 'Testing',
                'visibility': ['Internal'],
                'resume_bullet': f'Executed load test request {i}'
            })
            tasks.append(task)
        
        responses = await asyncio.gather(*tasks)
        return [r.status for r in responses]

# Run load test
# asyncio.run(load_test())
```

## **Documentation & Compliance**

### **API Documentation Validation**
- [ ] **OpenAPI Spec**: Complete and accurate endpoint documentation
- [ ] **Request Examples**: Valid JSON examples for all fields
- [ ] **Response Schemas**: Detailed success/error response formats
- [ ] **Authentication**: Clear GitHub token requirements
- [ ] **Error Codes**: Complete HTTP status code documentation

### **Code Documentation**
- [ ] **Function Docstrings**: Complete parameter and return documentation
- [ ] **Type Hints**: Full type annotation coverage
- [ ] **Inline Comments**: Complex logic explanation
- [ ] **Architecture Documentation**: System design and data flow

### **Security Compliance**
- [ ] **Token Security**: Environment variable usage patterns
- [ ] **Input Validation**: Comprehensive sanitization
- [ ] **Error Disclosure**: Safe error message handling
- [ ] **Audit Trail**: Git commit history for all operations

## **Success Criteria**

### **Functional Requirements**
- [ ] All API endpoints respond correctly with valid/invalid data
- [ ] Git operations complete successfully with proper error handling
- [ ] File system operations are atomic and safe
- [ ] GitHub integration works in production environment

### **Quality Standards**
- [ ] 95%+ test coverage on critical business logic
- [ ] Zero security vulnerabilities in dependency scan
- [ ] API response time < 2 seconds for normal operations
- [ ] Comprehensive error handling with user-friendly messages

### **Production Readiness**
- [ ] Deployment works on Render.com without issues
- [ ] Environment configuration is secure and complete
- [ ] Monitoring and health checks are implemented
- [ ] Documentation is complete and accurate

---

**Execute this prompt to ensure the Resume Achievement Logger backend meets production-ready standards with comprehensive testing capabilities and operational reliability.**