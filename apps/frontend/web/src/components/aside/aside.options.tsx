import * as React from "react";
import {
  Dialog,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Stack,
} from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { theme } from "@/theme/theme.material";

export interface MenuOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    value: "This content is not relevant to me",
    label: "This content is not relevant to me",
    icon: SentimentDissatisfiedIcon,
  },
  {
    value: "This content is spam",
    label: "This content is spam",
    icon: SentimentDissatisfiedIcon,
  },
  {
    value: "This content shows an ad",
    label: "This content shows an ad",
    icon: SentimentDissatisfiedIcon,
  },
  {
    value: "I do not want to see this",
    label: "I do not want to see this",
    icon: SentimentDissatisfiedIcon,
  },
  {
    value: "This post is false information",
    label: "This post is false information",
    icon: SentimentDissatisfiedIcon,
  },
];

const IconWrapper: React.FC<{ Icon: React.ElementType }> = ({ Icon }) => {
  return (
    <Box>
      <Icon sx={{ color: "black", fontSize: 24 }} />
    </Box>
  );
};

export default function TrendingOptions() {
  return (
    <Stack
      maxWidth="xs"
      sx={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 1,
      }}
    >
      <List disablePadding sx={{ p: 0 }}>
        {MENU_OPTIONS.map((option) => (
          <ListItemButton
            key={option.value}
            sx={{
              "&:hover": {
                bgcolor: theme.palette.grey[50],
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 30, display: "block", m: 0 }}>
              <IconWrapper Icon={option.icon} />
            </ListItemIcon>

            <ListItemText
              primary={option.label}
              slotProps={{
                primary: {
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "15px",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}
