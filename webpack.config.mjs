import path from 'path';

export default {
  mode: 'development', // Use 'production' for optimized builds
  entry: './src/index.js', // Adjust based on your project structure
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/, // Apply only to CSS Modules
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64:6]', // Generates obfuscated class names
              },
            },
          },
        ],
      },
      {
        test: /\.css$/, // For global styles (non-modules)
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.resolve(process.cwd(), 'dist'),
    hot: true,
  },
};
