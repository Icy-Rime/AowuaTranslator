const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {GenerateSW} = require("workbox-webpack-plugin");

module.exports = {
  // mode: "production",
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: {
    wasm_worker: "./src/workers/wasm_worker.js",
    main: "./src/main.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
    port: 12680,
    noInfo: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: ["**/*.wat"],
          },
        },
      ],
    }),
    new GenerateSW({
      inlineWorkboxRuntime: true,
      skipWaiting: true,
      clientsClaim: true,
      offlineGoogleAnalytics: false,
      swDest: "service-worker.js",
    }),
  ],
};
