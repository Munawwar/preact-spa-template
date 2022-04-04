module.exports = function (api) {
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // alternative mode: "entry"
        corejs: 3,
        targets: 'maintained node versions',
      },
    ],
  ];
  const plugins = [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '~': '../src',
        },
      },
    ],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'preact',
      },
    ],
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-transform-assets-import-to-string',
    [
      'css-modules-transform',
      {
        extensions: ['.module.css', '.module.scss'],
      },
    ],
  ];

  /** this is just for minimal working purposes,
   * for testing larger applications it is
   * advisable to cache the transpiled modules in
   * node_modules/.bin/.cache/@babel/register* */
  api.cache(false);

  return {
    presets,
    plugins,
  };
};
