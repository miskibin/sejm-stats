[![Codacy Badge](https://app.codacy.com/project/badge/Grade/cba40f6626de4790a9d2a6ca5a16d02f)](https://app.codacy.com/gh/miskibin/sejm-stats/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

<p align="center">
  <a href="https://sejm-stats.pl/"><img src="frontend/public/logo.png" alt="Sejm Stats logo" width="200"/></a>
</p>

<h1 align="center">Sejm Stats</h1>

<p align="center">
  Making <em>Polish parliamentary data</em> more accessible <br/>
  and understandable for citizens.
</p>

<p align="center">
  <a href="https://docs.sejm-stats.pl/"><strong>📚 Dokumentacja (PL)</strong></a> ·
  <a href="https://github.com/michalskibinski109/sejm-stats-docs"><strong>📖 Project Docs</strong></a> ·
  <a href="https://discord.com/invite/zH2J3z5Wbf"><strong>💬 Discord</strong></a> ·
  <a href="https://patronite.pl/sejm-stats"><strong>❤️ Patronite</strong></a> ·
  <a href="https://www.youtube.com/@sejm-stats"><strong>🎥 YouTube</strong></a>
</p>

<p align="center">
  <a href="https://sejm-stats.pl"><img src="https://github.com/user-attachments/assets/f8b3a543-1b05-4541-b65d-4f004b868ccc" alt="Sejm Stats Preview" ></a>
</p>

Sejm-stats provides a clear and concise view of complex parliamentary data, making it easier for citizens to stay informed about the actions and decisions of their representatives.

## 🚀 Quick Start

To get started with development:

1. Clone the repository:
   ```
   git clone https://github.com/miskibin/sejm-stats
   cd sejm-stats
   ```

2. Choose your development environment:
   - [Backend Development](#backend-development)
   - [Frontend Development](#frontend-development)

## 🛠️ Development Setup

Sejm-stats is split into two environments: backend and frontend.

### Backend Development

1. Create a `.env` file in the root directory with the following content:
   ```
   POSTGRES_DB=example
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_PORT=5432
   DATABASE_HOST=db
   DEBUG=true
   SECRET_KEY=does_not_matter
   EMAIL_HOST_PASSWORD=only_used_when_debug_is_false
   BUILD_TARGET=prod
   C_FORCE_ROOT=true
   ```

2. Use Visual Studio Code and open the project in a devcontainer.

3. Run the server:
   ```
   python manage.py runserver 0.0.0.0:8000
   ```

4. To update data, run the Celery worker:
   ```
   celery -A core worker -l info
   ```

> [!Note]  
> 🤖 The UI for the Django part is obsolete and will be removed soon.

### Frontend Development

> [!Tip]  
> 🤖 If you don't want to run the backend locally, you can use the production API. Set `NEXT_PUBLIC_API_URL=https://sejm-stats.pl/apiInt` in `/frontend/.env` file.

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

2. Navigate to the frontend directory:
   ```
   cd ./frontend
   ```

3. Install dependencies:
   ```
   npm i
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## 🤝 Contributing

When creating a pull request, we enforce a specific title format using [blumilksoftware/action-pr-title](https://github.com/blumilksoftware/action-pr-title) GitHub action. The rules are:

- `#123 - Some PR title` - for PRs that deal with a specific issue, where `123` is the issue number
- `- Some PR title` - for PRs that don't have a related issue

For any inquiries or contributions, please refer to our [GitHub repository](https://github.com/michalskibinski109/sejm-stats) or join our Discord server. Your support through Patronite or feedback on YouTube is also highly appreciated.

> [!Tip]  
> 🤖 If you have any questions, feel free to ask on [Discord](https://discord.com/invite/zH2J3z5Wbf)!

Sejm-stats is open for contributions!
