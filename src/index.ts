console.log('CLI script started');

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getAccessToken } from './commands/auth.js';
import { log } from './log.js';
import { defaultDir, ensureConfigDir } from './config.js';

console.log('Imports completed');

async function runCLI(args: string[]) {
  console.log('runCLI function started');
  console.log('Arguments:', args);

  return yargs(args)
    .command('projects list', 'List all projects', {}, async (argv) => {
      console.log('projects list command executed');
      try {
        console.log('Environment:', process.env.CI ? 'CI' : 'Non-CI');
        console.log('NEON_API_KEY set:', !!process.env.NEON_API_KEY);
        const token = await getAccessToken();
        console.log('Token obtained:', token ? 'Yes' : 'No');
        console.log('Projects list would be fetched here with token:', token);
      } catch (error) {
        console.error('Failed to list projects:', error);
        process.exit(1);
      }
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .alias('help', 'h')
    .parseAsync();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Running in main module');
  ensureConfigDir();
  runCLI(hideBin(process.argv)).catch((error) => {
    console.error('Error in CLI execution:', error);
    process.exit(1);
  });
}

console.log('Script execution completed');

export { runCLI };
