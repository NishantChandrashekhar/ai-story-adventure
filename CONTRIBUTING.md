# Contributing to AI Story Adventure

Thank you for your interest in contributing to the AI Story Adventure project! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-story-adventure.git
   cd ai-story-adventure
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Running the Project

1. Build the TypeScript files:
   ```bash
   npm run build
   ```

2. Start the development server:
   ```bash
   npm run serve
   ```

3. Open `http://localhost:8000` in your browser

### Development Mode

For development with auto-recompilation:
```bash
npm run dev
```

## Making Changes

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Structure

- `script.ts` - Main application logic
- `openai-service.ts` - OpenAI API integration
- `config.ts` - Configuration settings
- `style.css` - Styling
- `index.html` - Main HTML file

### Testing Your Changes

1. Build the project: `npm run build`
2. Test locally: `npm run serve`
3. Ensure the application works as expected
4. Check for any console errors

## Submitting Changes

1. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add new feature: description of what you added"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request on GitHub

### Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots if UI changes are made
- Reference any related issues
- Ensure all CI checks pass

## Issue Reporting

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Any error messages from the console

## Feature Requests

When suggesting new features:

- Explain the use case
- Describe the expected behavior
- Consider the impact on existing functionality
- Provide examples if possible

## Security

- Never commit API keys or sensitive information
- The `config.ts` file is already in `.gitignore`
- Use environment variables for production deployments

## Questions?

If you have questions about contributing, feel free to:

1. Open an issue on GitHub
2. Check the existing documentation
3. Review the codebase for examples

Thank you for contributing to AI Story Adventure! 🚀 