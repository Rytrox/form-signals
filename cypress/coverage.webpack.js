module.exports = {
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['istanbul']
                    }
                },
                enforce: 'post',
                exclude: /node_modules|cypress\/support|cypress\/e2e|\.spec\.ts$|\.cy\.ts$/
            }
        ]
    }
};
