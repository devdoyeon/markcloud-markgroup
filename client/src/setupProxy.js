const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.25:5555/',
      changeOrigin: true,
    })
  );
  app.use(
    '/bw',
    createProxyMiddleware({
      target: 'http://192.168.0.38:8000/',
      changeOrigin: true,
      pathRewrite: {
        '^/bw': '',
      },
    })
  );
  app.use(
    '/dy',
    createProxyMiddleware({
      target: 'http://192.168.0.44:8001/',
      changeOrigin: true,
      pathRewrite: {
        '^/dy': '',
      },
    })
  );
};
