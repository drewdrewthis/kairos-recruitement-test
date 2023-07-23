import "reflect-metadata";
import * as matchers from "jest-extended";

// https://jest-extended.jestcommunity.dev/docs/getting-started/setup
expect.extend(matchers);

// Create mocked localStorage
const localStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value.toString()),
    clear: () => (store = {}),
    removeItem: (key: string) => delete store[key],
  };
};

// @ts-expect-error - We are mocking localStorage
global.window = {};
// @ts-expect-error - We are mocking localStorage
global.window.localStorage = localStorageMock();
