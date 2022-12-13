module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const ignoreWarnings = [{ message: /Failed to parse source map/ }];

      return {
        ...webpackConfig,
        ignoreWarnings,
      };
    },
  },
};
