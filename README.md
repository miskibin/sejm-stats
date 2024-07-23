
![Docs](https://img.shields.io/badge/docs-passing-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Issues](https://img.shields.io/github/issues/michalskibinski109/sejm-stats)

# [Sejm Stats](https://sejm-stats.pl/)


<img src="src/sejm_app/static/img/logo.png" alt="Sejm Stats logo" width="200"/>

Welcome to Sejm-stats, a project aimed at making POLISH parliamentary data more accessible and understandable. This project provides a clear and concise view of complex parliamentary data, making it easier for citizens to stay informed about the actions and decisions of their representatives.

- [Dokumentacja (PL)](https://docs.sejm-stats.pl/)
- [Project Docs repo](https://github.com/michalskibinski109/sejm-stats-docs)
- [Discord Community](https://discord.gg/sejm-stats)
- [Support on Patronite](https://patronite.pl/sejm-stats)
- [YouTube Channel](https://www.youtube.com/@sejm-stats)

---
# Development setup with Docker

If you have problem with makefile please install this dependency for [Windows](http://gnuwin32.sourceforge.net/packages/make.htm)

## List all commands in the makefile

- `make help`

### Dependencies

- Docker installation
- free ports (defined in `.env` file):
   - 8000 for the app server
   - 5432 for main Postgres database

### Setup

Run `make install` or follow the steps below:

- build and run containers:

        make install
        make start
or

- initialize `.env` file and customize if needed:

        cp .env.dist .env

- build without makefile:

      docker-compose up --build -d

- Download [db_dump.sql](https://drive.google.com/file/d/1S5u3bNQ_LoYJqmvgiNFdL860HnKb7AgF/view?usp=sharing) and restore the database (docker ps -> and replace db_container_id with db container id):
  ```bash
   docker exec -it <db_container_id> psql -U postgres -c "DROP DATABASE IF EXISTS transparlament"
   docker exec -it <db_container_id> psql -U postgres -c "CREATE DATABASE transparlament"
   docker cp ./db_dump.sql <db_container_id>:/db_dump.sql
   docker exec -it <db_container_id> psql -U postgres -d transparlament -f /db_dump.sql
  ```


App will be available on [localhost:8000](http://localhost:8000).

### Production

Deploy using docker-compose:
```bash
git pull origin main
docker-compose -f docker-compose.yml up
```

> **Caution:** Unauthorized downloading of MDBootstrap files is prohibited.

### Containers

You can enter the container shells with `make bash` commands.
To control the environment you can use `make stop`, `make start` and `make kill-all` commands.

Available containers:

| Service  | Container Name   | Default External Port |
|----------|------------------|---------------------|
| App      | (not specified)  | 80               |
| Database | (not specified)  | 5432                |
| Redis    | (not specified)  | (not exposed)       |

### Pull Requests

When creating a pull request, we enforce a specific title format using [blumilksoftware/action-pr-title](https://github.com/blumilksoftware/action-pr-title) github action. The rules are:

- `#123 - Some PR title` - for PRs that deal with a specific issue, where `123` is the issue number
- `- Some PR title` - for PRs that don't have a related issue


### Features
Sejm 2.0 offers an intuitive interface with numerous features such as detailed MP profiles, bill tracking, and more. For a full list of features, visit our documentation.

### Motivation
Sejm Stats is committed to providing unbiased and detailed parliamentary information to enhance public knowledge and engagement.

For any inquiries or contributions, please refer to our [GitHub repository](https://github.com/michalskibinski109/sejm-stats) or join our Discord server. Your support through Patronite or feedback on YouTube is also highly appreciated.