OS := $(shell uname -s)

.DEFAULT_GOAL := help

ifeq ($(OS),Linux)
    DOCKER_COMPOSE = docker compose
else ifeq ($(OS),Darwin)
    DOCKER_COMPOSE = docker-compose
else
    DOCKER_COMPOSE = docker-compose
endif

install: ## Init project
	cp -n .env.dist .env
	$(DOCKER_COMPOSE) build

start: ## Run docker for a project
	$(DOCKER_COMPOSE) up -d

stop: ## Stop all containers for a project
	$(DOCKER_COMPOSE) down --remove-orphans

bash: ## Exec bash for app container
	$(DOCKER_COMPOSE) exec web bash

fix-permissions: ## Change permision for volumen a app container
	$(DOCKER_COMPOSE) exec app	usermod -u 1000 www-data

kill-all: ## Kill all running containers
	docker container kill $$(docker container ls -q)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
