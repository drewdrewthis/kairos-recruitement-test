import constants from "./constants";
import * as addresses from "./addresses";
import * as abis from "./abis";
import * as contracts from "./contracts";

const config = {
  ...constants,
  ...addresses,
  ...abis,
  ...contracts,
};

export default config;
