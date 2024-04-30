#!/bin/bash
npm run build

rm -rf ../main_api/build
cp -r build ../main_api
touch ../main_api/server.py