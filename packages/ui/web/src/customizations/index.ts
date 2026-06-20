/**
 * customizations/index.ts
 *
 * Merges all component customization slices into one Components object.
 * Consumed by AppTheme.tsx via getCustomizations(theme).
 *
 * Architecture rule: this file only imports from sibling slices.
 * It never imports from outside the shared-theme folder.
 */
import type { Theme, Components } from "@mui/material/styles";
import inputsCustomizations from "./inputs";
import navigationCustomizations from "./navigation";
import surfacesCustomizations from "./surfaces";
import feedbackCustomizations from "./feedback";
import dataDisplayCustomizations from "./dataDisplay";

export function getCustomizations(theme: Theme): Components {
  return {
    ...inputsCustomizations(theme),
    ...navigationCustomizations(theme),
    ...surfacesCustomizations(theme),
    ...feedbackCustomizations(theme),
    ...dataDisplayCustomizations(theme),
  };
}
