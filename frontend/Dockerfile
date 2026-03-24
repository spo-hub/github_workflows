# ============================================
# Stage 1: Build the Angular application
# ============================================

ARG NODE_VERSION=24-alpine3.23-sfw-ent-dev
ARG NGINX_VERSION=1-alpine3.23-dev

FROM dhi.io/node:${NODE_VERSION} AS build

WORKDIR /app

# Install pnpm using corepack (built into Node 24)
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# Copy dependency files first (for better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY . . 

# Build the Angular app for production
RUN pnpm run build

# ============================================
# Stage 2: Serve with nginx
# ============================================

FROM dhi.io/nginx:${NGINX_VERSION} AS runner

# Copy build app from build stage
COPY --from=build /app/dist/frontend-app/browser /usr/share/nginx/html

# Copy custom nginx configuration (we'll create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]