#!/bin/bash

set -ex

echo "Starting.."

## If the --dev flag is passed, start the dev server
if [ "$1" = "--dev" ]; then
  echo "Starting dev server"
  (
    cd frontend-next
    yarn dev
  )
  exit 0
else
  echo "Starting production server"
  (

    cd frontend-next
    yarn start:pretty
  )
fi
