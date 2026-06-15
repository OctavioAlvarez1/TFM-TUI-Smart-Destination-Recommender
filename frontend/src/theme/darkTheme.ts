import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#0EA5E9",
    },

    secondary: {
      main: "#38BDF8",
    },

    background: {
      default: "#0B1220",
      paper: "#111827",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default darkTheme;