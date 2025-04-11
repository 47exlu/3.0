#!/bin/bash

# Install proxy dependencies
cd proxy
npm install
cd ..

# Start main application in the background
npm run dev &

# Wait for the main application to start
echo "Waiting for main application to start..."
sleep 5

# Start proxy
cd proxy
npm start