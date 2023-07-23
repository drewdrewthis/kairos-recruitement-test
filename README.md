# Kairos Recruitment Test for Fullstack Blockchain Engineer

This is a comprehensive recruitment test project for potential fullstack blockchain engineers. The project consists of two primary components, housed in their respective directories: `contracts` and `front-next`.

This README will provide a general overview of the project and links to more specific README files in the `contracts` and `front-next` directories.

## TL;DR

```bash
NETWORK=goerli sh bootstrap.sh && sh start.sh
```

or for development

```bash
NETWORK=goerli sh bootstrap.sh && sh start.sh --dev
```

````

## Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Configuration](#environment-configuration)
3. [Common Scripts](#common-scripts)
4. [Troubleshooting](#troubleshooting)
5. [Contributing](#contributing)
6. [License](#license)

## Project Structure

- `contracts`: This directory contains smart contract code and deployment scripts. More information can be found in the [`contracts` README](./contracts/README.md).
- `front-next`: This directory contains the frontend built with NextJS, TailwindCSS, and MUI. More information can be found in the [`front-next` README](./front-next/README.md).

## Environment Configuration

There is a shared `.env` file at the top level of the project, containing configurations that both `contracts` and `front-next` directories use. For specific environment configurations, refer to the README files in the respective directories.

## Development Environment Setup

For local development, this project requires running a local instance of Ganache, a personal blockchain for Ethereum development that you can use to deploy contracts, develop applications, and run tests.

Before proceeding, ensure you have Ganache installed on your machine. If not, you can download it from the official [Ganache website](https://www.trufflesuite.com/ganache).

To set up the development environment:

**Start Ganache**: You can do this by launching the Ganache GUI and creating a new workspace, or you can run Ganache CLI in your terminal. If you use the CLI, the default configuration will be applied (port 7545, network id 5777).

For CLI:

```bash
ganache-cli
````

Ensure Ganache is running properly. You should see an output indicating 10 accounts have been created with prefilled ether for development use.

Now, you're all set for local development using the Ganache EVM.

Remember to migrate and deploy your contracts to the Ganache network before interacting with them from the application. You may use the deployment scripts found in the `scripts` directory in the `contracts` folder.

Please refer to the specific README files in the `contracts` and `front-next` directories for more information on contract deployment and application setup.

## Common Scripts

The script `copy_generated_abis.sh` at the top level copies the necessary ABI files from the `contracts` directory into the `front-next/src/__generated/contracts` directory.

For more detailed information about scripts, please refer to the README files in the respective `contracts` and `front-next` directories.

## Troubleshooting

If you encounter any issues while setting up or using this project, please refer to the troubleshooting sections in the `contracts` and `front-next` README files.

## Contributing

This project is for recruitment test purposes. Therefore, contributions may not be necessary.

## License

This project is licensed under the [MIT license](./LICENSE).

---

## Screenshots

![Screenshot #3](./screenshot-3.png)
![Screenshot #1](./screenshot-1.png)
![Screenshot #2](./screenshot-2.png)
