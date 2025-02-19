#!/bin/bash

echo "Testing without CI environment"
unset CI
unset NEON_API_KEY
node -e "import('./dist/index.js').then(({runCLI}) => runCLI(['projects', 'list']))"

echo "Testing with CI environment but without NEON_API_KEY"
export CI=true
unset NEON_API_KEY
node -e "import('./dist/index.js').then(({runCLI}) => runCLI(['projects', 'list']))"

echo "Testing with CI environment and NEON_API_KEY"
export CI=true
export NEON_API_KEY="dummy_api_key"
node -e "import('./dist/index.js').then(({runCLI}) => runCLI(['projects', 'list']))"
