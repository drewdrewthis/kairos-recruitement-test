/* eslint-disable @typescript-eslint/no-var-requires */
import { envVars, EnvVar } from "@/configuration/envVars";

require("dotenv").config({
  paths: `../.env`,
});

require("dotenv").config({
  paths: `.env.${process.env.NEXT_PUBLIC_NETWORK}`,
});

/**
 * Get environment variable. Throws an error if the variable is not set.
 * @param key
 * @returns
 */
export function getEnv(key: EnvVar) {
  const value = envVars[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key as string}`);
  }

  return value;
}
