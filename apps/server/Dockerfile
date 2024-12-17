# Stage 1: Build
FROM node:20.12.2-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install --production

# Copy source files and build TypeScript
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20.12.2-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files for production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose port (match your app's port)
EXPOSE 3000

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD curl --fail http://localhost:3000/ || exit 1

# Command to run the application
CMD ["node", "dist/index.js"]
