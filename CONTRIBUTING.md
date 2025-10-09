# Contributing to Anomia LLM

Thank you for your interest in contributing to Anomia LLM! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/anomia-llm.git
   cd anomia-llm
   ```
3. **Set up development environment** following the README instructions
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

#### Frontend (React/JavaScript)
- Use **ESLint** and **Prettier** for code formatting
- Follow **React best practices** and hooks patterns
- Use **functional components** with hooks
- Implement **proper error boundaries**
- Write **meaningful component names** and props

#### Backend (Python/FastAPI)
- Follow **PEP 8** style guidelines
- Use **type hints** for all function parameters and return values
- Write **comprehensive docstrings** for functions and classes
- Use **Pydantic models** for data validation
- Implement **proper error handling** with custom exceptions

### Testing

#### Frontend Testing
```bash
cd frontend
npm test                    # Run tests
npm run test:coverage      # Run with coverage
npm run test:watch         # Watch mode
```

#### Backend Testing
```bash
cd backend
pytest                     # Run tests
pytest --cov=.            # Run with coverage
pytest -v                 # Verbose output
```

### Git Workflow

1. **Make your changes** in your feature branch
2. **Write tests** for new functionality
3. **Update documentation** if needed
4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add swipe gesture support for faceoffs
fix: resolve WebSocket connection issues
docs: update API documentation
test: add unit tests for game service
```

## 🐛 Reporting Issues

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, browser, Node.js version, etc.)
5. **Screenshots** or error messages if applicable

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide mockups** or examples if possible

## 🔍 Code Review Process

1. **Automated checks** must pass (tests, linting, build)
2. **Code review** by maintainers
3. **Address feedback** and make requested changes
4. **Squash commits** if requested
5. **Merge** after approval

## 📚 Documentation

- **Update README.md** for significant changes
- **Add API documentation** for new endpoints
- **Include code comments** for complex logic
- **Write clear commit messages**

## 🏗️ Architecture Guidelines

### Frontend Architecture
- **Component-based** design with clear separation of concerns
- **Context API** for global state management
- **Custom hooks** for reusable logic
- **Responsive design** with mobile-first approach

### Backend Architecture
- **Service layer** pattern for business logic
- **Repository pattern** for data access
- **Dependency injection** for testability
- **Event-driven** architecture for real-time features

## 🚀 Deployment

- **Docker** containers for consistent deployment
- **Environment variables** for configuration
- **Health checks** for monitoring
- **Graceful shutdown** handling

## 📞 Getting Help

- **GitHub Issues** for bug reports and feature requests
- **Discussions** for general questions
- **Pull Requests** for code contributions

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Anomia LLM! 🎮
