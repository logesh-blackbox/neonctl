import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAccessToken, authCommand } from './auth';
import { auth, refreshToken } from '../auth';
import { getConfig, setConfig } from '../config';
import { TokenSet } from 'openid-client';

vi.mock('../auth');
vi.mock('../config');
vi.mock('../log');

describe('auth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.CI = undefined;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAccessToken', () => {
    it('should return API key in CI environment', async () => {
      process.env.CI = 'true';
      process.env.NEON_API_KEY = 'test-api-key';

      const result = await getAccessToken();

      expect(result).toBe('test-api-key');
    });

    it('should throw error if NEON_API_KEY is not set in CI environment', async () => {
      process.env.CI = 'true';
      process.env.NEON_API_KEY = undefined;

      await expect(getAccessToken()).rejects.toThrow('NEON_API_KEY is not set in the CI environment');
    });

    it('should start auth flow if no token set is found', async () => {
      vi.mocked(getConfig).mockReturnValue({ oauthHost: 'test-host', clientId: 'test-client' });
      vi.mocked(auth).mockResolvedValue(new TokenSet({ access_token: 'new-token' }));

      const result = await getAccessToken();

      expect(auth).toHaveBeenCalledWith({ oauthHost: 'test-host', clientId: 'test-client' });
      expect(setConfig).toHaveBeenCalledWith({ tokenSet: expect.any(TokenSet) });
      expect(result).toBe('new-token');
    });

    it('should refresh token if expired', async () => {
      const expiredToken = new TokenSet({ access_token: 'expired-token', expires_at: Date.now() / 1000 - 3600 });
      vi.mocked(getConfig).mockReturnValue({ oauthHost: 'test-host', clientId: 'test-client', tokenSet: expiredToken });
      vi.mocked(refreshToken).mockResolvedValue(new TokenSet({ access_token: 'refreshed-token' }));

      const result = await getAccessToken();

      expect(refreshToken).toHaveBeenCalledWith({ oauthHost: 'test-host', clientId: 'test-client' }, expiredToken);
      expect(setConfig).toHaveBeenCalledWith({ tokenSet: expect.any(TokenSet) });
      expect(result).toBe('refreshed-token');
    });
  });

  describe('authCommand', () => {
    it('should start auth flow and set config', async () => {
      vi.mocked(getConfig).mockReturnValue({ oauthHost: 'test-host', clientId: 'test-client' });
      vi.mocked(auth).mockResolvedValue(new TokenSet({ access_token: 'new-token' }));

      await authCommand();

      expect(auth).toHaveBeenCalledWith({ oauthHost: 'test-host', clientId: 'test-client' });
      expect(setConfig).toHaveBeenCalledWith({ tokenSet: expect.any(TokenSet) });
    });

    it('should throw error if authentication fails', async () => {
      vi.mocked(auth).mockResolvedValue(new TokenSet({}));

      await expect(authCommand()).rejects.toThrow('Failed to authenticate');
    });
  });
});
