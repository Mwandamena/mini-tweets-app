import { current } from "@reduxjs/toolkit";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // check the localstorage theme
  useEffect(() => {
    const dark = JSON.parse(localStorage.getItem("darkMode"));
    if (dark) {
      setDarkMode(true);
    }
  }, []);

  // toggle the theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
