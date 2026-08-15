# Next.js SaaS Starter

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0"/>
  <img src="https://img.shields.io/badge/node.js-20+-green.svg" alt="Node.js 20+"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"/>
  <img src="https://img.shields.io/badge/MCP-1.0-purple.svg" alt="MCP 1.0"/>
</p>

A production-ready SaaS starter template built with Node.js and the Model Context Protocol. Provides a solid foundation for building scalable SaaS applications with MCP server integration, Zod validation, and enterprise-grade tooling.

## What's Included

- Node.js MCP server with Zod validation
- SaaS application structure and patterns
- GitHub Actions CI workflow
- Multi-stage Dockerfile with health checks
- ESLint + Prettier code quality setup
- Jest test suite for ES Modules

## Features

- **MCP Integration**: Fully compliant Model Context Protocol server
- **SaaS Architecture**: Scalable application structure
- **Zod Validation**: Runtime type safety for all inputs
- **ES Module Support**: Modern JavaScript with import/export
- **Testing**: Jest configured for ES modules
- **Code Quality**: ESLint + Prettier enforced standards
- **Dockerized**: Multi-stage Dockerfile with HEALTHCHECK
- **CI/CD Ready**: GitHub Actions workflow
- **Cross-Platform**: Works on Linux, macOS, and Windows

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/amanhammadK/next-js-saas-starter.git
cd next-js-saas-starter

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### Running

```bash
# Start the server
npm start
```

### Testing

```bash
# Run tests
npm test
```

### Linting

```bash
# Lint source code
npm run lint
```

## Project Structure

```
next-js-saas-starter/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── src/
│   ├── index.js                # Server entry point
│   ├── mcpServer.js            # MCP server implementation
│   └── schemas.js              # Zod validation schemas
├── tests/
│   └── template.test.js        # Test suite
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── Dockerfile                 # Multi-stage Docker build
├── eslint.config.js           # ESLint configuration
├── jest.config.js             # Jest configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode (development/production) | No |
| `PORT` | Server port (default: 3000) | No |
| `MCP_SERVER_NAME` | MCP server identifier | No |

### SaaS Configuration

The server structure supports multi-tenancy, user authentication, and billing integration patterns. Extend the MCP server with custom tools and resources for your SaaS domain.

## Deployment

### Docker

```bash
# Build the image
docker build -t next-js-saas-starter .

# Run the container
docker run -p 3000:3000 --env-file .env next-js-saas-starter
```

### Cloud Platforms

- **AWS ECS**: Container orchestration with auto-scaling
- **Google Cloud Run**: Serverless container hosting
- **Railway**: Auto-deploy from GitHub
- **Render**: Web service deployment

## Development Guide

### Adding a New MCP Tool

```javascript
// src/schemas.js
export const ToolSchema = z.object({
    action: z.string(),
    payload: z.record(z.any())
});

// src/mcpServer.js
server.tool("custom_tool", ToolSchema.shape, async (input) => {
    // Implement tool logic
    return { result: "success" };
});
```

### Code Style

- ESLint with recommended config
- Prettier for consistent formatting
- ES module syntax throughout
- Run `npm run lint` before committing

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with Node.js and ❤️
</p>