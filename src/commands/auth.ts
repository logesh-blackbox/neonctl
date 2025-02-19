import { TokenSet } from 'openid-client';
import { auth, refreshToken, AuthProps } from '../auth.js';
import { log } from '../log.js';
import { getConfig, setConfig } from '../config.js';
import { getNeonApiKey } from '../env.js';

const isCompleteTokenSet = (tokenSet: TokenSet | undefined): tokenSet is TokenSet => {
  return !!tokenSet && !!tokenSet.access_token;
};

export const getAuthProps = (): AuthProps => {
  const config = getConfig();
  return {
    oauthHost: config.oauthHost,
    clientId: config.clientId,
  };
};

export const getAccessToken = async (): Promise<string> => {
  const config = getConfig();
  let tokenSet = config.tokenSet;

  if (process.env.CI) {
    const apiKey = getNeonApiKey();
    if (!apiKey) {
      throw new Error('NEON_API_KEY is not set in the CI environment');
    }
    return apiKey;
  }

  if (!isCompleteTokenSet(tokenSet)) {
    log.debug('No token set found, starting auth flow');
    tokenSet = await auth(getAuthProps());
    setConfig({ tokenSet });
  } else if (tokenSet.expired()) {
    log.debug('Token expired, refreshing');
    try {
      const refreshedTokenSet = await refreshToken(getAuthProps(), tokenSet);
      if (!isCompleteTokenSet(refreshedTokenSet)) {
        throw new Error('Failed to refresh token');
      }
      tokenSet = refreshedTokenSet;
      setConfig({ tokenSet });
    } catch (error) {
      log.debug('Failed to refresh token, starting auth flow');
      tokenSet = await auth(getAuthProps());
      setConfig({ tokenSet });
    }
  }

  return tokenSet.access_token || "";
};

export const authCommand = async () => {
  log.info('Starting authentication flow');
  const tokenSet = await auth(getAuthProps());
  if (!isCompleteTokenSet(tokenSet)) {
    throw new Error('Failed to authenticate');
  }
  setConfig({ tokenSet });
  log.info('Authentication successful');
};
