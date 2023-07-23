/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    borderStyle: true,
    divideStyle: true,
    divideWidth: true,
    divideColor: true,
  },
  /**
   * Increase specificity of Tailwind classes
   * https://tailwindcss.com/docs/configuration#selector-strategy
   */
  important: "html",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          50: "rgba(0,0,0,.025)",
        },
        black: "#000",
        white: "#fff",
        transparent: "transparent",
      },
      fontFamily: {
        sans: ["var(--font-righteous)"],
        mono: ["var(--font-roboto-mono)"],
      },
      borderWidth: {
        1: "1px",
      },
    },
    fontFamily: {
      h1: ["var(--font-righteous)"],
      h2: ["var(--font-righteous)"],
    },
  },
};
