module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/gallery/protest-and-unrest',
        destination: '/gallery/protest',
        permanent: true, // true = 308 permanent, false = 307 temporary
      },
    ]
  },
}
