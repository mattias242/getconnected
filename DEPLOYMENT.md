# Deployment Guide

This guide covers all deployment options for GetConnected, from local development to cloud platforms.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git (for cloud deployments)

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use the deploy script
npm run deploy:local
```

### Production Deployment
```bash
# Quick deploy to Vercel
npm run deploy:vercel

# Or use the interactive deploy script
npm run deploy
```

## Deployment Options

### 1. Local Deployment

Perfect for development and testing:

```bash
# Using npm scripts
npm run dev          # Development mode
npm run prod         # Production mode

# Using deploy script
node deploy.js local --port 3000 --start
```

**Features:**
- SQLite database
- File-based storage
- Hot reloading in dev mode
- Full CLI functionality

### 2. Vercel (Recommended for Web)

Best for serverless deployment with zero configuration:

```bash
# First time setup
npm install -g vercel
vercel login

# Deploy preview
npm run deploy:vercel

# Deploy to production
node deploy.js vercel --production
```

**Features:**
- Automatic HTTPS
- Global CDN
- Zero configuration
- Automatic scaling
- Custom domains

**Limitations:**
- In-memory storage (resets on deployment)
- No persistent database
- CLI features limited

### 3. Docker

Great for containerized deployments:

```bash
# Build and run locally
npm run deploy:docker

# Manual Docker commands
docker build -t getconnected .
docker run -p 3000:3000 getconnected

# Using docker-compose
docker-compose up -d
```

**Features:**
- Consistent environment
- Easy scaling
- Persistent storage
- Health checks
- Production-ready

**Configuration:**
- Modify `docker-compose.yml` for custom settings
- Volumes for persistent data
- Optional Redis and PostgreSQL

### 4. Heroku

Traditional PaaS deployment:

```bash
# Install Heroku CLI
npm install -g heroku

# Deploy
npm run deploy:heroku

# Custom app name
node deploy.js heroku --app my-getconnected-app
```

**Features:**
- Git-based deployment
- Add-ons for database/redis
- Custom domains
- Automatic SSL
- Staging/production environments

### 5. Railway

Modern deployment platform:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
npm run deploy:railway
```

**Features:**
- Git integration
- Database hosting
- Environment variables
- Custom domains
- Easy scaling

## Environment Configuration

### Development (.env)
```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

### Production (.env.production)
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
CORS_ORIGIN=https://your-domain.com
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | Database connection string | SQLite file |
| `SECRET_KEY` | Application secret | Auto-generated |
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `LOG_LEVEL` | Logging level | `info` |

## Database Options

### SQLite (Default)
- **Use case**: Development, small deployments
- **Location**: `data/getconnected.db`
- **Backup**: Copy database file

### PostgreSQL (Production)
```bash
# Set environment variable
DATABASE_URL=postgresql://user:pass@host:5432/getconnected

# Run migrations (if implemented)
npm run migrate
```

### In-Memory (Serverless)
- **Use case**: Vercel, short-lived instances
- **Limitations**: Data lost on restart
- **Benefits**: No setup required

## Performance Optimization

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use external database for persistent data
- [ ] Enable compression
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set up backup strategy

### Scaling Considerations
- **Horizontal scaling**: Use load balancer
- **Database**: Use external database service
- **Caching**: Add Redis for session storage
- **CDN**: Use for static assets

## Security

### SSL/TLS
- **Vercel**: Automatic HTTPS
- **Heroku**: Automatic SSL
- **Docker**: Use reverse proxy (nginx)
- **Local**: Use mkcert for development

### Environment Security
```bash
# Generate secure secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set restrictive CORS
CORS_ORIGIN=https://yourdomain.com
```

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups
- Access control

## Monitoring

### Health Checks
```bash
# Check application health
curl http://localhost:3000/api/health

# Docker health check
docker inspect getconnected --format='{{.State.Health.Status}}'
```

### Logging
- **Development**: Console output
- **Production**: Structured JSON logging
- **External**: Send to logging service

### Metrics
- Response times
- Error rates
- Database connections
- Memory usage

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 npm run web
```

#### Database Connection Issues
```bash
# Check database file permissions
ls -la data/getconnected.db

# Reset database
rm data/getconnected.db
npm run web  # Will recreate database
```

#### Memory Issues
```bash
# Check Node.js memory usage
node --max-old-space-size=4096 src/web/server.js

# Docker memory limit
docker run -m 512m getconnected
```

### Logs and Debugging

#### Enable Debug Logging
```bash
DEBUG=* npm run web
LOG_LEVEL=debug npm run web
```

#### Check Deployment Logs
```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# Docker
docker logs getconnected-container
```

## Backup and Recovery

### Database Backup
```bash
# SQLite
cp data/getconnected.db backups/backup-$(date +%Y%m%d).db

# PostgreSQL
pg_dump $DATABASE_URL > backup.sql
```

### Application Backup
```bash
# Create deployment backup
tar -czf backup.tar.gz --exclude=node_modules .
```

### Recovery Process
1. Stop application
2. Restore database
3. Restore application files
4. Restart application
5. Verify functionality

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install
          npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### GitLab CI Example
```yaml
deploy:
  stage: deploy
  script:
    - npm install
    - npm run build
    - npm run deploy:vercel
  only:
    - main
```

## Cost Optimization

### Platform Comparison
| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Vercel | Generous | $20/month | Web apps |
| Heroku | Limited | $7/month | Full apps |
| Railway | $5 credit | $0.000463/GB-hour | Modern apps |
| Docker | Self-hosted | Infrastructure costs | Enterprise |

### Resource Optimization
- Use serverless for low traffic
- Optimize database queries
- Enable compression
- Use CDN for static assets

## Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Verify network connectivity
4. Check resource limits
5. Consult platform documentation

## Quick Reference

### Deploy Commands
```bash
# Local development
npm run dev

# Production builds
npm run build
npm run prod

# Cloud deployments
npm run deploy:vercel
npm run deploy:heroku
npm run deploy:railway
npm run deploy:docker

# Maintenance
npm run clean
node deploy.js cleanup
```

### Useful URLs
- **Local**: http://localhost:3000
- **Health Check**: /api/health
- **API Docs**: /api (lists all endpoints)
- **CLI Help**: `node src/cli.js --help`