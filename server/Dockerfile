# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
RUN npm install

# Copy source files and tsconfig
COPY src ./src
COPY tsconfig.json ./

# Compile TypeScript
RUN npm run build

# Stage 2: Run
FROM node:22-alpine AS runner

WORKDIR /app

# Run as non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built files and production node_modules from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# We don't set a CMD here because we will use docker-compose to run 
# either the API (start:api) or the Worker (start:worker)
