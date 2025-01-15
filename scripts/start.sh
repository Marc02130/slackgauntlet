#!/bin/bash

# SSH into EC2 and stop containers
ssh -i ~/.ssh/MB.pem ec2-user@3.236.117.93 '
  # Stop any running containers
  docker-compose down
  
  # Remove all containers and volumes
  docker system prune -af
  docker volume prune -af
  
  # remove the tar files
  rm -f slackgauntlet-app.tar
  rm -f slackgauntlet-db.tar
'

# Create init-scripts directory and copy SQL file
ssh -i ~/.ssh/MB.pem ec2-user@3.236.117.93 'mkdir -p init-scripts'
scp -i ~/.ssh/MB.pem init-scripts/init.sql ec2-user@3.236.117.93:/home/ec2-user/init-scripts/

# Create a temporary build directory
mkdir -p build_context
cp package.json package-lock.json build_context/
# Copy complete prisma directory including migrations
mkdir -p build_context/prisma
cp prisma/schema.prisma build_context/prisma/
cp Dockerfile build_context/
cp .env.local build_context/
cp -r src build_context/
cp -r public build_context/ 2>/dev/null || :
cp next.config.js build_context/ 2>/dev/null || :
cp tsconfig.json build_context/
cp tailwind.config.js build_context/
cp postcss.config.js build_context/

# Build the app image from the build context
docker build -t slackgauntlet-app:latest build_context

# Build the database image
docker build -t slackgauntlet-db -f Dockerfile.db .

# Save the images
docker save slackgauntlet-app:latest > slackgauntlet-app.tar
docker save slackgauntlet-db:latest > slackgauntlet-db.tar

# Copy the images and configuration files to EC2
scp -i ~/.ssh/MB.pem slackgauntlet-app.tar ec2-user@3.236.117.93:/home/ec2-user/
scp -i ~/.ssh/MB.pem slackgauntlet-db.tar ec2-user@3.236.117.93:/home/ec2-user/
scp -i ~/.ssh/MB.pem docker-compose.yml ec2-user@3.236.117.93:/home/ec2-user/
scp -i ~/.ssh/MB.pem .env.local ec2-user@3.236.117.93:/home/ec2-user/

# SSH into EC2 and start containers
ssh -i ~/.ssh/MB.pem ec2-user@3.236.117.93 '
  # Load the images
  docker load < slackgauntlet-db.tar
  docker load < slackgauntlet-app.tar || echo "Failed to load app image"

  # Start the containers
  docker-compose up -d db

  # Wait for database to be ready
  echo "Waiting for database to be ready..."
  until docker-compose exec -T db pg_isready -U slackgauntlet -d slackgauntlet; do
    echo "Database is unavailable - sleeping"
    sleep 2
  done
  echo "Database is ready!"
  docker-compose up -d app
'

# Clean up build directory
rm -rf build_context