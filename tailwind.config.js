module.exports = {
  mode: 'jit',
  purge: {
    content: ['./pages/**/*.tsx', './components/**/*.tsx', './pages/**/*.jsx', './components/**/*.jsx'],
  },
  theme: {
    extend: {
      boxShadow: {
        around: '0 0 6px -1px #aaa',
      },
      colors: {
        'red-youtube': 'red',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  variants: {
    margin: ['responsive', 'last','hover'],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
