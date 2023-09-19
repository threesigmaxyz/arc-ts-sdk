#!/bin/bash
set -e

cd "src/packages/crypto"

npm ci
npm run build
npm version --preid dev --no-git-tag-version --no-commit-hooks prepatch
#Use timestamp as package suffix
TIME=$(date -u +%Y%m%d%H%M%S)
sed -i "/version/s/dev.0/dev.$TIME/g" package.json

PACKAGE_NAME=$(cat package.json | jq -r '.name')
PUBLISH_VERSION=$(cat package.json | jq -r '.version')
echo publishing ${PACKAGE_NAME}@$PUBLISH_VERSION

npm publish --access public --tag dev