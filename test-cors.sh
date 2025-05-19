#!/bin/bash
# Simple CORS fix verification script

echo "Testing CORS configuration..."

# Check if curl is available
if ! command -v curl &> /dev/null
then
    echo "Error: curl is required but not installed."
    exit 1
fi

# Set variables
BACKEND_URL="http://localhost:5001"
ORIGIN="http://localhost:5173"

# Run a CORS test with curl
echo "Testing CORS headers from $BACKEND_URL with origin $ORIGIN..."
curl -s -I -H "Origin: $ORIGIN" -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type, Cache-Control" \
     -X OPTIONS $BACKEND_URL/api/auth/check | grep -i "access-control"

echo "Done."
