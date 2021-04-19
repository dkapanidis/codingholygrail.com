module.exports = {
  purge: {
    content: ['./pages/**/*.tsx', './components/**/*.tsx', './pages/**/*.jsx', './components/**/*.jsx'],
  },
  theme: {
    extend: {},
  },
  variants: {
    margin: ['responsive', 'last'],
    margin: ['responsive', 'hover'],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
