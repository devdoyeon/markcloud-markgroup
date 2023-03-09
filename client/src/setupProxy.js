const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.44:5555/',
      changeOrigin: true,
    })
  );
  app.use(
    '/groupware',
    createProxyMiddleware({
      target: 'http://192.168.0.44:8001/',
      changeOrigin: true,
      pathRewrite: {
        '^/groupware': '',
      },
    })
  );
};
