module.exports = {
    async rewrites() {
      return [
        {
          source: '/:image*',
          destination: 'http://localhost:5000/:image*',
        },
    ]}
  }