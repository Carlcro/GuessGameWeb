/* next.config.js */
const webpack = require("webpack");
const withImages = require("next-images");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

require("dotenv").config();
module.exports = withPWA(
  withImages({
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV != "production",
      runtimeCaching,
    },
    webpack: (config) => {
      const env = Object.keys(process.env).reduce((acc, curr) => {
        acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
        return acc;
      }, {});
      config.plugins.push(new webpack.DefinePlugin(env));

      return config;
    },
  })
);
