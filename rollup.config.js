import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';

const packageJson = require('./package.json');

const configuration = {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'cjs',
    },
    plugins: [image(), babel({ babelHelpers: 'bundled' }), peerDepsExternal(), resolve(), commonjs(), postcss()],
};

export default configuration;
