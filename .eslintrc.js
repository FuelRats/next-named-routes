module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config-react',
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    'jsdoc/require-jsdoc': ['off'],
    'react/prop-types': ['off'],
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
