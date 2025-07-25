// tailwind.config.js
module.exports = {
  // Asegúrate de que Tailwind escanee todos los archivos donde uses sus clases
  content: [
    "./index.html",
    "./js/**/*.js", // Para clases generadas dinámicamente en JavaScript
  ],
  theme: {
    extend: {
      // Definición de tu paleta de colores personalizada
      colors: {
        'dark-blue': '#133C55',
        'medium-blue': '#3B6FA4',
        'light-blue': '#59A5D8',
        'accent-blue': '#84D2F6',
        'lightest-blue': '#91E5F6',
        'white': '#FFFFFF',
        'gray-light': '#F8F8F8',
        'gray-medium': '#E0E0E0',
        'whatsapp-green': '#25D366',
        'whatsapp-green-hover': '#1DA851',
        'footer-bg': '#133C55',
        'footer-text': '#E0E0E0',
      },
      // Definición de la fuente Inter
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      // Ajustes de tamaño de fuente base para mejorar legibilidad
      fontSize: {
        'xs': '0.85rem',    // Ajustado para ser un poco más grande
        'sm': '0.95rem',    // Ajustado
        'base': '1rem',    // Estándar, pero asegura consistencia
        'lg': '1.125rem',  // Estándar
        'xl': '1.25rem',   // Estándar
        '2xl': '1.5rem',   // Estándar
        '3xl': '1.875rem', // Estándar
        '4xl': '2.25rem',  // Estándar
        '5xl': '3rem',     // Estándar
        '6xl': '4rem',     // Puedes añadir más si necesitas títulos muy grandes
      }
    },
  },
  plugins: [],
}
