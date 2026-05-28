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

# Create a symlink to pnpm-lock.yaml so Medusa CLI detects pnpm instead of defaulting to npm
RUN ln -s /app/pnpm-lock.yaml pnpm-lock.yaml

# Expose Medusa port
EXPOSE 9000

# Start Medusa development server (automatically runs migrations and seeding setup)
CMD ["sh", "-c", "echo 'Waiting for PostgreSQL...' && sleep 10 && pnpm exec medusa db:migrate && pnpm run dev"]
