# Use Debian-based Node image explicitly
FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app

# Install OpenSSL 1.1 and dependencies
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates wget netcat-traditional && \
    wget https://ftp.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    rm libssl1.1_1.1.1w-0+deb11u1_amd64.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Waiting for database..."\n\
while ! nc -z db 5432; do\n\
  sleep 1\n\
done\n\
echo "Creating fresh database schema..."\n\
npx prisma db push --accept-data-loss\n\
echo "Starting application..."\n\
cd .next/standalone && \
node server.js' > /app/start.sh && \
chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"] 