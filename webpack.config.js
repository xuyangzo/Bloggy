const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ["./public/client/src/app.js", "@babel/polyfill"],
  output: {
    path: path.join(__dirname, "public/client/build"),
    publicPath: "public/client/build",
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
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(jpeg|jpg|woff|woff2|eot|ttf|otf|svg|png)(\?.*$|$)/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "window.Quill": "quill"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./public/index.html"
    }),
    new ExtractTextPlugin("styles.css")
  ],
  devtool: "cheap-module-eval-source-map",
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "public/client/build"),
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8081"
    }
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
