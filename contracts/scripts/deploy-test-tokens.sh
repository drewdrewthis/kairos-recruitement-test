#!/bin/bash

set -euo pipefail

ENV_FILE=""

# Pick .env file based on ENV variable
if [[ "$NETWORK" == "goerli-production" ]]; then
  echo "Using .env.goerli-production" >&2
  ENV_FILE=".env.goerli-production"
elif [[ "$NETWORK" == "ganache-local" ]]; then
  echo "Using .env.ganache-local" >&2
  ENV_FILE=".env.ganache-local"
else
  echo "ENV variable not set" >&2
  exit 1
fi


if [[ ! -f $ENV_FILE ]]; then
  echo ".env file not found" >&2
  exit 1
fi

# Export environment variables from .env file
export $(grep -v '^#' $ENV_FILE | xargs)

# Get the current date and time as a timestamp
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

{
# Echo the timestamp
echo "Current timestamp: $timestamp"

echo "Deploying test tokens to $RPC_URL"

# Use double quotes for variable expansion to ensure word splitting and globbing
forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  src/StakableNFT.sol:StakableNFT \
  --constructor-args "JabbyJewels" "JBJ" 

# Use double quotes for variable expansion to ensure word splitting and globbing
forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  src/StakableNFT.sol:StakableNFT \
  --constructor-args "SnootyLumps" "SNLP" 

# Use double quotes for variable expansion to ensure word splitting and globbing
forge create \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  src/StakableNFT.sol:StakableNFT \
  --constructor-args "CoopyTop" "CPTP" 

# Append to the file and then pipe to stdout
} | tee -a $LOG_FILE
