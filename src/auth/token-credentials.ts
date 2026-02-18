import {
  AzureCliCredential,
  ClientCertificateCredential,
  ClientSecretCredential,
  DefaultAzureCredential,
  DeviceCodeCredential,
  EnvironmentCredential,
  InteractiveBrowserCredential,
  ManagedIdentityCredential,
  TokenCredential,
  UsernamePasswordCredential,
} from '@azure/identity';
import { KustoAuthenticationError } from '../common/errors.js';
import { criticalLog, debugLog } from '../common/utils.js';

/**
 * Factory function to create a TokenCredential based on the authentication method
 *
 * @param method The authentication method to use
 * @returns A TokenCredential instance
 */
export function createTokenCredential(
  method: string = 'azure-identity',
): TokenCredential {
  try {
    switch (method.toLowerCase()) {
      case 'azure-cli':
        debugLog('Using Azure CLI authentication');
        return new AzureCliCredential();

      case 'azure-identity':
        debugLog(
          'Using Azure Identity (DefaultAzureCredential) authentication',
        );
        return new DefaultAzureCredential();

      case 'managed-identity': {
        debugLog('Using Managed Identity authentication');
        const clientId = process.env.AZURE_CLIENT_ID;
        return new ManagedIdentityCredential(
          clientId ? { clientId } : undefined,
        );
      }

      case 'client-secret': {
        debugLog('Using Client Secret authentication');
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;
        const clientSecret = process.env.AZURE_CLIENT_SECRET;

        if (!tenantId || !clientId || !clientSecret) {
          throw new KustoAuthenticationError(
            'Client Secret authentication requires AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET environment variables',
          );
        }

        return new ClientSecretCredential(tenantId, clientId, clientSecret);
      }

      case 'client-certificate': {
        debugLog('Using Client Certificate authentication');
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;
        const certificatePath = process.env.AZURE_CLIENT_CERTIFICATE_PATH;
        const certificatePassword =
          process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;

        if (!tenantId || !clientId || !certificatePath) {
          throw new KustoAuthenticationError(
            'Client Certificate authentication requires AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_CERTIFICATE_PATH environment variables',
          );
        }

        const certificateConfig = {
          certificatePath,
          ...(certificatePassword && { certificatePassword }),
        };

        return new ClientCertificateCredential(
          tenantId,
          clientId,
          certificateConfig,
        );
      }

      case 'interactive-browser': {
        debugLog('Using Interactive Browser authentication');
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;

        return new InteractiveBrowserCredential({
          tenantId,
          clientId,
        });
      }

      case 'device-code': {
        debugLog('Using Device Code authentication');
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;

        return new DeviceCodeCredential({
          tenantId,
          clientId,
          userPromptCallback: info => {
            criticalLog(info.message);
          },
        });
      }

      case 'username-password': {
        debugLog('Using Username/Password authentication');
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;
        const username = process.env.AZURE_USERNAME;
        const password = process.env.AZURE_PASSWORD;

        if (!tenantId || !clientId || !username || !password) {
          throw new KustoAuthenticationError(
            'Username/Password authentication requires AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_USERNAME, and AZURE_PASSWORD environment variables',
          );
        }

        return new UsernamePasswordCredential(
          tenantId,
          clientId,
          username,
          password,
        );
      }

      case 'environment':
        debugLog('Using Environment Credential authentication');
        return new EnvironmentCredential();

      default:
        throw new KustoAuthenticationError(
          `Unsupported authentication method: ${method}. Supported methods: azure-cli, azure-identity, managed-identity, client-secret, client-certificate, interactive-browser, device-code, username-password, environment`,
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    criticalLog(`Failed to create token credential: ${errorMessage}`);
    throw new KustoAuthenticationError(
      `Failed to create token credential: ${errorMessage}`,
    );
  }
}
