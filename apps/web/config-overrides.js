const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve("path-browserify"),
    assert: require.resolve("assert/"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    process: require.resolve("process/browser"),
    buffer: require.resolve("buffer"),
    url: require.resolve("url/")
  };
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    })
  ];
  config.ignoreWarnings = [/Failed to parse source map/]; // gets rid of a billion source map warnings
  return config;
};
