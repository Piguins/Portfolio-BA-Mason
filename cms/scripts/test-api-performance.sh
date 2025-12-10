#!/bin/bash

# API Performance Test Script
# Tests API response times after optimizations
# Expected: <200ms for simple GET, <300ms for complex queries

API_BASE_URL="${API_BASE_URL:-https://admin.mason.id.vn}"

echo "=========================================="
echo "API Performance Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local name=$2
    local expected_max=$3
    
    echo "Testing: $name"
    echo "Endpoint: $API_BASE_URL$endpoint"
    
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME_TOTAL:%{time_total}" "$API_BASE_URL$endpoint")
    http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
    time_total=$(echo "$response" | grep "TIME_TOTAL" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE/d' | sed '/TIME_TOTAL/d')
    
    # Convert to milliseconds
    time_ms=$(echo "$time_total * 1000" | bc | cut -d. -f1)
    
    if [ "$http_code" = "200" ]; then
        if (( time_ms < expected_max )); then
            echo -e "${GREEN}✓ Success${NC} - Time: ${time_ms}ms (Expected: <${expected_max}ms)"
        else
            echo -e "${YELLOW}⚠ Slow${NC} - Time: ${time_ms}ms (Expected: <${expected_max}ms)"
        fi
    else
        echo -e "${RED}✗ Failed${NC} - HTTP $http_code"
    fi
    echo ""
}

# Test endpoints
echo "1. Health Check"
test_endpoint "/api/health" "Health Check" 500

echo "2. Projects (Simple GET)"
test_endpoint "/api/projects" "Projects List" 200

echo "3. Experience (Complex Query with JOIN)"
test_endpoint "/api/experience" "Experience List" 300

echo "4. Specializations"
test_endpoint "/api/specializations" "Specializations List" 200

echo "5. Hero"
test_endpoint "/api/hero" "Hero Section" 200

echo "=========================================="
echo "Test Complete"
echo "=========================================="
echo ""
echo "Note: First request may be slower due to cold start."
echo "Subsequent requests should be faster due to caching."

