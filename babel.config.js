module.exports = {
  plugins: [
    '@babel/plugin-transform-runtime',
    '@emotion/babel-plugin'
  ],
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@emotion/react'
      }
    ],
    '@babel/preset-typescript',
  ]
}
