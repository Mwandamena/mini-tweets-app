import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw Error("useThme must be used within the context of the applicaton");
  }

  return context;
};
