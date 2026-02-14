# Contributing to CivicBridge AI

We love your input! We want to make contributing to CivicBridge AI as easy and transparent as possible.

## How to Contribute

- **Reporting a bug**: Use GitHub's issue tracker to report bugs.
- **Suggesting an enhancement**: Use GitHub's issue tracker to suggest new features.
- **Submitting a pull request**: Fork the repo, create a branch, and submit a PR.

## Development Process

1. **Fork the repository**: Create your own fork of the project.
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**: Add your code and tests.
4. **Run tests**: `npm test` (frontend) and `mvn test` (backend).
5. **Lint your code**: `npm run lint` (frontend).
6. **Commit your changes**: `git commit -m 'Add some feature'`
7. **Push to your branch**: `git push origin feature/your-feature-name`
8. **Submit a pull request**: Open a PR against the `main` branch.

## Pull Request Process

1. **Update documentation**: If you've changed APIs or added new features, update the relevant documentation in the `docs/` directory.
2. **Get a review**: At least one maintainer must approve the PR.
3. **Merge**: Once approved, the PR will be merged.

## Code Style

- **Frontend**: We use Prettier and ESLint to enforce a consistent code style.
- **Backend**: We follow the Google Java Style Guide.

## "Apply Now" Functionality

The "Apply Now" functionality is a key feature of CivicBridge AI. It allows users to apply for programs directly from the application.

### Frontend

The frontend is built with React and uses a combination of React Router, React Context, and the Web Speech API. The application form is a controlled component that is managed by the `ApplicationPage` component.

### Backend

The backend is built with Spring Boot and uses a combination of Spring Data JPA, Spring Security, and the Web Speech API. The application data is stored in a PostgreSQL database.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
