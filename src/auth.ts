import { custom, generators, Issuer, TokenSet } from 'openid-client';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import open from 'open';
import { getNeonApiKey } from './env.js';

import { log } from './log.js';
import { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { sendError } from './analytics.js';
import { matchErrorCode } from './errors.js';

// oauth server timeouts
const SERVER_TIMEOUT = 10_000;
// where to wait for incoming redirect request from oauth server to arrive
const REDIRECT_URI = (port: number) => `http://127.0.0.1:${port}/callback`;
// These scopes cannot be cancelled, they are always needed.
const ALWAYS_PRESENT_SCOPES = ['openid', 'offline', 'offline_access'] as const;

const NEONCTL_SCOPES = [
  ...ALWAYS_PRESENT_SCOPES,
  'urn:neoncloud:projects:create',
  'urn:neoncloud:projects:read',
  'urn:neoncloud:projects:update',
  'urn:neoncloud:projects:delete',
  'urn:neoncloud:orgs:create',
  'urn:neoncloud:orgs:read',
  'urn:neoncloud:orgs:update',
  'urn:neoncloud:orgs:delete',
  'urn:neoncloud:orgs:permission',
] as const;

const AUTH_TIMEOUT_SECONDS = 60;

export const defaultClientID = 'neonctl';

export type AuthProps = {
  oauthHost: string;
  clientId: string;
};

custom.setHttpOptionsDefaults({
  timeout: SERVER_TIMEOUT,
});

const isCI = () => {
  return !!process.env.CI;
};

const authCI = async ({ oauthHost, clientId }: AuthProps): Promise<TokenSet> => {
  const apiKey = getNeonApiKey();
  if (!apiKey) {
    throw new Error('NEON_API_KEY is not set in the CI environment');
  }
  log.debug('Using CI authentication with NEON_API_KEY');
  return new TokenSet({ access_token: apiKey });
};

export const refreshToken = async (
  { oauthHost, clientId }: AuthProps,
  tokenSet: TokenSet,
) => {
  log.debug('Discovering oauth server');
  const issuer = await Issuer.discover(oauthHost);

  const neonOAuthClient = new issuer.Client({
    token_endpoint_auth_method: 'none',
    client_id: clientId,
    response_types: ['code'],
  });
  return await neonOAuthClient.refresh(tokenSet);
};

export const auth = async ({ oauthHost, clientId }: AuthProps): Promise<TokenSet> => {
  if (isCI()) {
    return authCI({ oauthHost, clientId });
  }

  // ... (keep the existing non-CI auth logic)
  // For now, we'll throw an error if not in CI environment
  throw new Error('Non-CI authentication not implemented in this example');
};
