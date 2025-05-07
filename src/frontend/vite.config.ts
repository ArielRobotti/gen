import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    global: 'globalThis',
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'local'),
  },
})

//__________________________________________________

// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig(({ mode }) => {
//   // 1. Cargar manualmente las variables del .env raíz
//   const env = loadEnv(mode, '../../', [
//     'DFX_NETWORK',
//     'CANISTER_ID_BACKEND',
//     'CANISTER_ID_FRONTEND'
//     // Agrega otras variables que necesites
//   ]);

//   // 2. Mantener tu configuración existente
//   return {
//     plugins: [
//       react(),
//       tailwindcss(), // Tu configuración actual de Tailwind
//     ],
//     define: {
//       global: 'globalThis',
//       // 3. Exponer las variables necesarias
//       'process.env.DFX_NETWORK': JSON.stringify(env.DFX_NETWORK || 'local'),
//       'process.env.CANISTER_ID_BACKEND': JSON.stringify(env.CANISTER_ID_BACKEND),
//       'process.env.CANISTER_ID_FRONTEND': JSON.stringify(env.CANISTER_ID_FRONTEND),
//       // Agrega otras variables aquí
//     }
//   };
// });