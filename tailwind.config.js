// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Angular templates y archivos TypeScript
  ],
  theme: {
    extend: {},
    container: { // Añadir configuración de contenedor centrado
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
}