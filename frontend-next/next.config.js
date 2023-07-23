/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance improvements
  // https://github.com/vercel/next.js/discussions/17977
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
    "@material-ui/core/": {
      transform: "@material-ui/core/{{member}}",
    },
    "@material-ui/lab/": {
      transform: "@material-ui/lab/{{member}}",
    },
    "@material-ui/icons/?(((\\w*)?/?)*)": {
      transform: "@material-ui/icons/{{ matches.[1] }}/{{member}}",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  reactStrictMode: true,
  eslint: {
    dirs: ["."],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
