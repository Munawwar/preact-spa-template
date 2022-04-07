import { defineConfig } from 'vite';
import path from 'path';
import preact from '@preact/preset-vite';
import hash from 'string-hash';
// eslint-disable-next-line import/no-unresolved
import sassDts from 'vite-plugin-sass-dts';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), sassDts()],
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins:
        process.env.NODE_ENV === 'production'
          ? [visualizer({ filename: 'bundle-analysis.html' })]
          : [],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '/src'),
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  css: {
    modules: {
      generateScopedName(name, filename) {
        return `${
          (filename.match(/([^/\\]+?)(?:\.module).css(?:.*)$/) || ['', '_'])[1]
        }-${name}-${hash(path.relative(__dirname, filename))
          .toString(36)
          .slice(0, 4)}`;
      },
    },
  },
});
