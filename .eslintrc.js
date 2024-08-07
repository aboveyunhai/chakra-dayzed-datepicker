module.exports = {
  extends: [
    './node_modules\\dts-cli\\conf\\eslint-config-react-app\\index.js',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
