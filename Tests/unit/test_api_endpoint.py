#!/usr/bin/env python3
"""
Test script for the Resume Logger API endpoint.
Tests POST /log-entry with real data and validates responses.
"""

import requests
import json
import os
import sys
from datetime import datetime
from typing import Dict, Any

API_BASE_URL = "http://localhost:8000"
TEST_DATA = {
    "date": "2025-08-16",
    "title": "API Endpoint Test",
    "description": "Testing the POST /log-entry endpoint with real data to validate functionality",
    "tags": ["Testing", "API", "Validation"],
    "impact_level": "Confirmed",
    "visibility": ["Internal"],
    "resume_bullet": "Successfully tested and validated API endpoint functionality with comprehensive data validation"
}

def test_api_endpoint() -> bool:
    """Test the /log-entry API endpoint with real data."""
    try:
        print("🔌 Testing API endpoint connectivity...")
        
        # Test health endpoint first
        health_response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        if health_response.status_code == 200:
            print("✅ Health endpoint responding")
        else:
            print("❌ Health endpoint not responding")
            return False
            
        # Test the main log-entry endpoint
        print("📝 Testing POST /log-entry endpoint...")
        response = requests.post(
            f"{API_BASE_URL}/log-entry",
            json=TEST_DATA,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print("✅ API endpoint test passed")
            print(f"Response: {json.dumps(response_data, indent=2)}")
            return True
        else:
            print(f"❌ API endpoint test failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Is the server running on localhost:8000?")
        return False
    except requests.exceptions.Timeout:
        print("❌ API request timed out")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_validation_errors() -> bool:
    """Test API validation with invalid data."""
    print("🔍 Testing API validation with invalid data...")
    
    invalid_data = {
        "date": "invalid-date",
        "title": "",
        "description": "",
        "tags": [],
        "impact_level": "InvalidLevel",
        "visibility": [],
        "resume_bullet": ""
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/log-entry",
            json=invalid_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 422:
            print("✅ API validation working correctly (422 for invalid data)")
            return True
        else:
            print(f"❌ Expected 422 for invalid data, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
        return False

def main():
    """Run all API endpoint tests."""
    print("Starting API endpoint tests...")
    print("=" * 50)
    
    success = True
    
    # Test valid endpoint
    if not test_api_endpoint():
        success = False
    
    print()
    
    # Test validation
    if not test_validation_errors():
        success = False
    
    print("=" * 50)
    if success:
        print("✅ All API endpoint tests passed")
        sys.exit(0)
    else:
        print("❌ Some API endpoint tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()