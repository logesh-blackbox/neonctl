import { TokenSet } from 'openid-client';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const CREDENTIALS_FILE = '.neonctl.json';
export const defaultDir = path.join(os.homedir(), '.neon');

type Config = {
  oauthHost: string;
  clientId: string;
  tokenSet?: TokenSet;
};

let config: Config = {
  oauthHost: 'https://console.neon.tech',
  clientId: 'neonctl',
};

export const getConfig = (): Config => {
  return config;
};

export const setConfig = (newConfig: Partial<Config>): void => {
  config = { ...config, ...newConfig };
};

export const ensureConfigDir = (): void => {
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
};
