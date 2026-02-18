// Add Node.js specific Error interface
declare global {
  interface ErrorConstructor {
    captureStackTrace(
      targetObject: object,
      constructorOpt?: new (...args: unknown[]) => unknown,
    ): void;
  }
}

/**
 * Base error class for Kusto MCP server
 */
export class KustoMcpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Use Error.captureStackTrace if available (Node.js environment)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when there's an issue with the Kusto connection
 */
export class KustoConnectionError extends KustoMcpError {
  constructor(message: string) {
    super(`Connection error: ${message}`);
  }
}

/**
 * Error thrown when authentication fails
 */
export class KustoAuthenticationError extends KustoMcpError {
  constructor(message: string) {
    super(`Authentication error: ${message}`);
  }
}

/**
 * Error thrown when a query execution fails
 */
export class KustoQueryError extends KustoMcpError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class KustoResourceNotFoundError extends KustoMcpError {
  constructor(message: string) {
    super(`Resource not found: ${message}`);
  }
}

/**
 * Error thrown when input validation fails
 */
export class KustoValidationError extends KustoMcpError {
  constructor(message: string) {
    super(`Validation error: ${message}`);
  }
}

/**
 * Error thrown when there's an issue with data conversion
 */
export class KustoDataConversionError extends KustoMcpError {
  constructor(message: string) {
    super(`Data conversion error: ${message}`);
  }
}

/**
 * Error thrown when a timeout occurs
 */
export class KustoTimeoutError extends KustoMcpError {
  constructor(message: string) {
    super(`Timeout error: ${message}`);
  }
}

/**
 * Check if an error is a KustoMcpError
 */
export function isKustoMcpError(error: unknown): error is KustoMcpError {
  return error instanceof KustoMcpError;
}

/**
 * Format a Kusto MCP error for display
 */
export function formatKustoMcpError(error: KustoMcpError): string {
  if (error instanceof KustoConnectionError) {
    return `Kusto Connection Error: ${error.message}`;
  } else if (error instanceof KustoAuthenticationError) {
    return `Kusto Authentication Error: ${error.message}`;
  } else if (error instanceof KustoQueryError) {
    return `Kusto Query Error: ${error.message}`;
  } else if (error instanceof KustoResourceNotFoundError) {
    return `Kusto Resource Not Found: ${error.message}`;
  } else if (error instanceof KustoValidationError) {
    return `Kusto Validation Error: ${error.message}`;
  } else if (error instanceof KustoDataConversionError) {
    return `Kusto Data Conversion Error: ${error.message}`;
  } else if (error instanceof KustoTimeoutError) {
    return `Kusto Timeout Error: ${error.message}`;
  } else {
    return `Kusto Error: ${error.message}`;
  }
}

/**
 * Sanitize error messages to prevent information disclosure
 * Removes sensitive information like internal paths, credentials, or detailed cluster info
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof KustoMcpError) {
    // For our custom errors, use the formatted message
    return formatKustoMcpError(error);
  }

  // For other errors, sanitize the message
  const message =
    error instanceof Error ? error.message : String(error || 'Unknown error');

  // Remove URLs and sensitive patterns
  const sanitized = message
    .replace(/https?:\/\/[^\s]+/g, '[URL]') // Remove URLs
    .replace(/Bearer\s+[^\s]+/gi, '[TOKEN]') // Remove bearer tokens
    .replace(/password[=:]\s*[^\s]+/gi, 'password=[REDACTED]') // Remove passwords
    .replace(/key[=:]\s*[^\s]+/gi, 'key=[REDACTED]') // Remove API keys
    .replace(/secret[=:]\s*[^\s]+/gi, 'secret=[REDACTED]'); // Remove secrets

  // If message contains auth-related errors, generalize them
  if (/authentication|unauthorized|forbidden|access denied/i.test(sanitized)) {
    return 'Authentication failed. Please verify your credentials and permissions.';
  }

  // If message contains connection errors with details, generalize them
  if (/connection|network|timeout|ECONNREFUSED|ETIMEDOUT/i.test(sanitized)) {
    return 'Connection failed. Please verify the cluster URL and network connectivity.';
  }

  return sanitized;
}
