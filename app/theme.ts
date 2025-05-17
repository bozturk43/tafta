// app/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Mavi tonu
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0', // Mor tonu
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-roboto-condensed)',
      'Arial',
      'sans-serif',
    ].join(','),
    // İsteğe bağlı: Başlık stillerini özelleştirin
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
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