import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // Every class in a *.module.css file gets a unique suffix, e.g.
      //   .card  ->  Card_card__x7Qa2
      // so the same class name can be used in different components
      // without ever colliding.
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
});
