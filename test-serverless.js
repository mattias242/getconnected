#!/usr/bin/env node

// Local test runner for the serverless function
const app = require('./api/index.js');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GetConnected serverless function running locally on http://localhost:${PORT}`);
  console.log('');
  console.log('Test endpoints:');
  console.log(`- Home page:     http://localhost:${PORT}/`);
  console.log(`- Health check:  http://localhost:${PORT}/api/health`);
  console.log(`- Platforms:     http://localhost:${PORT}/api/platforms`);
  console.log(`- Users:         http://localhost:${PORT}/api/users`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});