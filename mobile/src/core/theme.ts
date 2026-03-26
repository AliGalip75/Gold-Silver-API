// Fallback exact hex codes ONLY for JS-only libraries 
// (e.g., React Navigation Container or Status Bar).
// Do NOT use these in standard UI components. Use Tailwind classes instead.

export const theme = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#D4AF37',
    textPrimary: '#171717',
    textSecondary: '#737373',
    border: '#E5E5E5',
  },
  dark: {
    background: '#0A0A0A',
    surface: '#171717',
    primary: '#FFD700',
    textPrimary: '#F5F5F5',
    textSecondary: '#A3A3A3',
    border: '#262626',
  }
};

export default theme;