# `front-next` Directory README

## TL;DR

### Routes:

_Get all of the nfts for a given address (with metadata)_
`/api/nfts/:wallet-address`

_Get all of the staked nfts for a given address (with metadata)_
`/api/staked-nfts/:wallet-address`

_Get eligbility data (with merkle proofs)_
`/api/nfts/eligibility-data`

## Backend

The backend logic is managed in the `/lib/services` directory,
which is used in the `route.ts` files found within the `app` directory.

See NextJS README here: [docs/NEXTJS_README.md](docs/NEXTJS_README.md)

This directory houses the frontend application for the Kairos recruitment test project, built with NextJS, TailwindCSS, and MUI.

## Table of Contents

1. [Requirements](#requirements)
2. [Usage](#usage)
3. [Scripts](#scripts)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Requirements

To work with the frontend application, you should have Node.js (v14 or later) and Yarn installed.

## Usage

The frontend is built using NextJS, with the application structure housed in the `app` directory.

## Scripts

You can run helpful scripts from the `yarn script` commands in the `package.json` file.

## Environment Configuration

This project is dependent on an `.env.local` file, but there are also network specific env files `.env.goerli` and `.env.ganache`.

You can switch between environments with the following commands:

- `yarn switch:goerli`: Switches to the Goerli test network.
- `yarn switch:ganache`: Switches to the Ganache network.

## Dependency Injection with TypeDI

In this project, we use TypeDI, a dependency injection tool for TypeScript. Dependency Injection (DI) is a software design pattern that deals with how components get hold of their dependencies. TypeDI makes it easy to write scalable, modular, and testable code.

### Usage

TypeDI provides a container that you can use to register and retrieve dependencies in your project.

To use TypeDI, first you need to define your service class and decorate it with `@Service()` decorator:

```typescript
import { Service } from "typedi";

@Service()
export class MyService {
  // Your service logic here...
}
```

Then, you can inject the service into any other class using the `@Inject()` decorator:

```typescript
import { Service, Inject } from "typedi";
import { MyService } from "./MyService";

@Service()
export class AnotherService {
  constructor(
    @Inject()
    private myService: MyService
  ) {}

  // Rest of your class here...
}
```

You can also use TypeDI to retrieve services directly from the container:

```typescript
import { Container } from "typedi";
import { MyService } from "./MyService";

const myService = Container.get(MyService);
```

Remember, TypeDI works best with reflect-metadata, so ensure you have `import "reflect-metadata";` at the top-level of your project, and have set `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in your `tsconfig.json` file.

### Testing

TypeDI makes your code more testable, as you can easily substitute real dependencies with mocks in your tests. You can override a registered service in the container for testing purposes using `Container.set()`.

```typescript
import { Container } from "typedi";
import { MyService } from "./MyService";

// Mocking MyService
const myServiceMock = {
  /* Your mocked methods here... */
};

Container.set(MyService, myServiceMock);
```

For more information about using TypeDI, refer to the [official TypeDI documentation](https://docs.typestack.community/typedi/v/develop/).

## Testing

This project uses Jest for unit testing. To run tests, use the following command:

```bash
yarn test
```

## Troubleshooting

If you encounter any issues while setting up or using the frontend application, try checking the official NextJS, TailwindCSS, and MUI documentation for possible solutions.
