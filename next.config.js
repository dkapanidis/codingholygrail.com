// next.config.js
module.exports = {
  images: {
    domains: ['i2.ytimg.com' ,'i4.ytimg.com'],
  },
    async redirects() {
      return [
        {
          source: '/youtube',
          destination: 'https://www.youtube.com/channel/UCJxmcXMZnBtxzEcjts2y5dA',
          permanent: true,
        },
        {
          source: '/twitter',
          destination: 'https://twitter.com/dkapanidis',
          permanent: true,
        },
        {
          source: '/linkedin',
          destination: 'https://www.linkedin.com/in/kapanidis/',
          permanent: true,
        },
        {
          source: '/github',
          destination: 'https://github.com/dkapanidis',
          permanent: true,
        }
      ]
    },
}
