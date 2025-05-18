// app/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2A3788',
      light: '#F9F9F9',
      dark: '#1C1D3A',
    },
    secondary: {
      main: '#97C11F',
      light: '#F0D300',
      dark: '#E42528',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-poppins)', // Next.js'de tanımlı Poppins font değişkeni
      'Arial',
      'sans-serif'
    ].join(','),

    // İsteğe bağlı başlık stilleri (Poppins'e uygun)
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
      fontFamily: 'var(--font-poppins)',
    },
    h2: {
      fontWeight: 600,
      fontFamily: 'var(--font-poppins)',
    },
    h3: {
      fontWeight: 500,
      fontFamily: 'var(--font-poppins)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          letterSpacing: '0.028em', // Condensed font için daha sık aralık
        },
      },
    },
  },
});