module.exports = {
    plugins: [
      require('postcss-purgecss')({
        content: [
          './src/**/*.html',
          './src/**/*.js',
          './src/**/*.jsx',
          './src/**/*.ts',
          './src/**/*.tsx',
        ],
      }),
    ],
  };
  