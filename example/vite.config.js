import { defineConfig } from 'vite';
import ReactPlugin from 'vite-preset-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chakra-dayzed-datepicker/",
  plugins: [
    ReactPlugin({
      injectReact: false,
    }),
  ],
  server: {
    fs: {
      allow: ['..']
    }
  }
});
