module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config-react',
  ],
  rules: {
    'jsdoc/require-jsdoc': ['off'],
    'react/prop-types': ['off'],
  },
}
