const path = require('path');

const pathTo = (p) => path.join(__dirname, p);

module.exports = {
  extends: ['airbnb', 'airbnb/hooks'],
  env: { browser: true },

  rules: {
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'import/no-webpack-loader-syntax': 'off',
    'import/extensions': 'off',
    'import/order': 'off',
    'import/newline-after-import': 'off',
    'react/static-property-placement': 'off',
    'react/state-in-constructor': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/no-danger': 'off',
    'react/jsx-fragments': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
  },
  // Support modern JS syntax
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: pathTo('.babelrc'),
    },
  },

  // Recognize relative imports from the 'src' directory
  settings: {
    'import/resolver': {
      node: {
        paths: [pathTo('src')],
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      },
    },
  },
};
