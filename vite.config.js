import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Allows access from your mobile device
      port: 5173, // Port on which Vite will run
      strictPort: true, // Ensures Vite does not use an alternative port
      cors: true, // Enable CORS for mobile access
    },
    root: '.',
  };
});
