# Local Setup, Build, and Install Guide

This guide provides step-by-step instructions for setting up, building, and installing the Kusto MCP Server locally for development or local use.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Building the Project](#building-the-project)
- [Installing Locally](#installing-locally)
- [Running the Server](#running-the-server)
- [Development Workflow](#development-workflow)
- [Testing Your Installation](#testing-your-installation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

- **Node.js**: Version 16.0.0 or higher
  - Check your version: `node --version`
  - Download from [nodejs.org](https://nodejs.org/)
- **npm**: Version 8.x or higher (usually comes with Node.js)
  - Check your version: `npm --version`

### Recommended

- **Git**: For cloning the repository
  - Check your version: `git --version`
  - Download from [git-scm.com](https://git-scm.com/)
- **Azure CLI**: For authentication (if using Azure CLI auth method)
  - Check your version: `az --version`
  - Install: [Azure CLI Installation Guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

## Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone the repository
git clone https://github.com/johnib/kusto-mcp.git
cd kusto-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run unit tests
npm test

# Install globally for local use
npm link

# Or run directly without installing
node dist/index.js
```

## Detailed Setup Instructions

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/johnib/kusto-mcp.git

# Or using SSH (if you have SSH keys set up)
git clone git@github.com:johnib/kusto-mcp.git

# Navigate to the project directory
cd kusto-mcp
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This command will:
- Download and install all production dependencies
- Download and install all development dependencies
- Set up Git hooks via Husky (for code quality)

**Note**: You may see some deprecation warnings. These are normal and don't affect functionality.

### 3. Configure Environment Variables (Optional)

If you want to customize server behavior, create a `.env` file:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your preferred settings
# (use your favorite text editor)
nano .env
# or
code .env
```

Key configuration options:
- `KUSTO_AUTH_METHOD`: Authentication method (default: `azure-identity`)
- `KUSTO_QUERY_TIMEOUT`: Query timeout in milliseconds (default: `60000`)
- `KUSTO_RESPONSE_FORMAT`: Response format - `json` or `markdown` (default: `json`)

For detailed authentication configuration, see the [Authentication Guide](docs/AUTHENTICATION.md).

## Building the Project

### Standard Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

This command:
- Compiles TypeScript files from `src/` to JavaScript in `dist/`
- Generates type definition files (`.d.ts`)
- Generates source maps for debugging
- Makes the output executable

**Build output location**: `dist/` directory

### Verify Build

Check that the build was successful:

```bash
# List built files
ls -la dist/

# You should see:
# - index.js (main entry point)
# - server.js (server implementation)
# - Various subdirectories (auth/, common/, operations/, types/)
```

## Installing Locally

### Option 1: Global Installation with npm link (Recommended for Development)

This makes the `kusto-mcp` command available globally on your system:

```bash
npm link
```

After linking, you can run the server from anywhere:

```bash
kusto-mcp
```

**Advantages**:
- Easy to test changes - just rebuild and run
- Can be used by AI tools configured to use the global command
- No need to specify the full path

**To unlink later**:

```bash
npm unlink -g kusto-mcp
```

### Option 2: Direct Execution (No Installation)

Run the built server directly without installing:

```bash
node dist/index.js
```

**Advantages**:
- No global installation required
- Good for testing or one-off usage

### Option 3: Install from Local Directory

Install the package from your local directory to another location:

```bash
# From another directory
npm install /path/to/kusto-mcp
```

### Option 4: Pack and Install

Create a tarball and install from it:

```bash
# In the project directory
npm pack

# This creates kusto-mcp-1.9.2.tgz (version may vary)

# Install the tarball globally
npm install -g kusto-mcp-1.9.2.tgz

# Or install it in another project
cd /path/to/another/project
npm install /path/to/kusto-mcp/kusto-mcp-1.9.2.tgz
```

## Running the Server

### Development Mode

Run with auto-reload on file changes:

```bash
npm run dev
```

This uses `ts-node` to run TypeScript files directly without building.

### Production Mode

Run the built version:

```bash
npm start
```

Or if you used `npm link`:

```bash
kusto-mcp
```

### With MCP Inspector (Debugging)

Test and debug the MCP server with the inspector tool:

```bash
npm run inspector
```

This launches the MCP Inspector, which provides a web interface for testing server tools and prompts.

## Development Workflow

### Making Code Changes

1. **Edit source files** in the `src/` directory
2. **Build the project**: `npm run build`
3. **Test your changes**: `npm test`
4. **Run the server**: `npm start` or `node dist/index.js`

### Code Quality Checks

Before committing changes, ensure code quality:

```bash
# Check linting
npm run lint:check

# Fix linting issues automatically
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting issues
npm run format:fix
```

**Note**: Pre-commit hooks automatically run linting and formatting, so manual checks are optional.

### Running Tests

```bash
# Run unit tests
npm test
# or
npm run test:unit

# Run unit tests with coverage
npm run test:unit:coverage

# Run unit tests in watch mode (auto-rerun on changes)
npm run test:unit:watch

# Run end-to-end tests (requires cluster access)
npm run test:e2e

# Run all tests (unit + e2e)
npm run test:all
```

For more information on testing, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

## Testing Your Installation

### 1. Verify the Build

```bash
# Check if the binary is executable
node dist/index.js --version
```

The server should start and display initialization messages.

### 2. Test with MCP Inspector

```bash
npm run inspector
```

This opens a web interface where you can:
- View available tools
- Test tool execution
- See server responses

### 3. Test with an AI Tool

Configure your AI tool (Claude, Cline, Cursor, etc.) to use your local installation:

**For npm link installation:**
```json
{
  "command": "kusto-mcp"
}
```

**For direct execution:**
```json
{
  "command": "node",
  "args": ["/absolute/path/to/kusto-mcp/dist/index.js"]
}
```

### 4. Basic Connection Test

Once configured in an AI tool, ask:

> "Connect to the Kusto help cluster at https://help.kusto.windows.net and show me the tables in the ContosoSales database"

If successful, you should see a list of tables from the public demo cluster.

## Troubleshooting

### Build Issues

#### Error: `Cannot find module 'typescript'`

**Solution**: Install dependencies
```bash
npm install
```

#### Error: `tsc: command not found`

**Solution**: TypeScript is installed locally. Use npm scripts:
```bash
npm run build
```

#### Build succeeds but `dist/` is empty

**Solution**: Check TypeScript configuration
```bash
# Verify tsconfig.json exists
cat tsconfig.json

# Clean and rebuild
rm -rf dist/
npm run build
```

### Installation Issues

#### Error: `EACCES: permission denied` when running `npm link`

**Solution**: Fix npm permissions or use npx:
```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try again
npm link

# Option 2: Use sudo (not recommended)
sudo npm link
```

#### Command not found after `npm link`

**Solution**: Ensure npm global bin directory is in PATH:
```bash
# Check npm global bin directory
npm config get prefix

# Add to PATH (Linux/macOS)
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# For zsh users
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Runtime Issues

#### Error: `Cannot find module` when running the server

**Solution**: Rebuild the project
```bash
npm run build
```

#### Authentication errors

**Solution**: Configure authentication properly

1. For Azure CLI authentication:
   ```bash
   # Login with Azure CLI
   az login
   
   # Set auth method in .env
   echo "KUSTO_AUTH_METHOD=azure-cli" >> .env
   ```

2. For other methods, see [Authentication Guide](docs/AUTHENTICATION.md)

#### Server starts but doesn't respond

**Solution**: Check if it's running in stdio mode (normal for MCP servers)

- MCP servers communicate via stdin/stdout
- They won't show interactive output when run directly
- Use `npm run inspector` to test interactively

### Test Issues

#### Tests fail with module errors

**Solution**: Ensure dependencies are installed and up to date
```bash
npm install
npm test
```

#### E2E tests fail

**Solution**: E2E tests require internet access and connection to Kusto clusters
```bash
# Run only unit tests if you don't have cluster access
npm run test:unit
```

### Still Having Issues?

1. **Check Node version**: Ensure you're using Node.js 16.0.0 or higher
   ```bash
   node --version
   ```

2. **Clear caches and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for conflicting global packages**:
   ```bash
   npm list -g kusto-mcp
   ```

4. **Review logs**: Look for specific error messages in the console output

5. **Get help**:
   - Open an issue: [GitHub Issues](https://github.com/johnib/kusto-mcp/issues)
   - Check existing documentation:
     - [Developer Guide](docs/DEVELOPER.md)
     - [Configuration Guide](docs/CONFIGURATION.md)
     - [Authentication Guide](docs/AUTHENTICATION.md)

## Next Steps

After successful installation:

1. **Read the Configuration Guide**: [docs/CONFIGURATION.md](docs/CONFIGURATION.md)
2. **Set up Authentication**: [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
3. **Start developing**: [docs/DEVELOPER.md](docs/DEVELOPER.md)
4. **Configure your AI tool**: See the main [README.md](README.md) for tool-specific instructions

## Additional Resources

- **Main README**: [README.md](README.md) - Overview and quick start
- **Developer Guide**: [docs/DEVELOPER.md](docs/DEVELOPER.md) - Contributing and development
- **Configuration Guide**: [docs/CONFIGURATION.md](docs/CONFIGURATION.md) - Configuration options
- **Authentication Guide**: [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) - Authentication methods
- **Testing Guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md) - Running and writing tests
- **Changelog**: [CHANGELOG.md](CHANGELOG.md) - Version history and changes
