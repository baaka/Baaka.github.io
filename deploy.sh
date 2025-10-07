#!/bin/bash

# Exit on errors
set -e

echo "Building React app..."
npm run build

echo "Removing old docs folder..."
rm -rf docs

echo "Creating new docs folder..."
mkdir docs

echo "Copying build files to docs..."
cp -r build/* docs/

echo "Cleaning up build folder..."
rm -rf build

echo "Deployment ready: docs folder updated."
