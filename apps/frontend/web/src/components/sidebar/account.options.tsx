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
import { theme } from "@/theme/theme.material";
import { MdOutlineSettings } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { UserIcon } from "@phosphor-icons/react";

export interface MenuOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    value: "Profile",
    label: "Profile",
    icon: UserIcon,
  },
  {
    value: "Settings",
    label: "Settings",
    icon: MdOutlineSettings,
  },
  { value: "Logout", label: "Logout", icon: TbLogout },
];

const IconWrapper: React.FC<{ Icon: React.ElementType }> = ({ Icon }) => {
  return (
    <Box>
      <Icon style={{ color: "black", fontSize: 24 }} />
    </Box>
  );
};

export default function AccountOptions() {
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
