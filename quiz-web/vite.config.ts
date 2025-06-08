import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: `${env.VITE_FRONT_HOST}`,
      strictPort: true,
      port: parseInt(env.VITE_FRONT_PORT, 10)
    },
  };
});
