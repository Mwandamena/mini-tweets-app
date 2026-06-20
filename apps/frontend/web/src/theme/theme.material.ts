import {
  createTheme,
  PaletteOptions,
  ThemeOptions,
} from "@mui/material/styles";

// Custom shadows (Twitter style)
const customShadows = [
  "none",
  "rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px",
  "rgba(101, 119, 134, 0.2) 0px 0px 20px, rgba(101, 119, 134, 0.15) 0px 0px 4px 1px",
  "rgba(101, 119, 134, 0.2) 0px 0px 25px, rgba(101, 119, 134, 0.15) 0px 0px 5px 1px",
  "rgba(101, 119, 134, 0.2) 0px 0px 30px, rgba(101, 119, 134, 0.15) 0px 0px 6px 1px",
  "rgba(101, 119, 134, 0.2) 0px 0px 35px, rgba(101, 119, 134, 0.15) 0px 0px 7px 1px",
];
const twitterShadows = [...customShadows, ...Array(19).fill("none")];

const palette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#1DA1F2",
    contrastText: "#fff",
    light: "#8ED0F9",
    dark: "#1A91DA",
  },
  secondary: {
    main: "#14171A",
    contrastText: "#fff",
    light: "#657786",
    dark: "#000000",
  },
  error: {
    main: "#F4212E",
    contrastText: "#fff",
    light: "#F85866",
    dark: "#DC1A27",
  },
  warning: {
    main: "#FFAD1F",
    contrastText: "#14171A",
    light: "#FFC04C",
    dark: "#E69A1A",
  },
  success: {
    main: "#17BF63",
    contrastText: "#fff",
    light: "#45CC82",
    dark: "#13A556",
  },
  background: { default: "#FFFFFF", paper: "#FFFFFF" },
  text: {
    primary: "#14171A",
    secondary: "#657786",
    disabled: "#AAB8C2",
  },
  divider: "#E1E8ED",
  action: {
    active: "#1DA1F2",
    hover: "rgba(29, 161, 242, 0.1)",
    selected: "rgba(29, 161, 242, 0.15)",
    disabled: "#AAB8C2",
    disabledBackground: "#E1E8ED",
    focus: "rgba(29, 161, 242, 0.2)",
  },
};

const typography = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  fontSize: 15,
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 700,
  fontWeightBold: 900,
  h1: {
    fontSize: "31px",
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#14171A",
    light: "#14171A",
    dark: "#F7F9F9",
  },
  h2: {
    fontSize: "23px",
    fontWeight: 800,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
    color: "#14171A",
    dark: "#F7F9F9",
  },
  h3: {
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.4,
    color: "#14171A",
    dark: "#F7F9F9",
  },
  h4: { fontSize: "17px", fontWeight: 700, lineHeight: 1.4, color: "#14171A" },
  h5: { fontSize: "15px", fontWeight: 700, lineHeight: 1.4, color: "#14171A" },
  h6: { fontSize: "13px", fontWeight: 700, lineHeight: 1.4, color: "#14171A" },
  body1: {
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#14171A",
  },
  body2: {
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#657786",
  },
  button: {
    fontSize: "15px",
    fontWeight: 700,
    textTransform: "none",
    lineHeight: 1.4,
  },
  caption: {
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#657786",
  },
  overline: {
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1.4,
    color: "#657786",
  },
};

// Component overrides
const components: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        borderRadius: 9999,
        fontWeight: 600,
        fontSize: "15px",
        textTransform: "none",
        padding: "12px 24px",
        boxShadow: "none",
        transition: "all 0.15s ease-in-out",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          transform: "scale(0.99)",
        },
      },
      contained: {
        "&:hover": { backgroundColor: "#1A91DA" },
        "&:active": {
          transform: "scale(0.99)",
        },
      },
      outlined: {
        borderWidth: "1px",
        borderColor: "#CFD9DE",
        color: "#0F1419",
        "&:hover": {
          backgroundColor: "rgba(15, 20, 25, 0.05)",
          borderColor: "#CFD9DE",
        },
        "&:active": {
          transform: "scale(0.99)",
        },
      },
      text: {
        padding: "8px 16px",
        "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
      },
      sizeSmall: { padding: "6px 16px", fontSize: "13px" },
      sizeLarge: { padding: "16px 32px", fontSize: "17px" },
    },

    variants: [
      {
        props: { variant: "link" },
        style: {
          textTransform: "none",
          fontWeight: 700,
          fontSize: "15px",
          color: "#1DA1F2",
          padding: "8px 16px",
          "&:focus-within": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
        },
      },
    ],
  },

  MuiIconButton: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        borderRadius: 9999,
        padding: 8,
        "&:hover": { backgroundColor: "rgba(29,161,242,0.1)" },
        "&:active": {
          transform: "scale(0.97)",
        },
      },
    },
  },
  MuiTab: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 700,
        fontSize: "15px",
        "&.Mui-selected": { color: "#0F1419" },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: "#1DA1F2",
        height: 4,
        borderRadius: "2px 2px 0 0",
      },
    },
  },
  MuiListItemButton: { defaultProps: { disableRipple: true } },
  MuiMenuItem: { defaultProps: { disableRipple: true } },
  MuiButtonBase: { defaultProps: { disableRipple: true } },

  // Forms - FIXED
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        fontSize: "15px",
        transition: "background-color 0.2s, border-color 0.2s",

        // Default state
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#CFD9DE",
          borderWidth: "1px",
          transition: "border-color 0.2s, border-width 0.2s",
        },

        // Hover state (only when not focused or error)
        "&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#8899A6",
          },

        // Focused state
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1DA1F2",
          borderWidth: "2px",
        },

        // Error state
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: "#F4212E",
        },

        // Disabled state
        "&.Mui-disabled": {
          backgroundColor: "#F5F8FA",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E1E8ED",
          },
        },
      },
      input: {
        padding: "16px 16px",
        fontSize: "15px",
        color: "#14171A",

        "&::placeholder": {
          color: "#657786",
          opacity: 1,
        },

        "&:disabled": {
          color: "#AAB8C2",
          WebkitTextFillColor: "#AAB8C2",
        },
      },
      multiline: {
        padding: "16px 16px",
      },
    },
  },

  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 4,
        backgroundColor: "transparent",
        border: "1px solid #CFD9DE",
        fontSize: "15px",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",

        "&:before": {
          display: "none",
        },

        "&:after": {
          display: "none",
        },

        // Hover state
        "&:hover": {
          backgroundColor: "transparent",
          borderColor: "#8899A6",
        },

        // Focused state
        "&.Mui-focused": {
          backgroundColor: "transparent",
          borderColor: "#1DA1F2",
          borderWidth: "2px",

          "& .MuiFilledInput-input": {
            paddingLeft: "15px", // Adjust for thicker border
          },
        },

        // Error state
        "&.Mui-error": {
          borderColor: "#F4212E",

          "&.Mui-focused": {
            borderColor: "#F4212E",
            borderWidth: "2px",
          },
        },

        // Disabled state
        "&.Mui-disabled": {
          backgroundColor: "#F5F8FA",
          borderColor: "#E1E8ED",
          opacity: 0.7,
        },
      },
      input: {
        padding: "16px 16px",
        fontSize: "15px",
        color: "#14171A",

        "&::placeholder": {
          color: "transparent",
          opacity: 0,
        },

        "&:disabled": {
          color: "#AAB8C2",
          WebkitTextFillColor: "#AAB8C2",
        },
      },
      multiline: {
        padding: "28px 16px 12px 16px",
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: "15px",
        color: "#657786",

        "&.Mui-focused": {
          color: "#1DA1F2",
        },

        "&.Mui-error": {
          color: "#F4212E",
        },

        "&.Mui-disabled": {
          color: "#AAB8C2",
        },
      },
      outlined: {
        "&.MuiInputLabel-shrink": {
          fontSize: "13px",
          fontWeight: 600,
        },
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: "13px",
        marginTop: "6px",
        marginLeft: "14px",

        "&.Mui-error": {
          color: "#F4212E",
        },
      },
    },
  },

  MuiSelect: {
    styleOverrides: {
      select: {
        padding: "16px 16px",
        fontSize: "15px",
      },
      icon: {
        color: "#657786",
      },
    },
  },

  MuiAutocomplete: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          padding: "0",
        },
      },
      inputRoot: {
        padding: "8px 16px",
      },
      input: {
        padding: "8px 0 !important",
      },
      popupIndicator: {
        color: "#657786",
      },
    },
  },

  // Additional form components
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        color: "#657786",
        "&.Mui-checked": {
          color: "#1DA1F2",
        },
        "&:hover": {
          backgroundColor: "rgba(29, 161, 242, 0.1)",
        },
      },
    },
  },

  MuiRadio: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        color: "#657786",
        "&.Mui-checked": {
          color: "#1DA1F2",
        },
        "&:hover": {
          backgroundColor: "rgba(29, 161, 242, 0.1)",
        },
      },
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 51,
        height: 31,
        padding: 0,
      },
      switchBase: {
        padding: 4,
        "&.Mui-checked": {
          transform: "translateX(20px)",
          color: "#FFFFFF",
          "& + .MuiSwitch-track": {
            backgroundColor: "#1DA1F2",
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 23,
        height: 23,
      },
      track: {
        borderRadius: 9999,
        backgroundColor: "#CFD9DE",
        opacity: 1,
      },
    },
  },

  // CARD COMPONENT
  MuiCard: {
    styleOverrides: {
      root: {
        elevation: 0,
        boxShadow: "none",
      },
    },

    variants: [
      {
        props: { variant: "tweet" },
        style: {
          boxShadow: "none",
          borderRadius: 0,
          p: 1,
          m: 0,
          width: "100%",
          backgroundColor: "inherit",
          padding: "8px 16px",
          borderBottom: "1px solid #CFD9DE",
        },
      },
    ],
  },
};

export const theme = createTheme({
  palette: palette,
  typography,
  spacing: 8,
  shape: { borderRadius: 16 },
  breakpoints: { values: { xs: 0, sm: 600, md: 1000, lg: 1280, xl: 1920 } },
  shadows: twitterShadows as any,
  components,
});

// Dark theme variant
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1DA1F2",
      contrastText: "#fff",
      light: "#8ED0F9",
      dark: "#1A91DA",
    },
    secondary: {
      main: "#E7E9EA",
      contrastText: "#000",
      light: "#F7F9F9",
      dark: "#8B98A5",
    },
    error: {
      main: "#F4212E",
      contrastText: "#fff",
      light: "#F85866",
      dark: "#DC1A27",
    },
    warning: {
      main: "#FFAD1F",
      contrastText: "#14171A",
      light: "#FFC04C",
      dark: "#E69A1A",
    },
    success: {
      main: "#17BF63",
      contrastText: "#fff",
      light: "#45CC82",
      dark: "#13A556",
    },
    background: {
      default: "#15202B",
      paper: "#192734",
    },
    text: {
      primary: "#E7E9EA",
      secondary: "#8B98A5",
      disabled: "#5B7083",
    },
    divider: "#38444D",
    action: {
      active: "#1DA1F2",
      hover: "rgba(29, 161, 242, 0.1)",
      selected: "rgba(29, 161, 242, 0.15)",
      disabled: "#5B7083",
      disabledBackground: "#253341",
      focus: "rgba(29, 161, 242, 0.2)",
    },
  },
  typography,
  spacing: 8,
  shape: { borderRadius: 16 },
  breakpoints: { values: { xs: 0, sm: 600, md: 1000, lg: 1280, xl: 1920 } },
  shadows: twitterShadows as any,
  components: {
    ...components,
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#192734",
          fontSize: "15px",
          transition: "background-color 0.2s, border-color 0.2s",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#38444D",
            borderWidth: "1px",
            transition: "border-color 0.2s, border-width 0.2s",
          },

          "&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#536471",
            },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1DA1F2",
            borderWidth: "2px",
          },

          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F4212E",
          },

          "&.Mui-disabled": {
            backgroundColor: "#253341",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#38444D",
            },
          },
        },
        input: {
          padding: "16px 16px",
          fontSize: "15px",
          color: "#E7E9EA",

          "&::placeholder": {
            color: "#8B98A5",
            opacity: 1,
          },

          "&:disabled": {
            color: "#5B7083",
            WebkitTextFillColor: "#5B7083",
          },
        },
        multiline: {
          padding: "16px 16px",
        },
      },
    },
    MuiButton: {
      ...components.MuiButton,
      styleOverrides: {
        ...components.MuiButton?.styleOverrides,
        outlined: {
          borderWidth: "1px",
          borderColor: "#536471",
          color: "#E7E9EA",
          "&:hover": {
            backgroundColor: "rgba(239, 243, 244, 0.1)",
            borderColor: "#536471",
          },
        },
      },
    },
  },
});
