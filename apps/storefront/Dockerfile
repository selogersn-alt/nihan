FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.1.2

# Copy package configs for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/storefront/package.json ./apps/storefront/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy storefront source files
COPY apps/storefront ./apps/storefront

WORKDIR /app/apps/storefront

# Expose Next.js port
EXPOSE 8000

# Start Next.js development server
CMD ["pnpm", "run", "dev"]
