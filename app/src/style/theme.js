import { createTheme } from '@mui/material';

/**
 * Manages theme of mui components
 */

const primary = {
    main: '#ff8a1d',
    dark: '#ffc700',
    contrastText: '#fff',
};

const secondary = {
    main: '#ff84a9',
    dark: '#cc7db6',
    contrastText: '#fff',
};
export const theme = createTheme({
    palette: {
        primary: primary,
        secondary: secondary,
    },
    typography: {
        fontFamily: `"Source Serif 4", serif`,
    },
});
