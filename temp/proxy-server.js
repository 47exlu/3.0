// Script to fix the port mismatch in workflow and server
// This creates a redirect wrapper to serve the content on both ports

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 5000; // Workflow expects port 5000
const TARGET_PORT = 3000; // Our app is running on port 3000

console.log(`Starting proxy server on port ${PORT} -> ${TARGET_PORT}`);

// Create proxy for all requests
app.use('/', createProxyMiddleware({
  target: `http://localhost:${TARGET_PORT}`,
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Redirecting traffic to server on port ${TARGET_PORT}`);
});