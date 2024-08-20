#!/bin/bash

# Step 1: Pull the latest changes from the origin main branch
echo "Pulling latest changes from origin main..."
git pull origin main

# Step 2: Clean up unused Docker builder cache
echo "Pruning Docker builder cache..."
sudo docker builder prune -a -f

# Step 3: Build Docker services
echo "Building Docker services..."
sudo docker compose build

# Step 4: Stop and remove Docker containers
echo "Stopping and removing Docker containers..."
sudo docker compose down

# Step 5: Start Docker services
echo "Starting Docker services..."
sudo docker compose up -d

echo "Script execution completed."
