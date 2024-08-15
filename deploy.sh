#!/bin/bash

set -e

# Configuration
REPO_URL="https://github.com/miskibin/sejm-stats.git"
REPO_PATH="/"
STACK_NAME="sejm-stats"
BLUE_PORT=8001
GREEN_PORT=8002
BLUE_FRONTEND_PORT=3001
GREEN_FRONTEND_PORT=3002

# Function to run database migrations
run_migrations() {
    docker-compose run --rm web python manage.py migrate
}

# Function to build and push images
build_and_push() {
    docker-compose build
    docker-compose push
}

# Function to deploy a stack
deploy_stack() {
    local color=$1
    local backend_port=$2
    local frontend_port=$3
    
    sed -e "s/BACKEND_PORT_PLACEHOLDER/$backend_port/g" \
        -e "s/FRONTEND_PORT_PLACEHOLDER/$frontend_port/g" \
        docker-compose.yml > docker-compose-$color.yml
    docker stack deploy -c docker-compose-$color.yml $STACK_NAME-$color
}

# Main deployment process
main() {
    # Update code
    cd $REPO_PATH
    git pull origin main

    # Run database migrations
    run_migrations

    # Build and push new images
    build_and_push

    # Determine current active color
    if docker service ls | grep -q "$STACK_NAME-blue"; then
        current_color="blue"
        new_color="green"
        current_backend_port=$BLUE_PORT
        new_backend_port=$GREEN_PORT
        current_frontend_port=$BLUE_FRONTEND_PORT
        new_frontend_port=$GREEN_FRONTEND_PORT
    else
        current_color="green"
        new_color="blue"
        current_backend_port=$GREEN_PORT
        new_backend_port=$BLUE_PORT
        current_frontend_port=$GREEN_FRONTEND_PORT
        new_frontend_port=$BLUE_FRONTEND_PORT
    fi

    # Deploy new stack
    deploy_stack $new_color $new_backend_port $new_frontend_port

    # Wait for new stack to be ready
    echo "Waiting for new stack to be ready..."
    sleep 30

    # Update Nginx configuration to route traffic to new stack
    sed -i "s/proxy_pass http:\/\/web:$current_backend_port/proxy_pass http:\/\/web:$new_backend_port/" nginx.conf
    sed -i "s/proxy_pass http:\/\/frontend:$current_frontend_port/proxy_pass http:\/\/frontend:$new_frontend_port/" nginx.conf
    docker service update --force $STACK_NAME-$new_color_nginx

    # Wait for Nginx to reload
    sleep 5

    # Remove old stack
    docker stack rm $STACK_NAME-$current_color

    echo "Deployment completed successfully!"
}

# Run the main function
main