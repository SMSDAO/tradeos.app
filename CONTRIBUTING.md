# Contributing to TradeOS

Thank you for considering contributing to TradeOS! We welcome contributions from the community.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tradeos.app.git`
3. Create a feature branch: `git checkout -b feat/your-feature`
4. Run setup: `./setup.sh`

## 🏗️ Development Workflow

### Making Changes

1. Make your changes in the appropriate package:
   - `apps/web-admin/` - Web admin dashboard
   - `apps/mobile/` - Mobile application
   - `packages/shared/` - Shared utilities and hooks
   - `infra/supabase/` - Database migrations and functions

2. Follow the coding standards:
   - Use TypeScript
   - Follow existing code style
   - Run `pnpm lint` to check
   - Run `pnpm typecheck` before committing

3. Write tests:
   - Add tests for new features
   - Ensure existing tests pass: `pnpm test`

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Examples:
```
feat: add user authentication
fix: resolve mobile navigation bug
docs: update README with deployment steps
```

### Pull Requests

1. Push to your fork: `git push origin feat/your-feature`
2. Open a Pull Request on GitHub
3. Fill out the PR template
4. Wait for review

**PR Checklist:**
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Commit messages follow convention

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🎨 Code Style

- Use TypeScript for all new code
- Use functional components and hooks in React
- Prefer named exports over default exports
- Use meaningful variable and function names
- Add comments for complex logic

## 📁 Project Structure

```
apps/
  web-admin/   # Next.js admin dashboard
  mobile/      # Expo mobile app
packages/
  shared/      # Shared code
infra/
  supabase/    # Database migrations
```

## 🔒 Security

- Never commit secrets or API keys
- Use `.env.local` for local development
- Report security issues privately to security@tradeos.app

## 🐛 Bug Reports

Use the [GitHub Issues](https://github.com/SMSDAO/tradeos.app/issues) to report bugs.

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots if applicable
- Environment (OS, Node version, etc.)

## 💡 Feature Requests

We welcome feature requests! Open an issue with:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas

## 📚 Resources

- [Project README](README.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev/)

## ❓ Questions

Have questions? Open a [Discussion](https://github.com/SMSDAO/tradeos.app/discussions).

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
