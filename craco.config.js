const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the source-map-loader rule
      const sourceMapLoaderRule = {
        test: /\.js$/,
        loader: require.resolve('source-map-loader'),
        exclude: /node_modules\/@mediapipe\/tasks-vision/,
        enforce: 'pre',
      };

      // Add the rule to the webpack config
      addBeforeLoader(webpackConfig, loaderByName('source-map-loader'), sourceMapLoaderRule);

      return webpackConfig;
    },
  },
};