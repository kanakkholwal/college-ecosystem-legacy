# Stage 1: Build
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /node-server

# Install dependencies first for caching
COPY package*.json ./
RUN npm install && npm cache clean --force
# Copy source files and build TypeScript
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24-alpine

# Set working directory
WORKDIR /node-server

# Copy only necessary files for production
COPY package*.json ./
COPY --from=builder /node-server/node_modules ./node_modules
COPY --from=builder /node-server/dist ./dist

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
# ENV REDIS_URL=${REDIS_URL}
# ENV MONGODB_URI=${MONGODB_URI}
# ENV IDENTITY_KEY=${IDENTITY_KEY}

# Expose port (match your app's port)
EXPOSE 8080 

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
#   CMD curl --fail http://localhost:8080 || exit 1

# Command to run the application
CMD ["npm", "run", "start"]

# Build command
#  docker build --tag college-ecosystem-server:latest .
# Run command
#  docker run -p 8080:8080 college-ecosystem-server:latest