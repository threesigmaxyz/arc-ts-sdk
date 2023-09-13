#!/bin/bash
set -e

npm ci
npm run build

PACKAGE_NAME=$(cat package.json | jq -r '.name')
PUBLISH_VERSION=$(cat package.json | jq -r '.version')
echo "Publishing ${PACKAGE_NAME}@$PUBLISH_VERSION"

TAG="--tag latest"

npm publish --access public $TAG