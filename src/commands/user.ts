import yargs from 'yargs';

import { CommonProps } from '../types.js';
import { writer } from '../writer.js';
import { ensureAuth } from './auth.js';

export const command = 'me';
export const describe = 'Show current user';
export const builder = (yargs: yargs.Argv) =>
  yargs
    .option('context-file', {
      hidden: true,
    })
    .option('config-dir', {
      type: 'string',
      hidden: true,
    })
    .option('oauth-host', {
      type: 'string',
      hidden: true,
    })
    .option('client-id', {
      type: 'string',
      hidden: true,
    })
    .option('force-auth', {
      type: 'boolean',
      hidden: true,
    })
    .option('help', {
      type: 'boolean',
      hidden: true,
    });

export const handler = async (
  args: CommonProps & {
    configDir: string;
    oauthHost: string;
    clientId: string;
    forceAuth: boolean;
    help: boolean;
    _: (string | number)[];
  },
) => {
  await ensureAuth(args);
  await me(args);
};

const me = async (props: CommonProps) => {
  const { data } = await props.apiClient.getCurrentUserInfo();
  writer(props).end(data, {
    fields: ['login', 'email', 'name', 'projects_limit'],
  });
};
