FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.1.2

# Copy package configs for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the backend source files
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Expose Medusa port
EXPOSE 9000

# Start Medusa development server (automatically runs migrations and seeding setup)
CMD ["sh", "-c", "pnpm exec medusa db:migrate && pnpm run dev"]
