import { resolve as _resolve } from 'path';
import nodeExternals from 'webpack-node-externals';

export const entry = './src/index.ts';
export const target = 'node';
export const externals = [nodeExternals()];
export const output = {
    path: _resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
};
export const resolve = {
    extensions: ['.ts', '.js'],
};
export const module = {
    rules: [
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader',
        }
    ]
};
