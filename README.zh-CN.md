# Neon CLI

Neon CLI 是一个命令行界面，让您可以直接从终端管理 [Neon Serverless Postgres](https://neon.tech/)。完整文档请参见 [Neon CLI](https://neon.tech/docs/reference/neon-cli)。

## 目录
- [安装](#安装-neon-cli)
  - [前提条件](#前提条件)
  - [安装方法](#npm)
  - [升级](#升级)
- [认证](#连接)
- [自动补全](#配置自动补全)
- [命令](#命令)
- [全局选项](#全局选项)
- [贡献](#贡献)

## 前提条件
- Node.js 18.0 或更高版本（用于 npm 安装）
- macOS、Linux 或 Windows 操作系统

## 安装 Neon CLI

选择以下安装方法之一：

### npm
```shell
npm i -g neonctl
```

### Homebrew
```shell
brew install neonctl
```

### 二进制文件（macOS、Linux、Windows）
从我们的[发布页面](https://github.com/neondatabase/neonctl/releases)下载最新的二进制文件。

### 升级

您可以使用与安装相同的方法升级 Neon CLI：

**npm**
```shell
npm update -g neonctl
```

**Homebrew**
```shell
brew upgrade neonctl
```

**二进制文件**
从我们的[发布页面](https://github.com/neondatabase/neonctl/releases)下载最新的二进制文件并替换现有的二进制文件。

## 连接

有两种方式可以与 Neon 进行认证：

### 浏览器认证
```bash
neonctl auth
```
此命令会启动浏览器窗口，您可以在其中授权 Neon CLI 访问您的 Neon 账户。

### API 密钥认证
```bash
neonctl projects list --api-key <neon_api_key>
```
有关获取 Neon API 密钥的信息，请参见 _Neon API 参考_ 中的[认证](https://api-docs.neon.tech/reference/authentication)。

## 配置自动补全

Neon CLI 支持自动补全以提高您的工作效率。设置方法：

1. 生成补全脚本：
```bash
neonctl completion
```
2. 按照命令提供的说明为您的 shell 配置自动补全。

详细说明请参见 [Neon CLI 命令 — completion](https://neon.tech/docs/reference/cli-completion)。

## 命令

| 命令 | 子命令 | 描述 | 示例 |
|---------|-------------|-------------|---------|
| [auth](https://neon.tech/docs/reference/cli-auth) | | 认证 | `neonctl auth` |
| [projects](https://neon.tech/docs/reference/cli-projects) | `list`, `create`, `update`, `delete`, `get` | 管理项目 | `neonctl projects list` |
| [ip-allow](https://neon.tech/docs/reference/cli-ip-allow) | `list`, `add`, `remove`, `reset` | 管理 IP 允许列表 | `neonctl ip-allow list` |
| [me](https://neon.tech/docs/reference/cli-me) | | 显示当前用户 | `neonctl me` |
| [branches](https://neon.tech/docs/reference/cli-branches) | `list`, `create`, `rename`, `add-compute`, `set-default`, `delete`, `get` | 管理分支 | `neonctl branches list` |
| [databases](https://neon.tech/docs/reference/cli-databases) | `list`, `create`, `delete` | 管理数据库 | `neonctl databases list` |
| [roles](https://neon.tech/docs/reference/cli-roles) | `list`, `create`, `delete` | 管理角色 | `neonctl roles list` |
| [operations](https://neon.tech/docs/reference/cli-operations) | `list` | 管理操作 | `neonctl operations list` |
| [connection-string](https://neon.tech/docs/reference/cli-connection-string) | | 获取连接字符串 | `neonctl connection-string` |
| [set-context](https://neon.tech/docs/reference/cli-set-context) | | 设置会话上下文 | `neonctl set-context` |
| [completion](https://neon.tech/docs/reference/cli-completion) | | 生成补全脚本 | `neonctl completion` |

## 退出代码

CLI 使用以下退出代码：

| 退出代码 | 描述 |
|-----------|-------------|
| 0 | 成功 |
| 1 | 一般错误 |
| 2 | 分支已存在（使用 `branches create` 时） |

## 全局选项

全局选项可以与任何 Neon CLI 命令一起使用：

| 选项 | 描述 | 类型 | 默认值 |
| :----- | :---------- | :--- | :------ |
| [-o, --output](#output) | 设置输出格式（`json`、`yaml` 或 `table`） | string | table |
| [--config-dir](#config-dir) | 配置目录路径 | string | `/home/<user>/.config/neonctl` |
| [--api-key](#api-key) | Neon API 密钥 | string | "" |
| [--analytics](#analytics) | 管理分析 | boolean | true |
