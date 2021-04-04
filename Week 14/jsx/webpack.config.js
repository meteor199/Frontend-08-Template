var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: "./src/main.js",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "createElement" },
              ],
            ],
          },
        },
      },
    ],
  },
  mode: "development",
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
    }),
  ],

  devServer: {
    contentBase: "./dist",
  },
};
