# FC Kaisar Frontend - Production Dockerfile
# Multi-stage build: Node.js build -> Nginx serve

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Vite environment variables
ARG VITE_CMS_BASE_URL=https://kaysar.kz
ARG VITE_SOTA_API_BASE_URL=
ARG VITE_FC_KAISAR_TEAM_ID=94
ARG VITE_SOTA_CURRENT_SEASON_ID=61
ARG VITE_USE_MOCK_DATA=false
ARG VITE_ENABLE_LIVE_UPDATES=true
ARG VITE_FC_KAISAR_PHONE="+7 (7242) 26-00-00"
ARG VITE_FC_KAISAR_EMAIL=info@fckaysar.kz

# Set environment variables for build
ENV VITE_CMS_BASE_URL=$VITE_CMS_BASE_URL
ENV VITE_SOTA_API_BASE_URL=$VITE_SOTA_API_BASE_URL
ENV VITE_FC_KAISAR_TEAM_ID=$VITE_FC_KAISAR_TEAM_ID
ENV VITE_SOTA_CURRENT_SEASON_ID=$VITE_SOTA_CURRENT_SEASON_ID
ENV VITE_USE_MOCK_DATA=$VITE_USE_MOCK_DATA
ENV VITE_ENABLE_LIVE_UPDATES=$VITE_ENABLE_LIVE_UPDATES
ENV VITE_FC_KAISAR_PHONE=$VITE_FC_KAISAR_PHONE
ENV VITE_FC_KAISAR_EMAIL=$VITE_FC_KAISAR_EMAIL

# Build the application
RUN npm run build

# ============================================
# Stage 3: Production (Nginx)
# ============================================
FROM nginx:1.25-alpine AS production
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built assets from builder
COPY --from=builder /app/dist .

# Copy custom nginx config for SPA routing
COPY nginx/spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
