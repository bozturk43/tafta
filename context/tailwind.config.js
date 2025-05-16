/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",   // app dizini
      "./components/**/*.{js,ts,jsx,tsx}", // components dizini
      "./pages/**/*.{js,ts,jsx,tsx}",  // Eğer pages dizin varsa
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  