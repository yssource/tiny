const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const lang = new RegExp(
  `^./(${[
    'bash',
    'cpp',
    'cs',
    'css',
    'dart',
    'dockerfile',
    'go',
    'http',
    'java',
    'javascript',
    'json',
    'julia',
    'makefile',
    'markdown',
    'nginx',
    'python',
    'shell',
    'xml',
    'yaml'
  ].join('|')})$`
);

module.exports = {
  entry: {
    main: path.join(process.cwd(), 'src/index.js'),
    minor: path.join(process.cwd(), 'src/minor.js'),
    archive: path.join(process.cwd(), 'src/sass/archives.scss'),
    article: path.join(process.cwd(), 'src/sass/article.scss')
  },
  output: {
    path: path.resolve(process.cwd(), 'dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../site/assets/[name].bundle.css'
    }),
    new AssetsPlugin({
      filename: 'asserts.json',
      path: path.join(process.cwd(), 'site/data'),
      includeAllFileTypes: false,
      fileTypes: ['js', 'jsx'],
      entrypoints: true,
      prettyPrint: true
    }),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new SpriteLoaderPlugin({ plainSprite: true }),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      lang
    ),
    new CopyWebpackPlugin([
      { from: path.join(process.cwd(), 'src/robots.txt'), to: '.' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        exclude: [
          path.resolve(process.cwd(), './src/img/posts'),
          path.resolve(process.cwd(), './src/img/icons/utils')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      }, // svg sprite
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, './src/img/icons/utils'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: svgPath =>
                `../site/assets/sprite_${path.basename(
                  path.dirname(svgPath)
                )}${svgPath.substr(-4)}`
            }
          }
        ]
      },
    ]
  }
};
