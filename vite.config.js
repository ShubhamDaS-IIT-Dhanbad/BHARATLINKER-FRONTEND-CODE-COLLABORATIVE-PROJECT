import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    base: isDevelopment ? '/' : 'https://shubhammkc.b-cdn.net/', // Base URL for CDN in production
    server: {
      host: '0.0.0.0', // Allows access from your mobile device
      port: 5173, // Port on which Vite will run
      strictPort: true, // Ensures Vite does not use an alternative port
      cors: true, // Enable CORS for mobile access
    },
    build: {
      outDir: 'dist', // Output directory
      sourcemap: true, // Enable source maps for debugging
      emptyOutDir: true, // Clear the dist directory before building
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]', // Ensuring asset file names are properly hashed
          chunkFileNames: 'assets/[name]-[hash].js', // Ensuring chunk file names are properly hashed
          entryFileNames: 'assets/[name]-[hash].js', // Ensuring entry file names are properly hashed
        },
      },
    },
    root: '.', // Ensure the root directory is correctly set
  };
});
