const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/authenticate', '/register'],
    createProxyMiddleware({
      target: 'http://localhost:3003/',
      changeOrigin: true
    })
  );
};
