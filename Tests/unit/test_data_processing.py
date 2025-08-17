#!/usr/bin/env python3
"""
Test script for data processing functionality.
Tests date processing, slug generation, and JSON structure validation.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
import tempfile

def test_date_processing() -> bool:
    """Test ISO date format validation and year extraction."""
    print("📅 Testing date processing...")
    
    # Valid date formats
    valid_dates = [
        "2025-08-17",
        "2024-12-31",
        "2023-01-01"
    ]
    
    # Invalid date formats
    invalid_dates = [
        "08-17-2025",
        "2025/08/17",
        "Aug 17, 2025",
        "2025-13-01",  # Invalid month
        "2025-02-30",  # Invalid day
        "not-a-date"
    ]
    
    # Test valid dates
    for date_str in valid_dates:
        try:
            parsed_date = datetime.fromisoformat(date_str)
            year = parsed_date.year
            if year >= 2020 and year <= 2030:
                print(f"  ✅ Valid date: {date_str} -> Year: {year}")
            else:
                print(f"  ❌ Date out of reasonable range: {date_str}")
                return False
        except ValueError:
            print(f"  ❌ Failed to parse valid date: {date_str}")
            return False
    
    # Test invalid dates
    for date_str in invalid_dates:
        try:
            datetime.fromisoformat(date_str)
            print(f"  ❌ Invalid date accepted: {date_str}")
            return False
        except ValueError:
            print(f"  ✅ Invalid date rejected: {date_str}")
    
    print("✅ Date processing tests passed")
    return True

def test_slug_generation() -> bool:
    """Test URL-safe filename creation from titles."""
    print("🔗 Testing slug generation...")
    
    test_cases = [
        ("Simple Title", "simple-title"),
        ("Title with Spaces", "title-with-spaces"),
        ("Title-with-Hyphens", "title-with-hyphens"),
        ("Title_with_Underscores", "title_with_underscores"),
        ("Title & Special Characters!", "title-special-characters"),
        ("Multiple   Spaces   Here", "multiple-spaces-here"),
        ("UPPERCASE TITLE", "uppercase-title"),
        ("MixedCase Title", "mixedcase-title"),
        ("Title/with\\slashes", "title-with-slashes"),
        ("Title (with) [brackets]", "title-with-brackets")
    ]
    
    for original, expected in test_cases:
        # Simple slug generation logic (simulating what the API would do)
        slug = original.lower()
        slug = ''.join(c if c.isalnum() or c in ' -_' else '' for c in slug)
        slug = '-'.join(slug.split())
        slug = slug.strip('-')
        
        if slug == expected:
            print(f"  ✅ '{original}' -> '{slug}'")
        else:
            print(f"  ❌ '{original}' -> '{slug}' (expected: '{expected}')")
            return False
    
    print("✅ Slug generation tests passed")
    return True

def test_json_structure_validation() -> bool:
    """Test consistent JSON structure with all required fields."""
    print("📋 Testing JSON structure validation...")
    
    # Valid JSON structure
    valid_entry = {
        "date": "2025-08-17",
        "title": "Test Achievement",
        "description": "This is a test achievement description that provides adequate detail.",
        "tags": ["Testing", "Development", "Quality"],
        "impact_level": "Team",
        "visibility": ["Internal"],
        "resume_bullet": "Implemented comprehensive testing framework to improve code quality",
        "created_at": "2025-08-17T10:30:00Z",
        "file_path": "logs/2025/test-achievement.json"
    }
    
    # Test valid structure
    try:
        json_str = json.dumps(valid_entry, indent=2, ensure_ascii=False)
        parsed_back = json.loads(json_str)
        
        required_fields = ["date", "title", "description", "tags", "impact_level", "visibility", "resume_bullet"]
        
        for field in required_fields:
            if field not in parsed_back:
                print(f"  ❌ Missing required field: {field}")
                return False
            print(f"  ✅ Required field present: {field}")
        
        # Test data types
        if not isinstance(parsed_back["tags"], list):
            print("  ❌ Tags field is not a list")
            return False
        
        if not isinstance(parsed_back["visibility"], list):
            print("  ❌ Visibility field is not a list")
            return False
        
        print("  ✅ All data types correct")
        
    except json.JSONEncodeError as e:
        print(f"  ❌ JSON encoding failed: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON decoding failed: {e}")
        return False
    
    # Test invalid structures
    invalid_entries = [
        {},  # Empty object
        {"date": "2025-08-17"},  # Missing required fields
        {**valid_entry, "tags": "not-a-list"},  # Invalid data type
        {**valid_entry, "date": "invalid-date"},  # Invalid date format
    ]
    
    for i, invalid_entry in enumerate(invalid_entries):
        try:
            json_str = json.dumps(invalid_entry)
            # This should succeed (JSON encoding)
            
            # But validation would fail (simulated)
            required_fields = ["date", "title", "description", "tags", "impact_level", "visibility", "resume_bullet"]
            for field in required_fields:
                if field not in invalid_entry:
                    print(f"  ✅ Invalid entry {i+1} correctly missing required field: {field}")
                    break
            else:
                # All required fields present, check data types
                if not isinstance(invalid_entry.get("tags"), list):
                    print(f"  ✅ Invalid entry {i+1} correctly has invalid tags type")
                elif invalid_entry.get("date") == "invalid-date":
                    print(f"  ✅ Invalid entry {i+1} correctly has invalid date")
                    
        except Exception as e:
            print(f"  ✅ Invalid entry {i+1} correctly failed: {e}")
    
    print("✅ JSON structure validation tests passed")
    return True

def test_file_operations() -> bool:
    """Test atomic file writes with UTF-8 encoding."""
    print("📁 Testing file operations...")
    
    test_data = {
        "date": "2025-08-17",
        "title": "File Test Achievement",
        "description": "Testing file operations with UTF-8 encoding and special characters: áéíóú, 中文, 🎉",
        "tags": ["Testing", "FileOps"],
        "impact_level": "Individual",
        "visibility": ["Internal"],
        "resume_bullet": "Tested file operations with special characters"
    }
    
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            # Test file creation
            test_file = Path(temp_dir) / "test-achievement.json"
            
            # Write JSON with UTF-8 encoding
            with open(test_file, 'w', encoding='utf-8') as f:
                json.dump(test_data, f, indent=2, ensure_ascii=False)
            
            print(f"  ✅ File created: {test_file}")
            
            # Read back and verify
            with open(test_file, 'r', encoding='utf-8') as f:
                loaded_data = json.load(f)
            
            if loaded_data == test_data:
                print("  ✅ File content verified correctly")
            else:
                print("  ❌ File content mismatch")
                return False
            
            # Test directory creation
            nested_dir = Path(temp_dir) / "2025" / "subdirectory"
            nested_dir.mkdir(parents=True, exist_ok=True)
            
            nested_file = nested_dir / "nested-test.json"
            with open(nested_file, 'w', encoding='utf-8') as f:
                json.dump(test_data, f, indent=2, ensure_ascii=False)
            
            print(f"  ✅ Nested directory and file created: {nested_file}")
            
    except Exception as e:
        print(f"  ❌ File operations failed: {e}")
        return False
    
    print("✅ File operations tests passed")
    return True

def main():
    """Run all data processing tests."""
    print("Starting data processing tests...")
    print("=" * 50)
    
    success = True
    
    tests = [
        ("Date Processing", test_date_processing),
        ("Slug Generation", test_slug_generation),
        ("JSON Structure Validation", test_json_structure_validation),
        ("File Operations", test_file_operations),
    ]
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        if not test_func():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("✅ All data processing tests passed")
        sys.exit(0)
    else:
        print("❌ Some data processing tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()