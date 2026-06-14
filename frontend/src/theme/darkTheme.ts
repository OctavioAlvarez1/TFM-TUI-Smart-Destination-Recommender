import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#00C853",
    },

    secondary: {
      main: "#4FC3F7",
    },

    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
});

export default darkTheme;