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

## Development Environment Setup

For local development, this project requires running a local instance of Ganache, a personal blockchain for Ethereum development that you can use to deploy contracts, develop applications, and run tests.

Before proceeding, ensure you have Ganache installed on your machine. If not, you can download it from the official [Ganache website](https://www.trufflesuite.com/ganache).

To set up the development environment:

**Start Ganache**: You can do this by launching the Ganache GUI and creating a new workspace, or you can run Ganache CLI in your terminal. If you use the CLI, the default configuration will be applied (port 7545, network id 5777).

For CLI:

```bash
ganache-cli
```

Ensure Ganache is running properly. You should see an output indicating 10 accounts have been created with prefilled ether for development use.

Now, you're all set for local development using the Ganache EVM.

Remember to migrate and deploy your contracts to the Ganache network before interacting with them from the application. You may use the deployment scripts found in the `scripts` directory in the `contracts` folder.

## Troubleshooting

If you encounter any issues while setting up or using the contracts, please check the [Foundry documentation](https://book.getfoundry.sh/) for possible solutions.
