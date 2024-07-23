# [Sejm Stats](https://sejm-stats.pl/)
<img src="src/sejm_app/static/img/logo.png" alt="Sejm Stats logo" width="200"/>

Welcome to Sejm-stats, a project aimed at making POLISH parliamentary data more accessible and understandable. This project provides a clear and concise view of complex parliamentary data, making it easier for citizens to stay informed about the actions and decisions of their representatives.

- [Dokumentacja (PL)](https://docs.sejm-stats.pl/)
- [Project Docs repo](https://github.com/michalskibinski109/sejm-stats-docs)
- [Discord Community](https://discord.gg/sejm-stats)
- [Support on Patronite](https://patronite.pl/sejm-stats)
- [YouTube Channel](https://www.youtube.com/@sejm-stats)

---

# Development Setup

The project is now split into two environments: one for the backend and one for the frontend.

## Backend Development

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

Note: The UI for the Django part is obsolete and will be removed soon.

## Frontend Development

> [!TIP]
> If you don't want to run the backend locally, you can use the production API at `https://sejm-stats.pl/api`. in `frontend/lib/api.tsx` file

1. Navigate to the frontend directory:
   ```
   cd ./frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```


## Contributing

When creating a pull request, we enforce a specific title format using [blumilksoftware/action-pr-title](https://github.com/blumilksoftware/action-pr-title) GitHub action. The rules are:
- `#123 - Some PR title` - for PRs that deal with a specific issue, where `123` is the issue number
- `- Some PR title` - for PRs that don't have a related issue

For any inquiries or contributions, please refer to our [GitHub repository](https://github.com/michalskibinski109/sejm-stats) or join our Discord server. Your support through Patronite or feedback on YouTube is also highly appreciated.


> [!TIP]
> If you have any questions feel free to ask on [discord](https://discord.com/invite/zH2J3z5Wbf)
