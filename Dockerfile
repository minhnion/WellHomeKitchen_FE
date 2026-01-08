# ========= Build stage =========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Copy source
COPY . .

# Build Next.js
RUN npm run build


# ========= Production stage =========
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# Install only production deps
RUN npm ci --omit=dev

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
