const { resolve, join } = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { readdirSync, statSync } = require('fs')

const pathName = resolve(__dirname, 'src/assets')
const files = readdirSync(pathName)
const langs = files.filter((i) => statSync(resolve(pathName, i)).isDirectory())
const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

const config = {
  mode: prod ? 'production' : 'development',
  devtool: prod ? 'source-map' : 'eval-cheap-module-source-map',
  context: resolve(__dirname, './src'),
  entry: {
    options: ['./option/option.js'],
    newtab: ['./newtab/newtab.js'],
    background: ['./background/background.js'],
    popup: ['./popup/popup.js'],
    content: ['./content/content.js'],
  },
  resolve: {
    alias: {
      vue: '@vue/runtime-dom',
    },
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: prod,
        },
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.ya?ml$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __lANGS__: JSON.stringify(langs),
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Options',
      template: './index.html',
      filename: 'option.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      title: 'Add to welcome page for the tab',
      template: './index.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      title: 'New Tab',
      template: './index.html',
      filename: 'newtab.html',
      chunks: ['newtab'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json', to: 'manifest.json' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  stats: {
    assetsSort: '!size',
    children: false,
    usedExports: false,
    modules: false,
    entrypoints: false,
    // Hide source maps from output
    excludeAssets: [/\.*\.map/],
  },
}

module.exports = config
