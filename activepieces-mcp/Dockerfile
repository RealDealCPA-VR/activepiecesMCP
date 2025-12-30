# Multi-stage build for smaller image size
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV MCP_MODE=stdio
ENV LOG_LEVEL=error
ENV DISABLE_CONSOLE_OUTPUT=true

# Run as non-root user
USER node

# Start the server
CMD ["node", "dist/mcp/index.js"]
