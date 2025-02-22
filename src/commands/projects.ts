import {
  ProjectCreateRequest,
  ProjectListItem,
  ProjectUpdateRequest,
} from '@neondatabase/api-client';
import yargs from 'yargs';

import { log } from '../log.js';
import {
  projectCreateRequest,
  projectUpdateRequest,
} from '../parameters.gen.js';
import { CommonProps, IdOrNameProps } from '../types.js';
import { writer } from '../writer.js';
import { psql } from '../utils/psql.js';
import { updateContextFile } from '../context.js';
import { getComputeUnits } from '../utils/compute_units.js';

export const PROJECT_FIELDS = [
  'id',
  'name',
  'region_id',
  'created_at',
] as const;

export const REGIONS = [
  'aws-us-west-2',
  'aws-ap-southeast-1',
  'aws-ap-southeast-2',
  'aws-eu-central-1',
  'aws-us-east-2',
  'aws-us-east-1',
  'azure-eastus2',
];

const PROJECTS_LIST_LIMIT = 100;

export const command = 'projects';
export const describe = 'Manage projects';
export const aliases = ['project'];
export const builder = (argv: yargs.Argv) => {
  return argv
    .usage('$0 projects <sub-command> [options]')
    .middleware((args: any) => {
      // Provide alias for analytics
      args.projectId = args.id;
    })
    .command(
      'list',
      'List projects',
      (yargs) =>
        yargs.options({
          'org-id': {
            describe: 'List projects of a given organization',
            type: 'string',
          },
        }),
      async (args) => {
        await list(args as any);
      },
    )
    .command(
      'create',
      'Create a project',
      (yargs) =>
        yargs.options({
          'block-public-connections': {
            describe:
              projectCreateRequest['project.settings.block_public_connections']
                .description,
            type: 'boolean',
          },
          'block-vpc-connections': {
            describe:
              projectCreateRequest['project.settings.block_vpc_connections']
                .description,
            type: 'boolean',
          },
          name: {
            describe: projectCreateRequest['project.name'].description,
            type: 'string',
          },
          'region-id': {
            describe: `The region ID. Possible values: ${REGIONS.join(', ')}`,
            type: 'string',
          },
          'org-id': {
            describe: "The project's organization ID",
            type: 'string',
          },
          psql: {
            type: 'boolean',
            describe: 'Connect to a new project via psql',
            default: false,
          },
          database: {
            describe:
              projectCreateRequest['project.branch.database_name'].description,
            type: 'string',
          },
          role: {
            describe:
              projectCreateRequest['project.branch.role_name'].description,
            type: 'string',
          },
          'set-context': {
            type: 'boolean',
            describe: 'Set the current context to the new project',
            default: false,
          },
          cu: {
            describe:
              'The number of Compute Units. Could be a fixed size (e.g. "2") or a range delimited by a dash (e.g. "0.5-3").',
            type: 'string',
          },
        }),
      async (args) => {
        await create(args as any);
      },
    )
    .command(
      'update <id>',
      'Update a project',
      (yargs) =>
        yargs.options({
          'block-vpc-connections': {
            describe:
              projectUpdateRequest['project.settings.block_vpc_connections']
                .description +
              ' Use --block-vpc-connections=false to set the value to false.',
            type: 'boolean',
          },
          'block-public-connections': {
            describe:
              projectUpdateRequest['project.settings.block_public_connections']
                .description +
              ' Use --block-public-connections=false to set the value to false.',
            type: 'boolean',
          },
          cu: {
            describe:
              'The number of Compute Units. Could be a fixed size (e.g. "2") or a range delimited by a dash (e.g. "0.5-3").',
            type: 'string',
          },
          name: {
            describe: projectUpdateRequest['project.name'].description,
            type: 'string',
          },
        }),
      async (args) => {
        await update(args as any);
      },
    )
    .command(
      'delete <id>',
      'Delete a project',
      (yargs) => yargs,
      async (args) => {
        await deleteProject(args as any);
      },
    )
    .command(
      'get <id>',
      'Get a project',
      (yargs) => yargs,
      async (args) => {
        await get(args as any);
      },
    );
};
export const handler = (args: yargs.Argv) => {
  return args;
};

const list = async (props: CommonProps & { orgId?: string }) => {
  const getList = async <T>(
    fn: (params: { limit: number; cursor?: string }) => Promise<T[]>,
  ) => {
    const result: T[] = [];
    let cursor: string | undefined;
    do {
      const items = await fn({ limit: PROJECTS_LIST_LIMIT, cursor });
      result.push(...items);
      cursor = (items as any).cursor;
    } while (cursor);
    return result;
  };

  const ownedProjects = await getList(props.apiClient.listProjects);
  // Always fetch shared projects regardless of orgId
  const sharedProjects = await getList(props.apiClient.listSharedProjects);

  const out = writer(props);

  out.write(ownedProjects, {
    fields: PROJECT_FIELDS,
    title: "Projects",
    emptyMessage:
      "You don't have any projects yet. See how to create a new project:
> neonctl projects create --help",
  });

  // Always show shared projects section
  out.write(sharedProjects, {
    fields: PROJECT_FIELDS,
    title: "Shared with you",
    emptyMessage: "No projects have been shared with you",
  });

  out.end();
};
});
