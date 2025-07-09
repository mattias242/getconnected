#!/usr/bin/env node

// Local test runner for the serverless function
const app = require('./api/index.js');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
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