#!/bin/bash

echo "Installing required dependencies..."
npm i -g pm2

echo "Starting script: kill-ports and delete log file..."
pm2 stop all

echo "Starting server on port 3001..."
echo "By default, the curl call will be made from port 3000..."
NODE_PORT=3001 pm2 --name Node start server.js -- start &
pm2 list
pm2 save

echo "Make a simple request..."
curl --location 'localhost:3001/simple-request' \
--header 'Content-Type: multipart/form-data' \
--form 'name="simple request"' \
--form 'description="They don'\''t trigger a CORS preflight.  The motivation is that the <form> element from HTML 4.0 can submit simple requests to any origin. Under this assumption, the server doesn'\''t have to opt-in (by responding to a preflight request) to receive any request that looks like a form submission. However, the server still must opt-in using Access-Control-Allow-Origin to share the response with the script."' \
--form 'accepted_methods="GET, HEAD, POST"' \
--form 'accepted_manual_headers="Accept, Accept-Language, Content-Language, Content-Type, Range"' \
--form 'accepted_type_subtype="application/x-www-form-urlencoded, multipart/form-data, text/plain"'

echo "Make CORS request..."
curl --location 'localhost:3001/basic-client-server' \
--header 'Content-Type: multipart/form-data' \
--header 'Origin: localhost:3000'

echo "End of script: kill-port"
pm2 stop all