FROM node:18-alpine

# Install dependencies including OpenSSL
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Set up the production structure
RUN cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/ && \
    cp -r .next/standalone/* . && \
    rm -rf .next/standalone

EXPOSE 3000

# Create start script
COPY scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"] 