export type ErrorCode =
  | 'REQUEST_TIMEOUT'
  | 'AUTH_FAILED'
  | 'AUTH_BROWSER_FAILED'
  | 'API_ERROR'
  | 'UNKNOWN_COMMAND'
  | 'MISSING_ARGUMENT'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

const ERROR_MATCHERS = [
  [/invalid_request/, 'INVALID_REQUEST'],
  [/^Unknown command: (.*)$/, 'UNKNOWN_COMMAND'],
  [/^Missing required argument: (.*)$/, 'MISSING_ARGUMENT'],
  [/^Failed to open web browser. (.*)$/, 'AUTH_BROWSER_FAILED'],
] as const;

export const isAuthenticationError = (error: unknown): boolean => {
  if (!error) return false;

  // Check if it's an axios error with invalid_request
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    return message.toLowerCase().includes('invalid_request');
  }
  return false;
};

export const matchErrorCode = (message?: string): ErrorCode => {
  if (!message) {
    return 'UNKNOWN_ERROR';
  }
  for (const [matcher, code] of ERROR_MATCHERS) {
    const match = message.match(matcher);
    if (match) {
      return code;
    }
  }
  return 'UNKNOWN_ERROR';
};
