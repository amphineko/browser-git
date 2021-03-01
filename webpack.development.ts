import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'
import merge from 'webpack-merge'

import createBaseConfig from './webpack.base'

export default (): Configuration => merge(createBaseConfig(), {
    devtool: 'inline-source-map',

    entry: {
        demo: './demo/index.tsx'
    },

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            // template: './index.html'
        })
    ]
})
