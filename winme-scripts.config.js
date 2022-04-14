const { defineConfig } = require('@winme/webpack-scripts');

module.exports = defineConfig({
  entry: 'src/entry.tsx',
  devServer: {
    port: 4000,
  },
  babel: {
    presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
    plugins: ['@emotion'],
  },
});
