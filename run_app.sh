#!/bin/bash

echo "Installing required dependencies..."
npm i -g pm2

echo "Starting script: kill-ports and delete log file..."
pm2 stop all

echo "Starting server on port 3210..."
pm2 --name Node start server.js -- start &
pm2 list

echo "Make a simple request..."
curl --location 'localhost:3210/simple-request' \
--header 'Content-Type: multipart/form-data' \
--form 'name="simple request"' \
--form 'description="They don'\''t trigger a CORS preflight.  The motivation is that the <form> element from HTML 4.0 can submit simple requests to any origin. Under this assumption, the server doesn'\''t have to opt-in (by responding to a preflight request) to receive any request that looks like a form submission. However, the server still must opt-in using Access-Control-Allow-Origin to share the response with the script."' \
--form 'accepted_methods="GET, HEAD, POST"' \
--form 'accepted_manual_headers="Accept, Accept-Language, Content-Language, Content-Type, Range"' \
--form 'accepted_type_subtype="application/x-www-form-urlencoded, multipart/form-data, text/plain"'

echo "End of script: kill-port"
pm2 stop all