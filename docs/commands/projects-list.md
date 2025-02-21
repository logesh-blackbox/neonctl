# Projects List Command

## Overview
The `neonctl projects list` command displays both owned and shared projects in your Neon account. 

## Usage
```bash
neonctl projects list [options]
```

### Options
- `--org-id <organization-id>`: Filter projects by organization ID

### Output Sections
The command output is organized into two sections:

1. **Projects**: Lists all projects owned by you
2. **Shared with you**: Lists all projects that have been shared with you

### Examples
```bash
# List all projects (both owned and shared)
neonctl projects list

# List projects for a specific organization
neonctl projects list --org-id your-org-id
```

### Notes
- If no projects are found in either category, appropriate messages will be displayed
- When using `--org-id`, both owned and shared projects will be filtered by the specified organization
