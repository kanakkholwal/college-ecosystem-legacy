# # Stage 1: Build
# FROM node:20.12.2-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy root-level Turbo and package files
# COPY turbo.json ./
# COPY package.json ./

# # Copy only the apps/server directory and its dependencies
# COPY apps/server/package.json ./apps/server/package.json

# # Install root dependencies with Turbo in isolated mode
# RUN npm install

# # Copy the rest of the files (only server files)
# COPY . .

# # Build only the server app
# RUN npx turbo build --filter=server

# # Stage 2: Production
# FROM node:20.12.2-alpine

# # Set working directory
# WORKDIR /app

# # Copy only what's necessary from the build stage
# COPY --from=builder /app/apps/server/package.json ./package.json
# COPY --from=builder /app/apps/server/node_modules ./node_modules
# COPY --from=builder /app/apps/server/dist ./dist

# # Set environment to production
# ENV NODE_ENV=production

# # Expose port (match your app's port)
# EXPOSE 3000

# # Non-root user for security
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

# # Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
#   CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# # Command to run the application
# CMD ["node", "dist/index.js"]

# Previous Dockerfile

# Stage 1: Build
FROM node:20.12.2-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20.12.2-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built files from builder
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
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Command to run the application
CMD ["node", "dist/index.js"]
