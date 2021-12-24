import fs from 'fs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const external = ['react', 'react-dom'];

// https://www.npmjs.com/package/@rollup/plugin-babel/v/5.2.1#babelhelpers
const esExtelrnals = [...external, /@emotion\/react/, /@babel\/runtime/, ...Object.keys(pkg.dependencies)];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

fs.rmSync('./lib', { recursive: true, force: true });
fs.rmSync('./es', { recursive: true, force: true });
fs.rmSync('./dist', { recursive: true, force: true });

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

/** @type{import('rollup').OutputOptions[]}*/
const output = [
  {
    format: 'cjs',
    preserveModules: true,
    dir: 'lib',
    exports: 'named',
    globals,
  },
  {
    format: 'es',
    preserveModules: true,
    dir: 'es',
    globals,
  },
  {
    format: 'umd',
    file: 'dist/index.js',
    name: 'UltraEditor',
    globals: {
      ...globals,
      '@emotion/react/jsx-runtime': 'jsxRuntime',
      '@emotion/react': 'react$1',
    },
  },
];

const configs = output.map(item => {
  /** @type{import('rollup').RollupOptions*/
  const config = {
    external: item.format === 'umd' ? external : esExtelrnals,
    input: 'src/index.ts',
    output: item,
    plugins: [
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
        ignore: ['node_modules/**'],
        presets: [
          ['@babel/preset-env', { modules: false }],
          ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
          '@babel/preset-typescript',
        ],
        plugins: [['@babel/plugin-transform-runtime']],
      }),
      resolve({
        browser: true,
        extensions,
      }),
      commonjs(),
    ],
  };

  return config;
});

export default configs;
