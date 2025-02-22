# Neon CLI

The Neon CLI is a command-line interface that lets you manage [Neon Serverless Postgres](https://neon.tech/) directly from the terminal. For the complete documentation, see [Neon CLI](https://neon.tech/docs/reference/neon-cli).

## Table of Contents
- [Installation](#install-the-neon-cli)
  - [Prerequisites](#prerequisites)
  - [Installation Methods](#npm)
  - [Upgrading](#upgrade)
- [Authentication](#connect)
- [Autocompletion](#configure-autocompletion)
- [Commands](#commands)
- [Global Options](#global-options)
- [Contributing](#contribute)

## Prerequisites
- Node.js 18.0 or higher (for npm installation)
- macOS, Linux, or Windows operating system

## Install the Neon CLI

Choose one of the following installation methods:

### npm
```shell
npm i -g neonctl
```

### Homebrew
```shell
brew install neonctl
```

### Binary (macOS, Linux, Windows)
Download the latest binary file from our [releases page](https://github.com/neondatabase/neonctl/releases).

### Upgrade

You can upgrade your Neon CLI installation using the same method you used to install it:

**npm**
```shell
npm update -g neonctl
```

**Homebrew**
```shell
brew upgrade neonctl
```

**Binary**
Download the latest binary file from our [releases page](https://github.com/neondatabase/neonctl/releases) and replace your existing binary.

## Connect

There are two ways to authenticate with Neon:

### Browser Authentication
```bash
neonctl auth
```
This command launches a browser window where you can authorize the Neon CLI to access your Neon account.

### API Key Authentication
```bash
neonctl projects list --api-key <neon_api_key>
```
For information about obtaining a Neon API key, see [Authentication](https://api-docs.neon.tech/reference/authentication) in the _Neon API Reference_.

## Configure autocompletion

The Neon CLI supports autocompletion to enhance your productivity. To set it up:

1. Generate the completion script:
```bash
neonctl completion
```
2. Follow the instructions provided by the command to configure autocompletion for your shell.

For detailed instructions, see [Neon CLI commands — completion](https://neon.tech/docs/reference/cli-completion).

## Commands

| Command | Subcommands | Description | Example |
|---------|-------------|-------------|---------|
| [auth](https://neon.tech/docs/reference/cli-auth) | | Authenticate | `neonctl auth` |
| [projects](https://neon.tech/docs/reference/cli-projects) | `list`, `create`, `update`, `delete`, `get` | Manage projects | `neonctl projects list` |
| [ip-allow](https://neon.tech/docs/reference/cli-ip-allow) | `list`, `add`, `remove`, `reset` | Manage IP Allow | `neonctl ip-allow list` |
| [me](https://neon.tech/docs/reference/cli-me) | | Show current user | `neonctl me` |
| [branches](https://neon.tech/docs/reference/cli-branches) | `list`, `create`, `rename`, `add-compute`, `set-default`, `delete`, `get` | Manage branches | `neonctl branches list` |
| [databases](https://neon.tech/docs/reference/cli-databases) | `list`, `create`, `delete` | Manage databases | `neonctl databases list` |
| [roles](https://neon.tech/docs/reference/cli-roles) | `list`, `create`, `delete` | Manage roles | `neonctl roles list` |
| [operations](https://neon.tech/docs/reference/cli-operations) | `list` | Manage operations | `neonctl operations list` |
| [connection-string](https://neon.tech/docs/reference/cli-connection-string) | | Get connection string | `neonctl connection-string` |
| [set-context](https://neon.tech/docs/reference/cli-set-context) | | Set context for session | `neonctl set-context` |
| [completion](https://neon.tech/docs/reference/cli-completion) | | Generate completion script | `neonctl completion` |

### Project Listing Options
The `projects list` command supports the following options:
- `--org-id`: List projects of a given organization
- `--hide-shared`: Hide shared projects from the output

Examples:
```bash
# List all projects (both owned and shared)
neonctl projects list

# List projects for a specific organization
neonctl projects list --org-id <org-id>

# List only owned projects (hide shared projects)
neonctl projects list --hide-shared
```

The output is sorted alphabetically by project name and includes:
- Projects owned by you or your organization
- Projects shared with you (unless --hide-shared is specified)

## Global options

Global options can be used with any Neon CLI command:

| Option | Description | Type | Default |
| :----- | :---------- | :--- | :------ |
| [-o, --output](#output) | Set output format (`json`, `yaml`, or `table`) | string | table |
| [--config-dir](#config-dir) | Path to configuration directory | string | `/home/<user>/.config/neonctl` |
| [--api-key](#api-key) | Neon API key | string | "" |
| [--analytics](#analytics) | Manage analytics | boolean | true |
| [-v, --version](#version) | Show version number | boolean | - |
| [-h, --help](#help) | Show help | boolean | - |

### Output Formats
- <a id="output"></a>`-o, --output`
  ```bash
  neonctl me --output json  # Get user info in JSON format
  neonctl projects list --output yaml  # List projects in YAML format
  ```

### Configuration Directory
- <a id="config-dir"></a>`--config-dir`
  ```bash
  neonctl projects list --config-dir /custom/config/path
  ```

### API Key Authentication
- <a id="api-key"></a>`--api-key`
  ```bash
  neonctl projects list --api-key <your_api_key>
  ```

### Analytics Settings
- <a id="analytics"></a>`--analytics`
  ```bash
  neonctl projects list --no-analytics  # Disable analytics for this command
  ```

### Version Information
- <a id="version"></a>`-v, --version`
  ```bash
  neonctl --version
  ```

### Help Documentation
- <a id="help"></a>`-h, --help`
  ```bash
  neonctl --help  # General help
  neonctl branches --help  # Command-specific help
  neonctl branches create --help  # Subcommand help
  ```

## Contribute

To run the CLI locally:

1. Build the CLI:
```shell
npm run build
```

2. For continuous development:
```shell
npm run watch
```

3. Test local changes:
```shell
node dist <command>  # Example: node dist branches --help
```

### Contributing Guidelines

1. Fork the repository and create your branch from `main`
2. Install dependencies: `npm install`
3. Make your changes and add tests if needed
4. Update documentation as necessary
5. Submit a pull request

For more detailed documentation, visit our [Neon CLI Documentation](https://neon.tech/docs/reference/neon-cli).
