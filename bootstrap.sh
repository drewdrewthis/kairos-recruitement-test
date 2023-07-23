#!/bin/bash

set -ex

echo "Bootstrapping.."

# Load environment variables
set -o allexport; 
source .env; 
set +o allexport;


{
  cd frontend-next
  yarn switch:goerli
  yarn install
  yarn build 
}