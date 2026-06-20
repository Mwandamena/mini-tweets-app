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
import PublicIcon from "@mui/icons-material/Public";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import IosShareIcon from "@mui/icons-material/IosShare";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { LuShare } from "react-icons/lu";
import { BiVolumeMute } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import { theme } from "@/theme/theme.material";

export interface MenuOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    value: "Follow",
    label: "Follow",
    icon: PublicIcon,
  },
  {
    value: "Block",
    label: "Block",
    icon: BlockIcon,
  },
  {
    value: "Mute",
    label: "Mute",
    icon: VolumeOffIcon,
  },
  {
    value: "Share",
    label: "Share",
    icon: IosShareIcon,
  },
  {
    value: "Report Post",
    label: "Report Post",
    icon: FlagCircleIcon,
  },
];

const IconWrapper: React.FC<{ Icon: React.ElementType }> = ({ Icon }) => {
  return (
    <Box>
      <Icon sx={{ color: "black", fontSize: 24 }} />
    </Box>
  );
};

export default function TweetOptions() {
  return (
    <Stack
      maxWidth="xs"
      sx={{
        width: "100%",
        maxWidth: 150,
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
              sx={{ m: 0 }}
              slotProps={{
                primary: {
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "text.primary",
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}
