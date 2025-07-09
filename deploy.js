#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const error = (message) => {
  log(`❌ ${message}`, 'red');
  process.exit(1);
};

const success = (message) => {
  log(`✅ ${message}`, 'green');
};

const info = (message) => {
  log(`ℹ️  ${message}`, 'blue');
};

const warning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

// Check if command exists
const commandExists = (command) => {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Run command with error handling
const runCommand = (command, options = {}) => {
  try {
    const result = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return result;
  } catch (error) {
    if (!options.allowError) {
      throw error;
    }
    return null;
  }
};

// Check prerequisites
const checkPrerequisites = () => {
  info('Checking prerequisites...');
  
  if (!commandExists('node')) {
    error('Node.js is required but not installed');
  }
  
  if (!commandExists('npm')) {
    error('npm is required but not installed');
  }
  
  // Check Node.js version
  const nodeVersion = runCommand('node --version', { silent: true }).toString().trim();
  info(`Node.js version: ${nodeVersion}`);
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    error('package.json not found. Run this script from the project root directory.');
  }
  
  success('Prerequisites check passed');
};

// Install dependencies
const installDependencies = () => {
  info('Installing dependencies...');
  runCommand('npm install');
  success('Dependencies installed');
};

// Build project
const buildProject = () => {
  info('Building project...');
  
  // Ensure data directory exists
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data', { recursive: true });
  }
  
  // Copy web assets if needed
  const webPublicPath = path.join('src', 'web', 'public');
  if (fs.existsSync(webPublicPath)) {
    info('Web assets ready');
  }
  
  success('Project built successfully');
};

// Local deployment
const deployLocal = (options = {}) => {
  info('Starting local deployment...');
  
  checkPrerequisites();
  installDependencies();
  buildProject();
  
  const port = options.port || 3000;
  
  success(`Local deployment ready!`);
  info(`Web interface: http://localhost:${port}`);
  info(`API endpoints: http://localhost:${port}/api`);
  
  if (options.start) {
    info('Starting server...');
    runCommand(`PORT=${port} npm run web`);
  } else {
    info('To start the server, run: npm run web');
  }
};

// Vercel deployment
const deployVercel = (options = {}) => {
  info('Starting Vercel deployment...');
  
  checkPrerequisites();
  
  // Check if Vercel CLI is installed
  if (!commandExists('vercel')) {
    warning('Vercel CLI not found. Installing...');
    runCommand('npm install -g vercel');
  }
  
  // Check if vercel.json exists
  if (!fs.existsSync('vercel.json')) {
    error('vercel.json not found. This should have been created automatically.');
  }
  
  // Update vercel.json for serverless deployment
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  // Update to use serverless version
  vercelConfig.builds = [
    {
      "src": "src/web/serverless.js",
      "use": "@vercel/node"
    }
  ];
  
  vercelConfig.routes = [
    {
      "src": "/api/(.*)",
      "dest": "/src/web/serverless.js"
    },
    {
      "src": "/(.*)",
      "dest": "/src/web/serverless.js"
    }
  ];
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  
  installDependencies();
  buildProject();
  
  info('Deploying to Vercel...');
  
  try {
    const deployCommand = options.production ? 'vercel --prod' : 'vercel';
    const result = runCommand(deployCommand, { silent: true });
    
    success('Deployed to Vercel successfully!');
    
    // Extract URL from result (this is a simplified approach)
    const output = result.toString();
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      info(`Deployment URL: ${urlMatch[0]}`);
    }
    
  } catch (error) {
    error('Vercel deployment failed. Please check your configuration and try again.');
  }
};

// Docker deployment
const deployDocker = (options = {}) => {
  info('Starting Docker deployment...');
  
  checkPrerequisites();
  
  // Check if Docker is installed
  if (!commandExists('docker')) {
    error('Docker is required but not installed');
  }
  
  // Check if Dockerfile exists
  if (!fs.existsSync('Dockerfile')) {
    warning('Dockerfile not found. Creating one...');
    createDockerfile();
  }
  
  const imageName = options.image || 'getconnected';
  const tag = options.tag || 'latest';
  const port = options.port || 3000;
  
  info(`Building Docker image: ${imageName}:${tag}`);
  runCommand(`docker build -t ${imageName}:${tag} .`);
  
  success(`Docker image built: ${imageName}:${tag}`);
  
  if (options.run) {
    info(`Starting Docker container on port ${port}...`);
    runCommand(`docker run -p ${port}:3000 -d --name getconnected-container ${imageName}:${tag}`);
    success(`Container started! Visit http://localhost:${port}`);
  } else {
    info(`To run the container: docker run -p ${port}:3000 -d --name getconnected-container ${imageName}:${tag}`);
  }
};

// Create Dockerfile if it doesn't exist
const createDockerfile = () => {
  const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p data

EXPOSE 3000

CMD ["npm", "run", "web"]
`;
  
  fs.writeFileSync('Dockerfile', dockerfile);
  info('Dockerfile created');
};

// Create .dockerignore if it doesn't exist
const createDockerignore = () => {
  const dockerignore = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
  
  fs.writeFileSync('.dockerignore', dockerignore);
  info('.dockerignore created');
};

// Heroku deployment
const deployHeroku = (options = {}) => {
  info('Starting Heroku deployment...');
  
  checkPrerequisites();
  
  // Check if Heroku CLI is installed
  if (!commandExists('heroku')) {
    error('Heroku CLI is required but not installed. Install from https://devcenter.heroku.com/articles/heroku-cli');
  }
  
  // Check if git is initialized
  if (!fs.existsSync('.git')) {
    info('Initializing git repository...');
    runCommand('git init');
    runCommand('git add .');
    runCommand('git commit -m "Initial commit"');
  }
  
  const appName = options.app || 'getconnected-app';
  
  // Create Heroku app
  info(`Creating Heroku app: ${appName}`);
  runCommand(`heroku create ${appName}`, { allowError: true });
  
  // Add Heroku remote
  runCommand(`heroku git:remote -a ${appName}`, { allowError: true });
  
  // Create Procfile
  if (!fs.existsSync('Procfile')) {
    fs.writeFileSync('Procfile', 'web: npm run web');
    info('Procfile created');
  }
  
  // Deploy to Heroku
  info('Deploying to Heroku...');
  runCommand('git add .');
  runCommand('git commit -m "Deploy to Heroku" --allow-empty');
  runCommand('git push heroku main');
  
  success('Deployed to Heroku successfully!');
  info(`App URL: https://${appName}.herokuapp.com`);
};

// Railway deployment
const deployRailway = (options = {}) => {
  info('Starting Railway deployment...');
  
  checkPrerequisites();
  
  // Check if Railway CLI is installed
  if (!commandExists('railway')) {
    warning('Railway CLI not found. Installing...');
    runCommand('npm install -g @railway/cli');
  }
  
  // Login to Railway
  info('Please ensure you are logged into Railway...');
  runCommand('railway login');
  
  // Initialize Railway project
  info('Initializing Railway project...');
  runCommand('railway init');
  
  // Deploy to Railway
  info('Deploying to Railway...');
  runCommand('railway up');
  
  success('Deployed to Railway successfully!');
  info('Check your Railway dashboard for the deployment URL');
};

// Clean up function
const cleanup = () => {
  info('Cleaning up build artifacts...');
  
  // Remove temporary files
  const tempFiles = ['build', 'dist', '.vercel'];
  tempFiles.forEach(file => {
    if (fs.existsSync(file)) {
      runCommand(`rm -rf ${file}`, { allowError: true });
    }
  });
  
  success('Cleanup completed');
};

// Main program
program
  .name('deploy')
  .description('Deploy GetConnected to various platforms')
  .version('1.0.0');

program
  .command('local')
  .description('Deploy locally for development')
  .option('-p, --port <port>', 'Port to run on', '3000')
  .option('-s, --start', 'Start the server immediately')
  .action(deployLocal);

program
  .command('vercel')
  .description('Deploy to Vercel')
  .option('--production', 'Deploy to production')
  .action(deployVercel);

program
  .command('docker')
  .description('Deploy using Docker')
  .option('-i, --image <name>', 'Docker image name', 'getconnected')
  .option('-t, --tag <tag>', 'Docker image tag', 'latest')
  .option('-p, --port <port>', 'Port to expose', '3000')
  .option('-r, --run', 'Run the container after building')
  .action(deployDocker);

program
  .command('heroku')
  .description('Deploy to Heroku')
  .option('-a, --app <name>', 'Heroku app name', 'getconnected-app')
  .action(deployHeroku);

program
  .command('railway')
  .description('Deploy to Railway')
  .action(deployRailway);

program
  .command('cleanup')
  .description('Clean up build artifacts')
  .action(cleanup);

program
  .command('check')
  .description('Check prerequisites')
  .action(checkPrerequisites);

// Show help if no command provided
if (process.argv.length === 2) {
  program.help();
}

program.parse();