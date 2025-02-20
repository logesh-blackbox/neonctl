import yargs from 'yargs';

import { CommonProps } from '../types.js';
import { writer } from '../writer.js';
import { isAuthenticationError } from '../errors.js';
import { auth } from '../auth.js';
import { log } from '../log.js';

export const command = 'me';
export const describe = 'Show current user';
export const builder = (yargs: yargs.Argv) =>
  yargs.option('context-file', {
    hidden: true,
  });

export const handler = async (args: CommonProps) => {
  await me(args);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const writeUserInfo = (props: CommonProps, data: any) => {
  writer(props).end(data, {
    fields: ['login', 'email', 'name', 'projects_limit'],
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithDelay = async <T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      log.debug(`Retrying operation. ${retries} attempts remaining...`);
      await sleep(delay);
      return retryWithDelay(fn, retries - 1, delay);
    }
    throw error;
  }
};

const me = async (props: CommonProps) => {
  const fetchUserInfo = async () => {
    try {
      const { data } = await props.apiClient.getCurrentUserInfo();
      return data;
    } catch (error) {
      if (isAuthenticationError(error)) {
        log.info('Authentication required. Starting authentication flow...');
        try {
          // Trigger authentication flow
          await auth({
            oauthHost: props.apiHost || 'https://console.neon.tech',
            clientId: 'neonctl',
          });

          // Retry fetching user info after authentication
          log.info('Authentication successful. Fetching user information...');
          const { data } = await props.apiClient.getCurrentUserInfo();
          return data;
        } catch (authError) {
          log.error(
            'Authentication failed. Please try again or run "neon auth" command.',
          );
          if (authError instanceof Error) {
            log.debug(`Authentication error details: ${authError.message}`);
          }
          throw new Error('Failed to authenticate. Please try again.');
        }
      }
      throw error;
    }
  };

  try {
    // Attempt to fetch user info with retries
    const data = await retryWithDelay(fetchUserInfo);
    writeUserInfo(props, data);
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      if (error.message.includes('Authentication failed')) {
        log.info(
          'Tip: You can manually authenticate using the "neon auth" command.',
        );
      }
    }
    throw error;
  }
};
