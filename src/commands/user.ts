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

const writeUserInfo = (props: CommonProps, data: any) => {
  writer(props).end(data, {
    fields: ['login', 'email', 'name', 'projects_limit'],
  });
};

const me = async (props: CommonProps) => {
  try {
    const { data } = await props.apiClient.getCurrentUserInfo();
    writeUserInfo(props, data);
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
        const { data } = await props.apiClient.getCurrentUserInfo();
        writeUserInfo(props, data);
      } catch (authError) {
        log.error('Authentication failed');
        throw authError;
      }
    } else {
      throw error;
    }
  }
};
