#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const log = (message, color = '\x1b[0m') => {
  console.log(`${color}${message}\x1b[0m`);
};

const info = (message) => log(`ℹ️  ${message}`, '\x1b[34m');
const success = (message) => log(`✅ ${message}`, '\x1b[32m');
const warning = (message) => log(`⚠️  ${message}`, '\x1b[33m');
const error = (message) => {
  log(`❌ ${message}`, '\x1b[31m');
  process.exit(1);
};

const buildProject = () => {
  info('Building GetConnected project...');
  
  // Create necessary directories
  const directories = ['data', 'logs', 'tmp'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      info(`Created directory: ${dir}`);
    }
  });
  
  // Validate project structure
  const requiredFiles = [
    'package.json',
    'src/cli.js',
    'src/web/server.js',
    'src/web/serverless.js',
    'src/models/platforms.js',
    'src/models/database.js',
    'src/services/recommendationEngine.js',
    'src/utils/helpers.js'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    error(`Missing required files: ${missingFiles.join(', ')}`);
  }
  
  // Check package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.dependencies) {
    error('No dependencies found in package.json');
  }
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    info('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Validate that all required modules are available
  const requiredModules = [
    'commander',
    'inquirer',
    'sqlite3',
    'express',
    'cors',
    'chalk',
    'axios'
  ];
  
  requiredModules.forEach(module => {
    try {
      require.resolve(module);
    } catch (e) {
      error(`Required module not found: ${module}`);
    }
  });
  
  // Test CLI functionality
  info('Testing CLI functionality...');
  try {
    execSync('node src/cli.js --help', { stdio: 'pipe' });
    success('CLI test passed');
  } catch (e) {
    error('CLI test failed');
  }
  
  // Create build info
  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    buildNumber: process.env.BUILD_NUMBER || 'local',
    gitCommit: process.env.GIT_COMMIT || 'unknown',
    environment: process.env.NODE_ENV || 'development'
  };
  
  fs.writeFileSync('build-info.json', JSON.stringify(buildInfo, null, 2));
  info('Build info created');
  
  // Optimize for production if needed
  if (process.env.NODE_ENV === 'production') {
    info('Optimizing for production...');
    
    // Remove development files
    const devFiles = ['.env.example', 'examples/', 'DEMO.md'];
    devFiles.forEach(file => {
      if (fs.existsSync(file)) {
        execSync(`rm -rf ${file}`, { stdio: 'inherit' });
        info(`Removed development file: ${file}`);
      }
    });
    
    // Create production-optimized package.json
    const prodPackageJson = {
      ...packageJson,
      scripts: {
        start: packageJson.scripts.start,
        web: packageJson.scripts.web,
        'web:serverless': packageJson.scripts['web:serverless']
      },
      devDependencies: undefined
    };
    
    fs.writeFileSync('package.prod.json', JSON.stringify(prodPackageJson, null, 2));
    info('Production package.json created');
  }
  
  success('Build completed successfully!');
  
  // Print build summary
  console.log('\n' + '='.repeat(50));
  console.log('BUILD SUMMARY');
  console.log('='.repeat(50));
  console.log(`Project: ${packageJson.name}`);
  console.log(`Version: ${packageJson.version}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Build Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
};

// Run build if called directly
if (require.main === module) {
  buildProject();
}

module.exports = buildProject;