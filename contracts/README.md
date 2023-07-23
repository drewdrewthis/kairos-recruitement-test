# `contracts` Directory README

See foundry readme [here](docs/FOUNRY_README.md)

This directory contains all the smart contracts and deployment scripts used in the Kairos recruitment test project.

## Table of Contents

1. [Requirements](#requirements)
2. [Usage](#usage)
3. [Scripts](#scripts)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

## Requirements

To work with the contracts, you should have Foundry installed.

## Usage

To build and test your contracts, use the following commands from Foundry:

- `forge test --gas-report -vv`: This command runs tests with verbose logging and a gas report.
- `forge build`: This command compiles your contracts.

## Scripts

In this directory, there are helper scripts for deploying contracts. You can find these in the `scripts` directory:

- `deploy-staking-contract.sh`
- `deploy-test-tokens.sh`

## Environment Configuration

This project is dependent on an `.env` file which is required for the scripts. An `.env.example` is provided with some defaults.

## Troubleshooting

If you encounter any issues while setting up or using the contracts, please check the [Foundry documentation](https://book.getfoundry.sh/) for possible solutions.
