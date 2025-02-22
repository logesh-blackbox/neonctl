# CLI de Neon

*Leer en otros idiomas: [English](README.md)*

El CLI de Neon es una interfaz de línea de comandos que te permite gestionar [Neon Serverless Postgres](https://neon.tech/) directamente desde la terminal. Para la documentación completa, consulta [CLI de Neon](https://neon.tech/docs/reference/neon-cli).

## Tabla de Contenidos
- [Instalación](#instalación)
  - [Requisitos Previos](#requisitos-previos)
  - [Métodos de Instalación](#npm)
  - [Actualización](#actualización)
- [Autenticación](#conectar)
- [Autocompletado](#configurar-autocompletado)
- [Comandos](#comandos)
- [Opciones Globales](#opciones-globales)
- [Contribuir](#contribuir)

## Requisitos Previos
- Node.js 18.0 o superior (para instalación npm)
- Sistema operativo macOS, Linux o Windows

## Instalación

Elige uno de los siguientes métodos de instalación:

### npm
```shell
npm i -g neonctl
```

### Homebrew
```shell
brew install neonctl
```

### Binario (macOS, Linux, Windows)
Descarga el archivo binario más reciente desde nuestra [página de lanzamientos](https://github.com/neondatabase/neonctl/releases).

### Actualización

Puedes actualizar tu instalación del CLI de Neon utilizando el mismo método que usaste para instalarlo:

**npm**
```shell
npm update -g neonctl
```

**Homebrew**
```shell
brew upgrade neonctl
```

**Binario**
Descarga el archivo binario más reciente desde nuestra [página de lanzamientos](https://github.com/neondatabase/neonctl/releases) y reemplaza tu binario existente.

## Conectar

Hay dos formas de autenticarse con Neon:

### Autenticación por Navegador
```bash
neonctl auth
```
Este comando abre una ventana del navegador donde puedes autorizar al CLI de Neon para acceder a tu cuenta de Neon.

### Autenticación por Clave API
```bash
neonctl projects list --api-key <neon_api_key>
```
Para información sobre cómo obtener una clave API de Neon, consulta [Autenticación](https://api-docs.neon.tech/reference/authentication) en la _Referencia de API de Neon_.

## Configurar autocompletado

El CLI de Neon soporta autocompletado para mejorar tu productividad. Para configurarlo:

1. Genera el script de completado:
```bash
neonctl completion
```
2. Sigue las instrucciones proporcionadas por el comando para configurar el autocompletado en tu shell.

Para instrucciones detalladas, consulta [Comandos del CLI de Neon — completion](https://neon.tech/docs/reference/cli-completion).

## Comandos

| Comando | Subcomandos | Descripción | Ejemplo |
|---------|-------------|-------------|---------|
| [auth](https://neon.tech/docs/reference/cli-auth) | | Autenticar | `neonctl auth` |
| [projects](https://neon.tech/docs/reference/cli-projects) | `list`, `create`, `update`, `delete`, `get` | Gestionar proyectos | `neonctl projects list` |
| [ip-allow](https://neon.tech/docs/reference/cli-ip-allow) | `list`, `add`, `remove`, `reset` | Gestionar IP permitidas | `neonctl ip-allow list` |
| [me](https://neon.tech/docs/reference/cli-me) | | Mostrar usuario actual | `neonctl me` |
| [branches](https://neon.tech/docs/reference/cli-branches) | `list`, `create`, `rename`, `add-compute`, `set-default`, `delete`, `get` | Gestionar ramas | `neonctl branches list` |
| [databases](https://neon.tech/docs/reference/cli-databases) | `list`, `create`, `delete` | Gestionar bases de datos | `neonctl databases list` |
| [roles](https://neon.tech/docs/reference/cli-roles) | `list`, `create`, `delete` | Gestionar roles | `neonctl roles list` |
| [operations](https://neon.tech/docs/reference/cli-operations) | `list` | Gestionar operaciones | `neonctl operations list` |
| [connection-string](https://neon.tech/docs/reference/cli-connection-string) | | Obtener cadena de conexión | `neonctl connection-string` |
| [set-context](https://neon.tech/docs/reference/cli-set-context) | | Establecer contexto para la sesión | `neonctl set-context` |
| [completion](https://neon.tech/docs/reference/cli-completion) | | Generar script de completado | `neonctl completion` |

## Opciones globales

Las opciones globales se pueden usar con cualquier comando del CLI de Neon:

| Opción | Descripción | Tipo | Valor predeterminado |
| :----- | :---------- | :--- | :------------------- |
| [-o, --output](#output) | Establecer formato de salida (`json`, `yaml`, o `table`) | string | table |
| [--config-dir](#config-dir) | Ruta al directorio de configuración | string | `/home/<user>/.config/neonctl` |
| [--api-key](#api-key) | Clave API de Neon | string | "" |
| [--analytics](#analytics) | Gestionar analíticas | boolean | true |
| [-v, --version](#version) | Mostrar número de versión | boolean | - |
| [-h, --help](#help) | Mostrar ayuda | boolean | - |

### Formatos de Salida
- <a id="output"></a>`-o, --output`
  ```bash
  neonctl me --output json  # Obtener información del usuario en formato JSON
  neonctl projects list --output yaml  # Listar proyectos en formato YAML
  ```

### Directorio de Configuración
- <a id="config-dir"></a>`--config-dir`
  ```bash
  neonctl projects list --config-dir /ruta/personalizada/config
  ```

### Autenticación por Clave API
- <a id="api-key"></a>`--api-key`
  ```bash
  neonctl projects list --api-key <tu_clave_api>
  ```

### Configuración de Analíticas
- <a id="analytics"></a>`--analytics`
  ```bash
  neonctl projects list --no-analytics  # Deshabilitar analíticas para este comando
  ```

### Información de Versión
- <a id="version"></a>`-v, --version`
  ```bash
  neonctl --version
  ```

### Documentación de Ayuda
- <a id="help"></a>`-h, --help`
  ```bash
  neonctl --help  # Ayuda general
  neonctl branches --help  # Ayuda específica del comando
  neonctl branches create --help  # Ayuda del subcomando
  ```

## Contribuir

Para ejecutar el CLI localmente:

1. Construir el CLI:
```shell
npm run build
```

2. Para desarrollo continuo:
```shell
npm run watch
```

3. Probar cambios locales:
```shell
node dist <comando>  # Ejemplo: node dist branches --help
```

### Guías de Contribución

1. Haz un fork del repositorio y crea tu rama desde `main`
2. Instala las dependencias: `npm install`
3. Realiza tus cambios y añade pruebas si es necesario
4. Actualiza la documentación según sea necesario
5. Envía un pull request

Para documentación más detallada, visita nuestra [Documentación del CLI de Neon](https://neon.tech/docs/reference/neon-cli).
