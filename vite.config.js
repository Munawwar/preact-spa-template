import { defineConfig } from 'vite';
import path from 'path';
import preact from '@preact/preset-vite';
import hash from 'string-hash';
// eslint-disable-next-line import/no-unresolved
import sassDts from 'vite-plugin-sass-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), sassDts()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '/src'),
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
