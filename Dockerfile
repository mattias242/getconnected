FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p data logs tmp

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S getconnected -u 1001

# Change ownership of app directory
RUN chown -R getconnected:nodejs /app
USER getconnected

# Start the application
CMD ["npm", "run", "web"]