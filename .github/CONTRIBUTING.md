# Contributing to Real Estate Platform

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Real-Estate.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Set up the project following the [README](../README.md)

## Development Workflow

### Backend (Django)
```bash
cd Backend
uv run python backend/manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Commit Style
Use clear, descriptive commit messages:
```
feat: add price prediction endpoint
fix: resolve JWT refresh token bug
docs: update API reference
style: format SellPage component
refactor: simplify property serializer
```

## What We're Looking For

Check the [Roadmap](../README.md#roadmap) for planned features. Phase 2 items are the best place to start:
- Search & filter (city, type, price range, bedrooms)
- User dashboard (my listings, edit/delete)
- Property status (Active / Sold / Under Review)
- Pagination on listings
- Dark/Light theme toggle

## Code Standards

- **Python**: Follow PEP 8, use Django best practices
- **JavaScript**: ESLint config is included, run `npm run lint` before pushing
- **Components**: Keep React components focused and small
- **API**: All new endpoints must have serializer validation

## Pull Requests

- One feature/fix per PR
- Reference the issue number in your PR description
- Include screenshots for UI changes
- Make sure the app runs without errors before submitting

## Questions?

Open a [Discussion](https://github.com/Mradulmanimishra/Real-Estate/discussions) or create an issue with the `question` label.
