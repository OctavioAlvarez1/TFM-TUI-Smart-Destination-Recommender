import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#00A152",
    },

    secondary: {
      main: "#0288D1",
    },
  },
});

export default lightTheme;