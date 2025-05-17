/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",   // app dizini
      "./components/**/*.{js,ts,jsx,tsx}", // components dizini
      "./pages/**/*.{js,ts,jsx,tsx}",  // Eğer pages dizin varsa
    ],
    theme: {
      extend: {
      fontFamily: {
        sans: ['var(--font-roboto-condensed)', 'sans-serif'],
        // Özel bir class eklemek isterseniz:
        condensed: ['var(--font-roboto-condensed)', 'sans-serif'],
      },
    },
    },
    plugins: [],
  };
  