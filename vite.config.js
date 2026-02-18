import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-simple.png', 'logo.png'],
      manifest: {
        name: 'Terramarya Reservations',
        short_name: 'Terramarya',
        description: 'Reserva tu mesa en Terramarya y Café de Villa',
        theme_color: '#1a1410', // wood-900
        background_color: '#1a1410',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-icon.png',
            sizes: '192x192', // Resized by browser/device
            type: 'image/png'
          },
          {
            src: 'pwa-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true
  },
  base: '/terramarya-demo/'
})
