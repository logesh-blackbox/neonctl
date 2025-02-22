# Projects List Command

## Overview
The `neonctl projects list` command displays a comprehensive list of all projects associated with your Neon account, including both owned projects and projects shared with you. This command helps you manage and monitor all projects you have access to in one place.

## Usage
```bash
neonctl projects list [options]
```

### Options
- `--org-id <organization-id>`: Filter projects by organization ID. When specified, both owned and shared projects will be filtered to show only those belonging to the specified organization.

### Output Format
The command output is organized into two distinct sections:

1. **Projects**
   - Lists all projects owned by you
   - Displays project details including:
     - Project ID
     - Project Name
     - Region ID
     - Creation Date

2. **Shared with you**
   - Lists all projects that have been shared with you
   - Shows the same project details as owned projects
   - Helps distinguish between owned and shared resources

### Example Outputs

1. **Basic Usage**
```bash
$ neonctl projects list

Projects
ID                  NAME               REGION ID         CREATED AT
proj-123abc        my-project         aws-us-east-1    2023-01-15T10:30:00Z
proj-456def        test-db            aws-us-west-2    2023-02-20T15:45:00Z

Shared with you
ID                  NAME               REGION ID         CREATED AT
proj-789ghi        team-project       aws-eu-west-1    2023-03-01T09:00:00Z
```

2. **With Organization Filter**
```bash
$ neonctl projects list --org-id org-123456

Projects
ID                  NAME               REGION ID         CREATED AT
proj-123abc        my-project         aws-us-east-1    2023-01-15T10:30:00Z

Shared with you
ID                  NAME               REGION ID         CREATED AT
proj-789ghi        team-project       aws-eu-west-1    2023-03-01T09:00:00Z
```

### Error Messages
- If no owned projects are found:
  ```
  You don't have any projects yet. See how to create a new project:
  > neonctl projects create --help
  ```
- If no shared projects are found:
  ```
  No projects have been shared with you
  ```

### Notes and Best Practices
- Always check both sections to ensure you're aware of all projects you have access to
- Use the `--org-id` filter when working with multiple organizations to focus on specific project sets
- The command respects your authentication and shows only projects you have permission to view
- Project IDs can be used with other neonctl commands for project-specific operations

### Related Commands
- `neonctl projects create`: Create a new project
- `neonctl projects delete`: Delete an existing project
- `neonctl projects update`: Update project settings
- `neonctl projects get`: Get detailed information about a specific project

### Authentication
- Requires valid authentication via `neonctl auth`
- Uses your current Neon API credentials
- Ensures secure access to project information

### Troubleshooting
1. If the command returns an authentication error:
   - Run `neonctl auth` to authenticate
   - Verify your API key is valid

2. If projects are missing:
   - Verify you have the correct permissions
   - Check if you're using the correct organization ID
