/**
 * shared-theme/AppTheme.tsx
 *
 * The single ThemeProvider entry point for the Twitter/X design system.
 *
 * Usage:
 *   import AppTheme, { useColorMode } from '@twitter-ds/theme';
 *
 *   function Root() {
 *     return (
 *       <AppTheme defaultMode="light">
 *         <App />
 *       </AppTheme>
 *     );
 *   }
 *
 *   // Inside any child component:
 *   const { mode, setMode } = useColorMode();
 */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  getDesignTokens,
  typography,
  shape,
  breakpointsConfig,
  themeShadows,
} from "../themePrimitives";
import { getCustomizations } from "./customizations/customizations";

// ---------------------------------------------------------------------------
// Color mode context — lets any child toggle dark/light
// ---------------------------------------------------------------------------
export type ColorMode = "light" | "dark";

interface ColorModeContextValue {
  mode: ColorMode;
  setMode: Dispatch<SetStateAction<ColorMode>>;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  setMode: () => {},
  toggleMode: () => {},
});

/** Hook to read and toggle the colour mode from any child component. */
export function useColorMode(): ColorModeContextValue {
  return useContext(ColorModeContext);
}

// ---------------------------------------------------------------------------
// AppTheme props
// ---------------------------------------------------------------------------
interface AppThemeProps {
  children: ReactNode;
  /** Starting colour mode. Defaults to 'light'. */
  defaultMode?: ColorMode;
}

// ---------------------------------------------------------------------------
// AppTheme — two-pass createTheme to let customizations access a resolved theme
// ---------------------------------------------------------------------------
export default function AppTheme({
  children,
  defaultMode = "light",
}: AppThemeProps) {
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(() => {
    // Pass 1: primitives only (palette, typography, shape, spacing, shadows)
    const baseTheme = createTheme({
      palette: getDesignTokens(mode),
      typography,
      shape,
      spacing: 8,
      breakpoints: breakpointsConfig,
      shadows: themeShadows,
    });

    // Pass 2: component customizations receive the fully resolved base theme
    // so they can read palette.mode, palette.divider, etc.
    return createTheme(baseTheme, {
      components: getCustomizations(baseTheme),
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, setMode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {/*
          enableColorScheme sets the CSS color-scheme property on <html>,
          which gives native browser UI (scrollbars, inputs) correct dark/light
          treatment without extra CSS.
        */}
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
