/* eslint-disable no-unused-vars */
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config.js";

import { SimplePaletteColorOptions, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    white: SimplePaletteColorOptions;
  }

  interface PaletteOptions {
    white: SimplePaletteColorOptions;
  }
}

declare module "@mui/material" {
  interface ButtonPropsColorOverrides {
    white: true;
  }
}

// eslint-disable-next-line
const tailwind = resolveConfig(tailwindConfig);

export const muiTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        // eslint-disable-next-line
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "contained" && {}),
          ...(ownerState.color === "white" && {}),
        }),
      },
    },
  },
};
