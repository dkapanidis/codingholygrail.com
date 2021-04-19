const emoji = require('remark-emoji');
const withPlugins = require('next-compose-plugins');
const images = require('remark-images')
const optimizedImages = require('next-optimized-images');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [emoji, images]
  },
})
module.exports = withPlugins([
  [optimizedImages, {
    optimizeImages: false,
  }],
  [withMDX,{pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']}]
])
