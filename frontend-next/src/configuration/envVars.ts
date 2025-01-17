/**
 * Environment variables
 * @see https://nextjs.org/docs/basic-features/environment-variables
 *
 * We use this because env vars from NextJS can not be accessed by a key name
 * and it allows us to define the schema.
 */
export const envVars = {
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  NEXT_PUBLIC_WS_RPC_URL: process.env.NEXT_PUBLIC_WS_RPC_URL,
  CONTRACT_CREATION_BLOCK: process.env.CONTRACT_CREATION_BLOCK,
};

export type EnvVar = keyof typeof envVars;
