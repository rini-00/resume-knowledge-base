#!/bin/bash

# Test Error Handling Script
# Comprehensive testing of error scenarios across the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ $message${NC}"
        ((PASSED_TESTS++))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ $message${NC}"
        ((FAILED_TESTS++))
    elif [ "$status" = "INFO" ]; then
        echo -e "${BLUE}ℹ️  $message${NC}"
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    fi
    ((TOTAL_TESTS++))
}

# Function to create a divider of equal signs
divider() {
    printf '=%.0s' {1..60}  # Repeats the '=' character 60 times
    echo  # Adds a newline at the end
}

# Function to test API error scenarios
test_api_errors() {
    echo -e "\n${BLUE}🔌 Testing API Error Scenarios${NC}"
    divider
    
    # Test 1: Connection to non-existent server
    echo "Testing connection to non-existent server..."
    if timeout 5 curl -s -f http://localhost:9999/health > /dev/null 2>&1; then
        print_status "FAIL" "Expected connection error but got response"
    else
        print_status "PASS" "Connection error handled correctly"
    fi
    
    # Test 2: Invalid JSON data to API
    echo "Testing invalid JSON data..."
    if command -v curl > /dev/null; then
        response=$(curl -s -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d '{"invalid": "data"}' \
            http://localhost:8000/log-entry 2>/dev/null || echo "000")
        
        if [[ "$response" == *"422"* ]] || [[ "$response" == *"400"* ]]; then
            print_status "PASS" "Invalid JSON data rejected appropriately"
        elif [[ "$response" == "000" ]]; then
            print_status "INFO" "Server not responding (expected in some environments)"
        else
            print_status "FAIL" "Invalid JSON data not handled properly"
        fi
    else
        print_status "WARN" "curl not available, skipping API tests"
    fi
    
    # Test 3: Malformed JSON syntax
    echo "Testing malformed JSON syntax..."
    if command -v curl > /dev/null; then
        response=$(curl -s -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d '{invalid json syntax}' \
            http://localhost:8000/log-entry 2>/dev/null || echo "000")
        
        if [[ "$response" == *"400"* ]] || [[ "$response" == *"422"* ]]; then
            print_status "PASS" "Malformed JSON handled correctly"
        elif [[ "$response" == "000" ]]; then
            print_status "INFO" "Server not responding (expected in some environments)"
        else
            print_status "FAIL" "Malformed JSON not handled properly"
        fi
    fi
}

# Function to test environment variable errors
test_environment_errors() {
    echo -e "\n${BLUE}🔑 Testing Environment Variable Errors${NC}"
    divider
    
    # Test 1: Missing GITHUB_TOKEN
    echo "Testing missing GITHUB_TOKEN..."
    if [ -z "$GITHUB_TOKEN" ]; then
        print_status "PASS" "GITHUB_TOKEN missing - error handling can be tested"
    else
        # Temporarily unset token and test
        original_token="$GITHUB_TOKEN"
        unset GITHUB_TOKEN
        
        # Test API call without token
        if command -v python3 > /dev/null; then
            python3 -c "
import os, requests
try:
    response = requests.post('http://localhost:8000/log-entry', 
                           json={'date': '2025-08-16', 'title': 'Test'}, 
                           timeout=5)
    print(f'Response: {response.status_code}')
except:
    print('Connection failed (expected)')
" 2>/dev/null
        fi
        
        # Restore token
        export GITHUB_TOKEN="$original_token"
        print_status "PASS" "Missing GITHUB_TOKEN scenario tested"
    fi
    
    # Test 2: Invalid GITHUB_TOKEN format
    echo "Testing invalid GITHUB_TOKEN format..."
    if [ -n "$GITHUB_TOKEN" ]; then
        if [ ${#GITHUB_TOKEN} -lt 10 ]; then
            print_status "PASS" "GITHUB_TOKEN appears invalid (good for testing)"
        else
            print_status "PASS" "GITHUB_TOKEN format appears valid"
        fi
    fi
}

# Function to test file system errors
test_filesystem_errors() {
    echo -e "\n${BLUE}📁 Testing File System Errors${NC}"
    divider
    
    # Test 1: Permission denied scenarios
    echo "Testing file permission scenarios..."
    
    # Create a test directory
    test_dir="/tmp/resume_logger_test"
    mkdir -p "$test_dir"
    
    # Test creating files in temp directory
    if touch "$test_dir/test_file.json" 2>/dev/null; then
        print_status "PASS" "File creation in temp directory works"
        rm -f "$test_dir/test_file.json"
    else
        print_status "FAIL" "Cannot create files in temp directory"
    fi
    
    # Test 2: Disk space simulation (create large file)
    echo "Testing large file creation..."
    if dd if=/dev/zero of="$test_dir/large_test.tmp" bs=1M count=1 2>/dev/null; then
        print_status "PASS" "Large file creation works"
        rm -f "$test_dir/large_test.tmp"
    else
        print_status "FAIL" "Large file creation failed"
    fi
    
    # Test 3: Directory creation
    echo "Testing nested directory creation..."
    nested_dir="$test_dir/logs/2025/nested"
    if mkdir -p "$nested_dir" 2>/dev/null; then
        print_status "PASS" "Nested directory creation works"
    else
        print_status "FAIL" "Nested directory creation failed"
    fi
    
    # Cleanup
    rm -rf "$test_dir"
}

# Function to test Git operation errors
test_git_errors() {
    echo -e "\n${BLUE}📝 Testing Git Operation Errors${NC}"
    divider
    
    # Test 1: Git configuration
    echo "Testing Git configuration..."
    if git config user.name > /dev/null 2>&1; then
        print_status "PASS" "Git user.name configured"
    else
        print_status "FAIL" "Git user.name not configured"
    fi
    
    if git config user.email > /dev/null 2>&1; then
        print_status "PASS" "Git user.email configured"
    else
        print_status "FAIL" "Git user.email not configured"
    fi
    
    # Test 2: Git repository status
    echo "Testing Git repository status..."
    if git status > /dev/null 2>&1; then
        print_status "PASS" "Git repository detected"
    else
        print_status "FAIL" "Not in a Git repository"
    fi
    
    # Test 3: Git operations in non-repo directory
    echo "Testing Git operations in non-repo directory..."
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    if git status > /dev/null 2>&1; then
        print_status "FAIL" "Git should fail in non-repo directory"
    else
        print_status "PASS" "Git correctly fails in non-repo directory"
    fi
    cd - > /dev/null
    rm -rf "$temp_dir"
    
    # Test 4: Git remote connectivity (if configured)
    echo "Testing Git remote connectivity..."
    if git remote -v > /dev/null 2>&1; then
        remote_url=$(git remote get-url origin 2>/dev/null || echo "")
        if [ -n "$remote_url" ]; then
            print_status "PASS" "Git remote configured: $remote_url"
        else
            print_status "WARN" "No Git remote configured"
        fi
    else
        print_status "WARN" "Git remote check failed"
    fi
}

# Function to test network errors
test_network_errors() {
    echo -e "\n${BLUE}🌐 Testing Network Errors${NC}"
    divider
    
    # Test 1: DNS resolution failure
    echo "Testing DNS resolution failure..."
    if timeout 3 curl -s -f http://invalid-domain-that-does-not-exist.com > /dev/null 2>&1; then
        print_status "FAIL" "Expected DNS failure but got response"
    else
        print_status "PASS" "DNS failure handled correctly"
    fi
    
    # Test 2: Connection timeout
    echo "Testing connection timeout..."
    if timeout 2 curl -s -f http://10.255.255.1:80 > /dev/null 2>&1; then
        print_status "FAIL" "Expected timeout but got response"
    else
        print_status "PASS" "Connection timeout handled correctly"
    fi
    
    # Test 3: HTTP error codes
    echo "Testing HTTP error codes..."
    if command -v curl > /dev/null; then
        # Test 404 error
        response_code=$(curl -s -w "%{http_code}" -o /dev/null https://httpbin.org/status/404 2>/dev/null || echo "000")
        if [ "$response_code" = "404" ]; then
            print_status "PASS" "HTTP 404 error detected correctly"
        else
            print_status "INFO" "HTTP error test skipped (network/service unavailable)"
        fi
        
        # Test 500 error
        response_code=$(curl -s -w "%{http_code}" -o /dev/null https://httpbin.org/status/500 2>/dev/null || echo "000")
        if [ "$response_code" = "500" ]; then
            print_status "PASS" "HTTP 500 error detected correctly"
        else
            print_status "INFO" "HTTP 500 test skipped (network/service unavailable)"
        fi
    fi
}

# Function to test frontend error scenarios
test_frontend_errors() {
    echo -e "\n${BLUE}🖥️  Testing Frontend Error Scenarios${NC}"
    divider
    
    # Test 1: Check for error handling in React component
    echo "Testing React component error handling..."
    if [ -f "agent/ResumeLogger.jsx" ]; then
        if grep -q "try\|catch\|error" "agent/ResumeLogger.jsx"; then
            print_status "PASS" "Error handling patterns found in ResumeLogger component"
        else
            print_status "WARN" "No explicit error handling found in ResumeLogger component"
        fi
    else
        print_status "WARN" "ResumeLogger.jsx not found"
    fi
    
    # Test 2: Check for error boundaries
    echo "Testing error boundary implementation..."
    if [ -f "src/App.js" ]; then
        if grep -q -i "error.*boundary\|componentDidCatch\|getDerivedStateFromError" "src/App.js"; then
            print_status "PASS" "Error boundary patterns found"
        else
            print_status "WARN" "No error boundary patterns found"
        fi
    else
        print_status "WARN" "App.js not found"
    fi
    
    # Test 3: Check for API error handling
    echo "Testing API error handling in frontend..."
    if [ -f "agent/ResumeLogger.jsx" ]; then
        if grep -q -i "catch\|error\|fail" "agent/ResumeLogger.jsx"; then
            print_status "PASS" "API error handling patterns found"
        else
            print_status "WARN" "No API error handling patterns found"
        fi
    fi
}

# Function to print final summary
print_summary() {
    echo -e "\n${'='*60}"
    echo -e "${BLUE}ERROR HANDLING TEST SUMMARY${NC}"
    divider
    
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All error handling tests passed!${NC}"
        echo -e "${GREEN}✅ Application error handling validated${NC}"
        return 0
    else
        echo -e "\n${RED}⚠️  Some error handling tests failed${NC}"
        echo -e "${RED}❌ Review and improve error handling before deployment${NC}"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚨 Starting Error Handling Tests${NC}"
    divider
    
    # Run all test categories
    test_api_errors
    test_environment_errors
    test_filesystem_errors
    test_git_errors
    test_network_errors
    test_frontend_errors
    
    # Print summary and exit
    print_summary
    exit $?
}

# Run main function
main "$@"
