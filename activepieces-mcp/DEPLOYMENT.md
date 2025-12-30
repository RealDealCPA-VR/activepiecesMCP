# Deployment Guide

This guide covers all deployment options for the Activepieces MCP Server.

## Table of Contents

1. [NPM Deployment](#npm-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Docker Compose Deployment](#docker-compose-deployment)
4. [Production Considerations](#production-considerations)
5. [Scaling](#scaling)

## NPM Deployment

### Global Installation

Install the package globally to use it from anywhere:

```bash
npm install -g activepieces-mcp
```

### Usage

```bash
# Set environment variables
export ACTIVEPIECES_API_URL="https://your-instance.activepieces.com/api/v1"
export ACTIVEPIECES_API_KEY="your-api-key"

# Run the server
activepieces-mcp
```

### Using npx (No Installation)

```bash
npx activepieces-mcp
```

### Publishing to NPM

If you want to publish your own version:

```bash
# Update package.json with your details
# Login to NPM
npm login

# Publish
npm publish
```

## Docker Deployment

### Building the Image

```bash
# Build the image
docker build -t activepieces-mcp:latest .

# Tag for registry (optional)
docker tag activepieces-mcp:latest your-registry/activepieces-mcp:latest
```

### Running the Container

#### Basic Run

```bash
docker run -i --rm \
  -e ACTIVEPIECES_API_URL="https://your-instance.activepieces.com/api/v1" \
  -e ACTIVEPIECES_API_KEY="your-api-key" \
  activepieces-mcp:latest
```

#### With Environment File

```bash
# Create .env file
cat > .env << EOF
ACTIVEPIECES_API_URL=https://your-instance.activepieces.com/api/v1
ACTIVEPIECES_API_KEY=your-api-key
MCP_MODE=stdio
LOG_LEVEL=error
DISABLE_CONSOLE_OUTPUT=true
EOF

# Run with env file
docker run -i --rm --env-file .env activepieces-mcp:latest
```

#### Persistent Container

```bash
docker run -d \
  --name activepieces-mcp \
  --restart unless-stopped \
  -e ACTIVEPIECES_API_URL="https://your-instance.activepieces.com/api/v1" \
  -e ACTIVEPIECES_API_KEY="your-api-key" \
  activepieces-mcp:latest
```

### Pushing to Registry

```bash
# Docker Hub
docker push your-username/activepieces-mcp:latest

# GitHub Container Registry
docker tag activepieces-mcp:latest ghcr.io/your-username/activepieces-mcp:latest
docker push ghcr.io/your-username/activepieces-mcp:latest

# Private Registry
docker tag activepieces-mcp:latest registry.example.com/activepieces-mcp:latest
docker push registry.example.com/activepieces-mcp:latest
```

## Docker Compose Deployment

### Basic Setup

```bash
# Clone repository
git clone https://github.com/yourusername/activepieces-mcp.git
cd activepieces-mcp

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Custom docker-compose.yml

For production, you might want to customize:

```yaml
version: '3.8'

services:
  activepieces-mcp:
    build:
      context: .
      dockerfile: Dockerfile
    image: activepieces-mcp:latest
    container_name: activepieces-mcp-prod
    environment:
      - ACTIVEPIECES_API_URL=${ACTIVEPIECES_API_URL}
      - ACTIVEPIECES_API_KEY=${ACTIVEPIECES_API_KEY}
      - MCP_MODE=stdio
      - LOG_LEVEL=info
      - DISABLE_CONSOLE_OUTPUT=false
    stdin_open: true
    tty: true
    restart: always
    networks:
      - activepieces-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  activepieces-network:
    driver: bridge
```

### Multiple Instances

To run multiple instances for different Activepieces environments:

```yaml
version: '3.8'

services:
  activepieces-mcp-prod:
    build: .
    environment:
      - ACTIVEPIECES_API_URL=${PROD_API_URL}
      - ACTIVEPIECES_API_KEY=${PROD_API_KEY}
    networks:
      - prod-network

  activepieces-mcp-staging:
    build: .
    environment:
      - ACTIVEPIECES_API_URL=${STAGING_API_URL}
      - ACTIVEPIECES_API_KEY=${STAGING_API_KEY}
    networks:
      - staging-network

networks:
  prod-network:
  staging-network:
```

## Production Considerations

### Security

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables or secrets management
   - Rotate keys regularly
   - Use separate keys for different environments

2. **Network Security**
   - Use HTTPS for Activepieces API connections
   - Implement network policies in Kubernetes
   - Use private networks for Docker containers

3. **Container Security**
   - Run as non-root user (already configured)
   - Scan images for vulnerabilities
   - Keep base images updated
   - Use minimal base images (Alpine)

### Monitoring

1. **Logging**
   ```bash
   # Docker logs
   docker logs -f activepieces-mcp
   
   # Docker Compose logs
   docker-compose logs -f activepieces-mcp
   ```

2. **Health Checks**
   Add health check to Dockerfile:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('./dist/api/client').healthCheck()"
   ```

3. **Metrics**
   - Monitor container resource usage
   - Track API response times
   - Monitor error rates

### High Availability

1. **Multiple Replicas**
   ```bash
   docker-compose up -d --scale activepieces-mcp=3
   ```

2. **Load Balancing**
   Use a load balancer for HTTP mode (when implemented)

3. **Failover**
   Configure restart policies:
   ```yaml
   restart: always
   ```

### Backup and Recovery

1. **Configuration Backup**
   ```bash
   # Backup .env file
   cp .env .env.backup
   
   # Backup docker-compose.yml
   cp docker-compose.yml docker-compose.yml.backup
   ```

2. **Container State**
   ```bash
   # Export container
   docker export activepieces-mcp > activepieces-mcp.tar
   
   # Import container
   docker import activepieces-mcp.tar
   ```

## Scaling

### Horizontal Scaling

For multiple Claude Desktop instances or high-volume usage:

```yaml
version: '3.8'

services:
  activepieces-mcp:
    build: .
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Resource Limits

Set appropriate resource limits:

```bash
docker run -i --rm \
  --memory="512m" \
  --cpus="0.5" \
  -e ACTIVEPIECES_API_URL="..." \
  -e ACTIVEPIECES_API_KEY="..." \
  activepieces-mcp:latest
```

### Performance Tuning

1. **Node.js Options**
   ```yaml
   environment:
     - NODE_OPTIONS="--max-old-space-size=512"
   ```

2. **Connection Pooling**
   Adjust axios timeout in client.ts:
   ```typescript
   timeout: 30000, // 30 seconds
   ```

3. **Caching**
   Implement caching for frequently accessed data

## Kubernetes Deployment

For Kubernetes environments:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: activepieces-mcp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: activepieces-mcp
  template:
    metadata:
      labels:
        app: activepieces-mcp
    spec:
      containers:
      - name: activepieces-mcp
        image: activepieces-mcp:latest
        env:
        - name: ACTIVEPIECES_API_URL
          valueFrom:
            secretKeyRef:
              name: activepieces-secrets
              key: api-url
        - name: ACTIVEPIECES_API_KEY
          valueFrom:
            secretKeyRef:
              name: activepieces-secrets
              key: api-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: docker build -t activepieces-mcp:latest .
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push activepieces-mcp:latest
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs activepieces-mcp

# Inspect container
docker inspect activepieces-mcp

# Check environment variables
docker exec activepieces-mcp env
```

### Performance Issues

```bash
# Check resource usage
docker stats activepieces-mcp

# Check container processes
docker top activepieces-mcp
```

### Network Issues

```bash
# Test connectivity
docker exec activepieces-mcp curl -I https://your-instance.activepieces.com

# Check DNS
docker exec activepieces-mcp nslookup your-instance.activepieces.com
```

---

For more help, see the main [README.md](README.md) or open an issue on GitHub.
