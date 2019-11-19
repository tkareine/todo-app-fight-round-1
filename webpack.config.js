const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

console.log("NODE_ENV: " + process.env.NODE_ENV)

const IsProdEnv = process.env.NODE_ENV === "production"

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/app.jsx")
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].min.js"
  },
  mode: IsProdEnv ? "production" : "development",
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "public")
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  performance: {
    maxAssetSize: 1024000,
    maxEntrypointSize: 1024000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(?:js|jsx)$/,
        exclude: /(?:node_modules|bower_components)/,
        loader: "babel-loader"
      }
    ]
  }
}
