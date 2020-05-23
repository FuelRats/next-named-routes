/* eslint-env node */
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import autoExternal from 'rollup-plugin-auto-external'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'





const config = {
  input: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    exports: 'named',
    file: path.resolve(__dirname, 'dist', 'index.js'),
    format: 'cjs',
  },
  external: [
    'next/link',
    'next/router',
  ],
  plugins: [
    autoExternal(),
    resolve(),
    babel(),
    uglify(),
  ],
}





export default config
