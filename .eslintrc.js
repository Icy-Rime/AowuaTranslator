module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    "semi": ["warn", "always",],
    "comma-style": ["warn", "last"],
    "comma-spacing": ["warn", { "before": false, "after": true }],
    "comma-dangle": ["warn", "always-multiline"],
    "quotes": ["warn", "double"],
  },
}
