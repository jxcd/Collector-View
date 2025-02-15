const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const mapping = {
        "/api": "http://localhost:8888"
    }

    Object.entries(mapping).forEach(([prefix, target]) => {
        app
            .use(prefix, createProxyMiddleware({
                    target: 'http://localhost:8888',
                    changeOrigin: true,
                    pathRewrite: {
                        [`^${prefix}`]: '',
                    },
                })
            )
    });
};
