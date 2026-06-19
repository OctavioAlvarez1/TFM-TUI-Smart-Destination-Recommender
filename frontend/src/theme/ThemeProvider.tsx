// MUI theme context provider.
// Stores dark/light mode preference in localStorage for persistence across sessions.
// Exposes useDarkMode() hook for toggle access throughout the component tree.
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextType | null>(
    null
  );

export const useThemeContext = () => {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext must be used inside ThemeProvider"
    );
  }

  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [darkMode, setDarkMode] =
    useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = useMemo(
    () =>
      darkMode
        ? darkTheme
        : lightTheme,
    [darkMode]
  );

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;