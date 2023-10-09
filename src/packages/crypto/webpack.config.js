// Require the path module from Node.js
const path = require('path');
const webpack = require('webpack');

// Base configuration
const baseConfig = {
  // The entry point of the package
  entry: path.join(__dirname, 'index.ts'),

  // Configuration for module resolution
  resolve: {
    // Configure fallbacks for Node.js built-in modules
    fallback: {
      // Fallback for the buffer module, using the buffer module
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
      zlib: require.resolve('browserify-zlib'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      assert: require.resolve('assert/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      fs: false,
      path: false,
    },
    // Extensions that are used to resolve modules
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },

  // Configuration for source maps
  // devtool: 'source-map',

  // The mode to use for the webpack build
  mode: 'development',

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};

// Base configuration
const baseConfigUmd = {
  ...baseConfig,

  // Configuration for the output file
  output: {
    // The filename of the output file will be specified in each config
    // The path to the output directory, __dirname is the directory of the current module
    path: path.resolve(__dirname, 'dist'),
    // The type of the exported library
    libraryTarget: 'window', // for UMD we use window
    // The name of the library as it should be exposed in the global scope
    library: 'arcCryptoUtils',
    // The global object in which the library will be assigned to
    globalObject: 'this',
  },

  // Configuration for modules
  module: {
    parser: {
      javascript: {
        reexportExportsPresence: false,
      },
    },
    // Array of rules that are used to find and load modules
    rules: [
      /*
      {
        // Regular expression that matches the file extensions that this rule applies to
        test: /\.ts?$/,
        // The loader that should be used for the files that match the test regular expression
        loader: 'ts-loader',
        // A condition that must not be met to use this rule
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.esm.json',
        },
      },
      */
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
              '@babel/preset-flow',
            ],
          },
        },
      },
    ],
  },
};

// Export the webpack configuration object
module.exports = [
  // UMD minified
  {
    ...baseConfigUmd,
    output: {
      ...baseConfigUmd.output,
      filename: 'bundle.min.js',
    },
    optimization: {
      minimize: true,
    },
  },

  // UMD - non-minified
  {
    ...baseConfigUmd,
    output: {
      ...baseConfigUmd.output,
      filename: 'bundle.js',
    },
    optimization: {
      minimize: false,
    },
  },
];
