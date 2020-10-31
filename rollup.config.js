import typescript from 'rollup-plugin-typescript2'; // 支持 typescript
import resolve from '@rollup/plugin-node-resolve'; // 告诉 Rollup 如何查找外部模块
import commonjs from '@rollup/plugin-commonjs'; // commonjs 转换成 es module（通常是外部模块）
import alias from '@rollup/plugin-alias'; // 路径别名
import postcss from 'rollup-plugin-postcss'; // css 支持
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies).concat(['ultra-editor']); // 禁止打包的模块

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/lib/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'default',
    },
  ],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    alias({
      entries: {
        lib: './src/lib',
      },
    }),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.node'],
    }),
    postcss(),
  ],
  external,
};

export default config;
