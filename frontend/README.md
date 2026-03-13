# GitHub Workflows Project

This is a monorepo containing frontend and backend applications.

## Project Structure

```
github_workflows/
|
├── frontend/ # Angular application with Vitest
├── backend/
├── .github/workflows/ # CI/CD Workflows
```

## Frontend

Angular application with vitest for testing.

See [frontend/README.md](./frontend/README.md) for details.

## Backend

Backend application (technology TBD).

See [backend/README.md](./backend/README.md) for details

## CI/CD

- `frontend-ci.yml` - Runs test on frontend code changes
- `backend-ci.yml` - Run test on backend code changes
