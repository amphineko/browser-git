import path from 'path'
import { Configuration, ProvidePlugin } from 'webpack'

export default (): Configuration => ({
    context: path.resolve(__dirname, 'src'),

    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json')
                    }
                }
            }
        ]
    },

    optimization: {
        splitChunks: {
            minChunks: 1
        },
        runtimeChunk: 'multiple'
    },

    output: {
        libraryTarget: 'commonjs2'
    },

    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ],

    resolve: {
        alias: {
            buffer: 'buffer',
            path: 'path-browserify'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }
})
