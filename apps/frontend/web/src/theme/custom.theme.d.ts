import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    dark: string;
    light: string;
  }

  interface BackgroundOptions {
    dark?: string;
    light?: string;
  }

  interface TypeText {
    hint: string;
  }

  interface TextOptions {
    hint?: string;
  }
}

// CARD OVERRIDES
declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    tweet: true;
  }
}

declare module "@mui/material/Card" {
  interface CardPropsVariantOverrides {
    tweet: true;
  }
}

// Button overrides
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    link: true;
  }
}
