#!/bin/bash
set -e  # Exit on any error

echo "🔨 Building shared package..."
npm run build --workspace=shared

echo "🔨 Building frontend package..."
npm run build --workspace=frontend

echo "✅ Build complete!"

