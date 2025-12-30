# Contributing to Activepieces MCP

Thank you for your interest in contributing to Activepieces MCP! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Include details**:
   - Your environment (OS, Node.js version, etc.)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and logs

### Suggesting Features

1. **Check existing feature requests** first
2. **Describe the use case** clearly
3. **Explain the benefit** to users
4. **Provide examples** if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

## 🏗️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker (optional, for testing containers)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/activepieces-mcp.git
cd activepieces-mcp

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your test credentials

# Build the project
npm run build

# Run in development mode
npm run dev
```

## 📝 Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types that might be reused

### Naming Conventions

- **Files**: kebab-case (`api-client.ts`)
- **Classes**: PascalCase (`ActivepiecesClient`)
- **Functions**: camelCase (`listFlows`)
- **Constants**: UPPER_SNAKE_CASE (`API_VERSION`)
- **Interfaces**: PascalCase (`FlowVersion`)

### Code Organization

```typescript
// 1. Imports
import { Something } from './somewhere';

// 2. Types/Interfaces
export interface MyInterface {
  // ...
}

// 3. Constants
const MY_CONSTANT = 'value';

// 4. Functions/Classes
export class MyClass {
  // ...
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- path/to/test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from '@jest/globals';
import { ActivepiecesClient } from '../src/api/client';

describe('ActivepiecesClient', () => {
  it('should create client with config', () => {
    const client = new ActivepiecesClient({
      apiUrl: 'https://test.com/api/v1',
      apiKey: 'test-key',
    });
    expect(client).toBeDefined();
  });
});
```

## 🔧 Adding New Tools

### Step 1: Define the Tool

Edit `src/mcp/tools.ts`:

```typescript
export const myNewTool: Tool = {
  name: 'my_new_tool',
  description: 'Description of what this tool does',
  inputSchema: z.object({
    param1: z.string().describe('Description of param1'),
    param2: z.number().optional().describe('Optional param2'),
  }),
  handler: async (client, args) => {
    // Implementation
    const result = await client.someMethod(args.param1);
    return {
      success: true,
      data: result,
      message: 'Operation completed successfully',
    };
  },
};
```

### Step 2: Add to Tool List

```typescript
export const allTools: Tool[] = [
  // ... existing tools
  myNewTool,
];
```

### Step 3: Add API Method (if needed)

Edit `src/api/client.ts`:

```typescript
async someMethod(param: string): Promise<SomeType> {
  const response = await this.client.get<SomeType>(`/endpoint/${param}`);
  return response.data;
}
```

### Step 4: Add Types (if needed)

Edit `src/types/activepieces.ts`:

```typescript
export interface SomeType {
  id: string;
  name: string;
  // ... other fields
}
```

### Step 5: Update Documentation

Update `README.md` to include your new tool in the "Available Tools" section.

## 📚 Documentation

### Updating Documentation

- **README.md**: Main documentation
- **DEPLOYMENT.md**: Deployment guides
- **QUICKSTART.md**: Quick start guide
- **Code comments**: Inline documentation

### Documentation Style

- Use clear, concise language
- Include code examples
- Add troubleshooting tips
- Keep formatting consistent

## 🔍 Code Review Process

### What We Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it clean and maintainable?
3. **Tests**: Are there adequate tests?
4. **Documentation**: Is it well documented?
5. **Performance**: Is it efficient?
6. **Security**: Are there any security concerns?

### Review Timeline

- Initial review: Within 3-5 days
- Follow-up reviews: Within 2-3 days
- Merge: After approval from maintainers

## 🐛 Debugging

### Enable Debug Logging

```bash
# Set log level to debug
export LOG_LEVEL=debug
export DISABLE_CONSOLE_OUTPUT=false

# Run the server
npm start
```

### Common Issues

1. **API Connection Errors**
   - Check API URL format
   - Verify API key
   - Test network connectivity

2. **Build Errors**
   - Clear dist folder: `npm run clean`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript version

3. **Runtime Errors**
   - Check environment variables
   - Verify Activepieces instance is accessible
   - Review error logs

## 📦 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Creating a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release
6. Publish to NPM: `npm publish`

## 🎨 Design Principles

### Code Principles

1. **Simplicity**: Keep it simple and readable
2. **Modularity**: Break down into reusable components
3. **Type Safety**: Use TypeScript features fully
4. **Error Handling**: Handle errors gracefully
5. **Performance**: Optimize where it matters

### API Design

1. **Consistency**: Follow existing patterns
2. **Clarity**: Clear function and parameter names
3. **Documentation**: Document all public APIs
4. **Validation**: Validate inputs with Zod
5. **Error Messages**: Provide helpful error messages

## 🤔 Questions?

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For specific problems
- **Email**: [maintainer email]

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## 🙏 Recognition

Contributors will be:

- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Activepieces MCP! 🎉
