# 🔍 Kusto MCP Server

[![CI](https://github.com/johnib/kusto-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/johnib/kusto-mcp/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/kusto-mcp.svg)](https://badge.fury.io/js/kusto-mcp)
[![npm downloads](https://img.shields.io/npm/dm/kusto-mcp.svg)](https://www.npmjs.com/package/kusto-mcp)

**Turn your AI assistant into a data analyst in 2 minutes.**

Connect Cline, Cursor, Claude Desktop, or any AI tool to Azure Data Explorer. Ask questions in plain English, get insights from your data instantly - no KQL knowledge required.

## What You Can Do

- **"Show me error logs from the last hour"** → Get instant insights from telemetry data
- **"Which customers generated the most revenue this month?"** → Analyze business metrics effortlessly
- **"Find all failed authentication attempts"** → Investigate security incidents with AI help
- **"Summarize system performance trends"** → Get automated analysis of monitoring data

No more writing complex KQL queries. Just ask your AI assistant natural questions about your data.

## Quick Setup

### For Claude Code Users

Run this terminal command to install:

```bash
claude mcp add kusto-mcp -- npx -y kusto-mcp@latest
```

### For Cline Users

Add this to your `cline_mcp_settings.json` file:

```json
{
  "mcpServers": {
    "github.com/johnib/kusto-mcp": {
      "command": "npx",
      "args": ["-y", "kusto-mcp@latest"],
      "env": {},
      "disabled": false,
      "autoApprove": [
        "initialize-connection",
        "show-tables",
        "show-table",
        "execute-query"
      ]
    }
  }
}
```

### For Cursor Users

Add this to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "github.com/johnib/kusto-mcp": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "kusto-mcp"]
      }
    }
  }
}
```

### For Claude Desktop Users

Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "kusto-mcp": {
      "command": "npx",
      "args": ["-y", "kusto-mcp"]
    }
  }
}
```

## Authentication Setup

The Kusto MCP Server supports multiple authentication methods to accommodate different scenarios - from local development to production deployments, and from personal accounts to service principals.

### Quick Start (Local Development)

1. **Install Azure CLI** (if you haven't already):

   ```bash
   # Windows
   winget install Microsoft.AzureCLI
   
   # macOS
   brew install azure-cli
   
   # Linux
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

2. **Login to Azure**:

   ```bash
   az login
   ```

3. **That's it!** Your AI assistant can now connect to your Azure Data Explorer clusters.

### Alternative Authentication Methods

If you need to use a different account for Kusto than your CLI login, or if you're in a production/automated environment, we support several additional authentication methods:

- **DefaultAzureCredential** - Automatically tries multiple authentication methods (recommended for production)
- **Managed Identity** - For Azure-hosted applications (VMs, App Services, AKS)
- **Service Principal** - For automated services and CI/CD pipelines (with client secret or certificate)
- **Interactive Browser** - Opens a browser for authentication (useful when your Kusto account differs from CLI)
- **Device Code** - For headless/SSH environments
- **Username/Password** - For legacy systems (not recommended)
- **Environment Variables** - Reads credentials from environment variables

📘 **For detailed information about all authentication methods and configuration options, see our [Authentication Guide](docs/AUTHENTICATION.md).**

### Quick Examples

**Using a different account for Kusto (Interactive):**
```bash
# In your .env file:
KUSTO_AUTH_METHOD=interactive-browser
AZURE_TENANT_ID=your-kusto-tenant-id
```

**Using Service Principal (CI/CD):**
```bash
# In your .env file:
KUSTO_AUTH_METHOD=client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

**Using Managed Identity (Azure VM/App Service):**
```bash
# In your .env file:
KUSTO_AUTH_METHOD=managed-identity
```

## Test It Works

Ask your AI assistant:

> "Connect to my Azure Data Explorer cluster at `https://your-cluster.kusto.windows.net` and show me the available tables"

You should see your AI successfully connect and list your database tables.

## Supported AI Tools

- ✅ **Claude Code** - One-command setup with native MCP support
- ✅ **Cline** - Full support with auto-approval
- ✅ **Cursor** - Complete integration
- ✅ **Claude Desktop** - Native MCP support
- ✅ **VS Code with MCP** - Built-in compatibility
- ✅ **Any MCP-compatible tool** - Universal support

## Common Issues

**🔒 Permission denied?**

- Run `az login` and make sure you have access to the Azure Data Explorer cluster
- Verify you're logged into the correct Azure tenant

**🔌 Can't connect to cluster?**

- Double-check the cluster URL format: `https://your-cluster.kusto.windows.net`
- Ensure the cluster is accessible from your network

**❓ AI doesn't see the tools?**

- Restart your AI assistant after adding the configuration
- Check that the JSON configuration is valid (use a JSON validator)

**Still stuck?** → [Open an issue](https://github.com/johnib/kusto-mcp/issues) or check our [troubleshooting guide](docs/CONFIGURATION.md#troubleshooting-configuration).

## What's Under the Hood

This MCP server provides your AI assistant with tools to:

- Initialize connections to Azure Data Explorer clusters
- Browse database tables and schemas
- Execute KQL queries with intelligent result limiting
- Handle authentication securely through Azure CLI

Results are automatically formatted and sized appropriately for AI context windows, so your assistant gets the data it needs without being overwhelmed.

## Advanced Configuration

Need custom settings? Check out our [Configuration Guide](docs/CONFIGURATION.md) for:

- Response format options (JSON vs Markdown)
- Query timeout settings
- Result size limiting
- OpenTelemetry integration

## For Developers

Building, testing, or contributing? See our [Developer Documentation](docs/DEVELOPER.md) for:

- Building from source
- Running tests
- Project structure
- Contributing guidelines

## License

[MIT](LICENSE)

---

**💡 Pro tip**: Start by asking your AI to "show me the tables in my database" to explore what data you have available, then ask natural language questions about specific tables.
