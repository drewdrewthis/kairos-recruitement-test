import { inspect } from "util";
import { deepConvertBigNumbers } from "./bignumbers/deepConvertBigNumbers";

export * from "./toURLSearchParams";
export * from "./addresses";
export * from "./strings";
export * from "./strings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepInspect(obj: any) {
  return inspect(deepConvertBigNumbers(obj), { depth: null });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDeepConsole = (obj: any) =>
  console.log.bind(console.log, deepInspect(obj));
