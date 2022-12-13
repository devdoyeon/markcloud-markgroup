const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
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
};

// module.exports = function (app) {
//   app.use(
//     '/notice',
//     createProxyMiddleware({
//       target: 'http://192.168.0.38:8000',
//       changeOrigin: true,
//     })
//   );
// };
