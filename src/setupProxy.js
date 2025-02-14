const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.38:5555/',
      changeOrigin: true,
    })
  );
  app.use(
    '/groupware',
    createProxyMiddleware({
      // target: 'http://192.168.0.32:8001/',
      target: 'http://192.168.0.38:3001/',
      changeOrigin: true,
      pathRewrite: {
        '^/groupware': '',
      },
    })
  );
};
