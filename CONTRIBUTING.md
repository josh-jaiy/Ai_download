# Contributing to AI Download Manager

Thank you for your interest in contributing to the AI Download Manager project! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   \`\`\`bash
   git clone https://github.com/yourusername/ai-download-manager.git
   cd ai-download-manager
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

4. Set up environment variables:
   Create a `.env.local` file in the root directory with the necessary variables.

5. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

## Development Workflow

1. Create a new branch for your feature or bugfix:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   \`\`\`

2. Make your changes, following the [coding standards](#coding-standards)

3. Commit your changes with clear, descriptive commit messages:
   \`\`\`bash
   git commit -m "Add feature: description of your feature"
   \`\`\`

4. Push your branch to your fork:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

5. Create a Pull Request from your fork to the main repository

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if necessary
3. Include tests for new features
4. Ensure all tests pass
5. Link any relevant issues in your Pull Request description
6. Request a review from one of the project maintainers
7. Address any feedback from reviewers

## Coding Standards

This project follows specific coding standards to maintain consistency:

### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow the ESLint configuration provided in the project
- Use functional components with React Hooks
- Maintain proper type definitions

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the project's design system
- Ensure responsive design for all components

### Component Structure

- Create reusable components in the `components/` directory
- Use appropriate naming conventions:
  - PascalCase for component files and function names
  - camelCase for variables and props
  - kebab-case for CSS class names

## Testing

- Write tests for all new features
- Ensure existing tests pass before submitting a Pull Request
- Use Jest and React Testing Library for component tests

To run tests:

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## Documentation

- Update documentation for any changes to the API or features
- Document complex logic with clear comments
- Use JSDoc comments for functions and components
- Keep the README and other documentation files up to date

## Community

- Join our Discord server for discussions
- Participate in issue discussions on GitHub
- Help answer questions from other contributors
- Share your ideas for improving the project

---

Thank you for contributing to AI Download Manager!
