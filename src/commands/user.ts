import yargs from 'yargs';
import { isAxiosError } from 'axios';

import { CommonProps } from '../types.js';
import { writer } from '../writer.js';
import { auth } from '../auth.js';
import { log } from '../log.js';
import { defaultClientID } from '../auth.js';

export const command = 'me';
export const describe = 'Show current user';
export const builder = (yargs: yargs.Argv) =>
  yargs.option('context-file', {
    hidden: true,
  });
export const handler = async (args: CommonProps) => {
  await me(args);
};

const me = async (props: CommonProps) => {
  try {
    const { data } = await props.apiClient.getCurrentUserInfo();
    writer(props).end(data, {
      fields: ['login', 'email', 'name', 'projects_limit'],
    });
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      log.info('Authentication required. Starting browser-based authentication...');
      try {
        const tokenSet = await auth({
          oauthHost: props.oauthHost || 'https://oauth.neon.tech',
          clientId: defaultClientID,
        });
        
        // Update the API client with the new token
        props.apiClient = props.apiClient.withBearerToken(tokenSet.access_token!);
        
        // Retry getting user info with new token
        const { data } = await props.apiClient.getCurrentUserInfo();
        writer(props).end(data, {
          fields: ['login', 'email', 'name', 'projects_limit'],
        });
      } catch (authError) {
        log.error('Authentication failed:', authError instanceof Error ? authError.message : String(authError));
        throw authError;
      }
    } else {
      throw error;
    }
  }
};
