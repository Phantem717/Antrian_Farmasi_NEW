FROM node:18-alpine AS builder

WORKDIR /app

# 1. Copy only dependency files first (for better caching)
COPY package*.json ./
COPY . .

# 2. Install dependencies (including devDependencies for build)
RUN npm ci

# 3. Build the application
RUN npm run build

# 4. Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy only production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# 5. Runtime configuration
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]