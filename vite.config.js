// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig(({ mode }) => {
//   const isDevelopment = mode === 'development';

//   return {
//     plugins: [react()],
//     base: isDevelopment ? '/' : 'https://shubhammkc.b-cdn.net/', 
//     server: {
//       host: '0.0.0.0', 
//       port: 5173,
//       strictPort: true, 
//       cors: true, 
//     },
//     build: {
//       outDir: 'dist',
//       sourcemap: true, 
//       emptyOutDir: true, 
//       rollupOptions: {
//         output: {
//           assetFileNames: 'assets/[name]-[hash][extname]', 
//           chunkFileNames: 'assets/[name]-[hash].js',
//           entryFileNames: 'assets/[name]-[hash].js', 
//         },
//       },
//     },
//     root: '.',
//   };
// });



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', 
      port: 5173,
      strictPort: true, 
      cors: true, 
    },
    root: '.',
  };
});