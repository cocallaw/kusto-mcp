# Authentication Guide

This guide provides comprehensive information about all authentication methods supported by the Kusto MCP Server for connecting to Azure Data Explorer (Kusto) clusters.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Authentication Methods](#authentication-methods)
  - [DefaultAzureCredential (Recommended)](#defaultazurecredential-recommended)
  - [Azure CLI](#azure-cli)
  - [Managed Identity](#managed-identity)
  - [Service Principal with Client Secret](#service-principal-with-client-secret)
  - [Service Principal with Client Certificate](#service-principal-with-client-certificate)
  - [Interactive Browser](#interactive-browser)
  - [Device Code](#device-code)
  - [Username and Password](#username-and-password)
  - [Environment Variables](#environment-variables)
- [Entra ID / Azure AD Scenarios](#entra-id--azure-ad-scenarios)
- [Troubleshooting](#troubleshooting)

## Overview

The Kusto MCP Server uses the Azure Identity library (`@azure/identity`) to authenticate with Azure Data Explorer clusters. This provides flexible authentication options suitable for different scenarios, from local development to production deployments.

## Quick Start

### For Local Development (Recommended)

The easiest way to get started is using Azure CLI authentication:

```bash
# Install Azure CLI (if not already installed)
# Windows: winget install Microsoft.AzureCLI
# macOS: brew install azure-cli
# Linux: See https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux

# Login to Azure
az login

# Configure the MCP server to use Azure CLI
# In your .env file:
KUSTO_AUTH_METHOD=azure-cli
```

### For Production / Automated Scenarios

Use `azure-identity` (DefaultAzureCredential) which automatically tries multiple authentication methods:

```bash
# In your .env file:
KUSTO_AUTH_METHOD=azure-identity
```

## Authentication Methods

### DefaultAzureCredential (Recommended)

**Method:** `azure-identity`  
**Best for:** Production environments, CI/CD pipelines, automated scenarios

DefaultAzureCredential automatically attempts multiple authentication methods in the following order:

1. **Environment Variables** - Uses credentials from environment variables
2. **Managed Identity** - Uses system or user-assigned managed identity
3. **Visual Studio Code** - Uses the account signed into VS Code
4. **Azure CLI** - Uses the account signed into Azure CLI
5. **Azure PowerShell** - Uses the account signed into Azure PowerShell
6. **Azure Developer CLI** - Uses the account signed into Azure Developer CLI
7. **Interactive Browser** - Opens a browser for interactive authentication (if enabled)

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=azure-identity
```

**When to use:**
- Production environments where multiple auth methods might be available
- CI/CD pipelines with managed identities or service principals
- Developer environments where you want flexibility
- When you're not sure which authentication method will be available

### Azure CLI

**Method:** `azure-cli`  
**Best for:** Local development, interactive scenarios

Uses the account currently signed into Azure CLI. This is the simplest method for local development.

**Prerequisites:**
```bash
az login
# Or for specific tenant:
az login --tenant YOUR_TENANT_ID
```

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=azure-cli
```

**When to use:**
- Local development and testing
- When you're already using Azure CLI for other tasks
- Quick prototyping and exploration
- When you need to easily switch between Azure accounts

### Managed Identity

**Method:** `managed-identity`  
**Best for:** Azure-hosted applications (VMs, App Services, Azure Functions, AKS)

Uses the managed identity assigned to your Azure resource. No credentials need to be stored or managed.

**Prerequisites:**
- Enable system-assigned or user-assigned managed identity on your Azure resource
- Grant the managed identity appropriate permissions on the Kusto cluster

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=managed-identity

# For user-assigned managed identity, also set:
AZURE_CLIENT_ID=your-managed-identity-client-id
```

**When to use:**
- Applications running on Azure VMs, App Services, or Azure Functions
- Kubernetes workloads in AKS with workload identity
- When you want to avoid storing credentials
- Production environments for maximum security

### Service Principal with Client Secret

**Method:** `client-secret`  
**Best for:** Automated services, CI/CD pipelines, non-Azure environments

Uses an Azure Active Directory application (service principal) with a client secret.

**Prerequisites:**
- Create an Azure AD application and service principal
- Generate a client secret for the application
- Grant the service principal permissions on the Kusto cluster

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

**When to use:**
- Automated services and applications
- CI/CD pipelines
- Applications running outside Azure
- When you need non-interactive authentication

### Service Principal with Client Certificate

**Method:** `client-certificate`  
**Best for:** High-security environments, compliance requirements

Uses an Azure AD application with a certificate instead of a client secret. More secure than client secrets.

**Prerequisites:**
- Create an Azure AD application and service principal
- Generate and upload a certificate to the application
- Grant the service principal permissions on the Kusto cluster

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=client-certificate
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_CERTIFICATE_PATH=/path/to/certificate.pem
# Optional: if certificate has a password
AZURE_CLIENT_CERTIFICATE_PASSWORD=your-cert-password
```

**When to use:**
- Organizations with strict security or compliance requirements
- When client secrets are not allowed by security policy
- Long-running production services
- When certificate rotation is preferred over secret rotation

### Interactive Browser

**Method:** `interactive-browser`  
**Best for:** Desktop applications with UI, initial setup

Opens a browser window for interactive authentication. Provides the most user-friendly experience for first-time setup.

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=interactive-browser
AZURE_TENANT_ID=your-tenant-id  # Optional: specify tenant
AZURE_CLIENT_ID=your-client-id  # Optional: specify app
```

**When to use:**
- Desktop applications with a user interface
- Initial setup and configuration scenarios
- When users need to authenticate with their own accounts
- Development environments where Azure CLI is not available

### Device Code

**Method:** `device-code`  
**Best for:** Headless environments, SSH sessions, containers

Provides a code that users enter on another device (e.g., phone or laptop) to authenticate. Ideal for environments without a browser.

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=device-code
AZURE_TENANT_ID=your-tenant-id  # Optional: specify tenant
AZURE_CLIENT_ID=your-client-id  # Optional: specify app
```

**When to use:**
- SSH sessions or terminal-only environments
- Containers without browser access
- IoT devices
- Remote servers without display

### Username and Password ⚠️

**Method:** `username-password`  
**Best for:** Legacy systems, specific testing scenarios  
**⚠️ WARNING: Not recommended for production use.** Only works with accounts that do not have MFA enabled.

Uses a username and password for authentication.

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=username-password
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_USERNAME=your-username
AZURE_PASSWORD=your-password
```

**When to use:**
- Legacy systems that require this method
- Specific testing scenarios
- **Note:** Not compatible with accounts that have multi-factor authentication (MFA) enabled

### Environment Variables

**Method:** `environment`  
**Best for:** Reading credentials from environment variables

Reads credentials from standard Azure environment variables. Works with service principals (both secret and certificate-based).

**Configuration:**

```bash
# .env file
KUSTO_AUTH_METHOD=environment

# For client secret:
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# OR for client certificate:
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_CERTIFICATE_PATH=/path/to/certificate.pem
```

**When to use:**
- When credentials are already set in your environment
- Docker containers with environment variable injection
- Cloud platforms that inject credentials as environment variables
- Kubernetes secrets mounted as environment variables

## Entra ID / Azure AD Scenarios

### Scenario: Different Account for Kusto vs CLI

**Problem:** Your organization uses Entra ID (Azure AD) for Kusto cluster authentication, but the account you use to connect to Kusto is different from your Azure CLI account.

**Solutions:**

#### Option 1: Use Interactive Browser Authentication

This allows you to authenticate with the specific account needed for Kusto:

```bash
# .env file
KUSTO_AUTH_METHOD=interactive-browser
AZURE_TENANT_ID=your-kusto-tenant-id
```

When you connect to a cluster, a browser window will open and you can sign in with your Kusto account.

#### Option 2: Use Device Code Authentication

For environments without a browser (like SSH sessions):

```bash
# .env file
KUSTO_AUTH_METHOD=device-code
AZURE_TENANT_ID=your-kusto-tenant-id
```

You'll receive a code to enter on another device, allowing you to authenticate with your Kusto account.

#### Option 3: Create a Service Principal for Kusto

Best for automated or programmatic access:

1. Create a service principal in your Kusto tenant
2. Grant it permissions on your Kusto cluster
3. Use client-secret or client-certificate authentication:

```bash
# .env file
KUSTO_AUTH_METHOD=client-secret
AZURE_TENANT_ID=your-kusto-tenant-id
AZURE_CLIENT_ID=your-service-principal-client-id
AZURE_CLIENT_SECRET=your-client-secret
```

#### Option 4: Use Azure CLI with Specific Tenant

If you can use Azure CLI but need to authenticate to a different tenant:

```bash
# Login to the specific tenant where your Kusto cluster is
az login --tenant YOUR_KUSTO_TENANT_ID

# Then use Azure CLI authentication
# .env file
KUSTO_AUTH_METHOD=azure-cli
```

### Scenario: Multiple Kusto Clusters with Different Auth

If you need to connect to multiple Kusto clusters with different authentication requirements, you can:

1. **Switch authentication methods** by changing the `KUSTO_AUTH_METHOD` environment variable
2. **Use DefaultAzureCredential** (`azure-identity`) and configure environment variables per cluster
3. **Use different profiles or sessions** for different clusters

### Scenario: Cross-Tenant Authentication

For scenarios where your identity is in one tenant but the Kusto cluster is in another:

1. **Guest user access:** Have your account added as a guest user in the Kusto tenant
2. **Service principal:** Create a service principal in the Kusto tenant
3. **Azure CLI with tenant specification:** Use `az login --tenant`

## Troubleshooting

### Authentication Failures

**Error:** "Authentication failed" or "No suitable credential found"

**Solutions:**
1. Verify you're using the correct authentication method for your environment
2. Check that credentials are valid and not expired
3. Ensure the account has permissions on the Kusto cluster
4. Verify tenant ID is correct if specified

### Permission Denied

**Error:** "Permission denied" or "Unauthorized"

**Solutions:**
1. Verify the authenticated identity has appropriate permissions on the Kusto cluster
2. Check the cluster's access control settings in Azure Portal
3. Ensure the identity has at least "Viewer" role on the database
4. For queries that modify data, ensure "User" or "Admin" role is assigned

### Token Expired

**Error:** "Token expired" or "Token refresh failed"

**Solutions:**
1. For Azure CLI: Run `az login` again
2. For interactive methods: Re-authenticate when prompted
3. For service principals: Verify the client secret hasn't expired
4. Check system clock is synchronized

### Wrong Tenant

**Error:** "The token is from the wrong tenant"

**Solutions:**
1. Set the correct `AZURE_TENANT_ID` environment variable
2. For Azure CLI: Use `az login --tenant YOUR_TENANT_ID`
3. Verify the Kusto cluster is in the expected tenant

### MFA Required

**Error:** "Multi-factor authentication is required"

**Solutions:**
1. Use interactive authentication methods (interactive-browser or device-code)
2. For service principals, MFA doesn't apply
3. Don't use username-password authentication with MFA-enabled accounts

### Environment Variables Not Working

**Error:** Credentials not found when using environment variables

**Solutions:**
1. Verify environment variables are set correctly (use `printenv` or `echo $VAR_NAME`)
2. Restart the application after setting environment variables
3. Check for typos in variable names
4. Ensure `.env` file is in the correct location

## Testing Authentication

To test if your authentication is working correctly:

1. Start the Kusto MCP server with your configured authentication method
2. Try to connect to a Kusto cluster
3. Execute a simple query like `print now()`

If successful, you should see the current timestamp returned. If not, check the error messages and refer to the troubleshooting section above.

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use managed identities** when running on Azure
3. **Rotate secrets regularly** for service principals
4. **Use certificates over secrets** when possible
5. **Apply least privilege** - grant only necessary permissions
6. **Enable MFA** for user accounts
7. **Monitor authentication logs** for suspicious activity
8. **Use environment variables or secure vaults** for credentials

## Additional Resources

- [Azure Identity Documentation](https://learn.microsoft.com/en-us/javascript/api/overview/azure/identity-readme)
- [Azure Data Explorer Documentation](https://learn.microsoft.com/en-us/azure/data-explorer/)
- [Azure AD Authentication Best Practices](https://learn.microsoft.com/en-us/azure/active-directory/develop/identity-platform-integration-checklist)
- [Managed Identity Documentation](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
