const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./public/client/src/app.js", "@babel/polyfill"],
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpeg|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "window.Quill": "quill"
    })
  ],
  devtool: "cheap-module-eval-source-map",
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8081"
    }
  }
};
