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
          'hide-shared': {
            describe: 'Hide shared projects from the output',
            type: 'boolean',
            default: false,
          },
          'filter': {
            describe: 'Filter projects by name (case-insensitive)',
            type: 'string',
          },
          'region': {
            describe: `Filter projects by region. Possible values: ${REGIONS.join(', ')}`,
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

const list = async (props: CommonProps & { 
  orgId?: string; 
  hideShared?: boolean;
  filter?: string;
  region?: string;
}) => {
  const getList = async (
    fn:
      | typeof props.apiClient.listProjects
      | typeof props.apiClient.listSharedProjects,
    options: { orgId?: string } = {},
  ) => {
    try {
      const result: ProjectListItem[] = [];
      let cursor: string | undefined;
      let end = false;
      while (!end) {
        const { data } = await fn({
          limit: PROJECTS_LIST_LIMIT,
          org_id: options.orgId,
          cursor,
        });
        result.push(...data.projects);
        cursor = data.pagination?.cursor;
        log.debug(
          'Got %d projects, with cursor: %s',
          data.projects.length,
          cursor,
        );
        if (data.projects.length < PROJECTS_LIST_LIMIT) {
          end = true;
        }
      }
      return result;
    } catch (error) {
      log.error('Failed to fetch projects:', error);
      return [];
    }
  };

  try {
    // Fetch owned and shared projects in parallel
    const [ownedProjects, sharedProjects] = await Promise.all([
      getList(props.apiClient.listProjects, { orgId: props.orgId }),
      props.hideShared ? [] : getList(props.apiClient.listSharedProjects),
    ]);

    // Filter and sort projects
    const filterProjects = (projects: ProjectListItem[]) => {
      return projects
        .filter(project => {
          // Apply name filter if provided
          if (props.filter && !project.name.toLowerCase().includes(props.filter.toLowerCase())) {
            return false;
          }
          // Apply region filter if provided
          if (props.region && project.region_id !== props.region) {
            return false;
          }
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    const sortedOwnedProjects = filterProjects(ownedProjects);
    const sortedSharedProjects = filterProjects(sharedProjects);

    const out = writer(props);

    // Log filter information if filters are applied
    if (props.filter || props.region) {
      log.debug(
        'Applied filters: %s',
        [
          props.filter && `name contains "${props.filter}"`,
          props.region && `region is "${props.region}"`,
        ]
          .filter(Boolean)
          .join(', '),
      );
    }

    out.write(sortedOwnedProjects, {
      fields: PROJECT_FIELDS,
      title: 'Projects',
      emptyMessage:
        "You don't have any projects yet. See how to create a new project:\n> neonctl projects create --help",
    });

    if (!props.hideShared) {
      out.write(sortedSharedProjects, {
        fields: PROJECT_FIELDS,
        title: 'Shared with you',
        emptyMessage: 'No projects have been shared with you',
      });
    }

    out.end();
  } catch (error) {
    log.error('Failed to list projects:', error);
    throw error;
  }
};

const create = async (
  props: CommonProps & {
    blockPublicConnections?: boolean;
    blockVpcConnections?: boolean;
    name?: string;
    regionId?: string;
    cu?: string;
    orgId?: string;
    database?: string;
    role?: string;
    psql: boolean;
    setContext: boolean;
    '--'?: string[];
  },
) => {
  const project: ProjectCreateRequest['project'] = {};
  if (props.blockPublicConnections !== undefined) {
    if (!project.settings) {
      project.settings = {};
    }
    project.settings.block_public_connections = props.blockPublicConnections;
  }
  if (props.blockVpcConnections !== undefined) {
    if (!project.settings) {
      project.settings = {};
    }
    project.settings.block_vpc_connections = props.blockVpcConnections;
  }
  if (props.name) {
    project.name = props.name;
  }
  if (props.regionId) {
    project.region_id = props.regionId;
  }
  if (props.orgId) {
    project.org_id = props.orgId;
  }
  project.branch = {};
  if (props.database) {
    project.branch.database_name = props.database;
  }
  if (props.role) {
    project.branch.role_name = props.role;
  }
  if (props.cu) {
    project.default_endpoint_settings = props.cu
      ? getComputeUnits(props.cu)
      : undefined;
  }
  const { data } = await props.apiClient.createProject({
    project,
  });

  if (props.setContext) {
    updateContextFile(props.contextFile, {
      projectId: data.project.id,
    });
  }

  const out = writer(props);
  out.write(data.project, { fields: PROJECT_FIELDS, title: 'Project' });
  out.write(data.connection_uris, {
    fields: ['connection_uri'],
    title: 'Connection URIs',
  });
  out.end();

  if (props.psql) {
    const connection_uri = data.connection_uris[0].connection_uri;
    const psqlArgs = props['--'];
    await psql(connection_uri, psqlArgs);
  }
};

const deleteProject = async (props: CommonProps & IdOrNameProps) => {
  const { data } = await props.apiClient.deleteProject(props.id);
  writer(props).end(data.project, {
    fields: PROJECT_FIELDS,
  });
};

const update = async (
  props: CommonProps &
    IdOrNameProps & {
      name?: string;
      cu?: string;
      blockVpcConnections?: boolean;
      blockPublicConnections?: boolean;
    },
) => {
  const project: ProjectUpdateRequest['project'] = {};
  if (props.blockPublicConnections !== undefined) {
    if (!project.settings) {
      project.settings = {};
    }
    project.settings.block_public_connections = props.blockPublicConnections;
  }
  if (props.blockVpcConnections !== undefined) {
    if (!project.settings) {
      project.settings = {};
    }
    project.settings.block_vpc_connections = props.blockVpcConnections;
  }
  if (props.name) {
    project.name = props.name;
  }
  if (props.cu) {
    project.default_endpoint_settings = props.cu
      ? getComputeUnits(props.cu)
      : undefined;
  }

  const { data } = await props.apiClient.updateProject(props.id, {
    project,
  });

  writer(props).end(data.project, { fields: PROJECT_FIELDS });
};

const get = async (props: CommonProps & IdOrNameProps) => {
  const { data } = await props.apiClient.getProject(props.id);
  writer(props).end(data.project, { fields: PROJECT_FIELDS });
};
