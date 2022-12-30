const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.47:5555/',
      changeOrigin: true,
    })
  );

  // 공지사항
  app.use(
    `/notice`,
    createProxyMiddleware({
      target: 'http://192.168.0.38:8000/',
      changeOrigin: true,
    })
  );
  // 업무관리
  app.use(
    `/projects`,
    createProxyMiddleware({
      target: 'http://192.168.0.38:8000/',
      changeOrigin: true,
    })
  );
  // 인사관리
  app.use(
    `/personnel`,
    createProxyMiddleware({
      target: 'http://192.168.0.38:8000/',
      changeOrigin: true,
    })
  );
};
