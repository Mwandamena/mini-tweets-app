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
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import CheckIcon from "@mui/icons-material/Check";

export enum ReplyAudience {
  EVERYONE = "Everyone",
  FOLLOWED_ACCOUNTS = "Accounts you follow",
  VERIFIED_ACCOUNTS = "Verified accounts",
  MENTIONED_ACCOUNTS = "Only accounts you mention",
}

export interface AudienceOption {
  value: ReplyAudience;
  label: string;
  icon: React.ElementType;
}

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    value: ReplyAudience.EVERYONE,
    label: "Everyone",
    icon: PublicIcon,
  },
  {
    value: ReplyAudience.FOLLOWED_ACCOUNTS,
    label: "Accounts you follow",
    icon: PeopleOutlineIcon,
  },
  {
    value: ReplyAudience.VERIFIED_ACCOUNTS,
    label: "Verified accounts",
    icon: VerifiedUserOutlinedIcon,
  },
  {
    value: ReplyAudience.MENTIONED_ACCOUNTS,
    label: "Only accounts you mention",
    icon: AlternateEmailOutlinedIcon,
  },
];

const CircularIconWrapper: React.FC<{ Icon: React.ElementType }> = ({
  Icon,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: theme.palette.primary.light + "33",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
    </Box>
  );
};

export default function ReplyAudienceMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  const theme = useTheme();
  const [selectedAudience, setSelectedAudience] = React.useState<ReplyAudience>(
    ReplyAudience.EVERYONE
  );

  const handleSelect = (audience: ReplyAudience) => {
    setSelectedAudience(audience);
    onClose();
  };

  return (
    <Stack
      maxWidth="xs"
      sx={{
        width: "100%",
        maxWidth: 320,
        borderRadius: 1,
        py: 2,
      }}
    >
      <Box sx={{ mb: 2, px: 2 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "text.primary", mb: 0.5 }}
        >
          Who can reply?
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.3 }}
        >
          Choose who can reply to this post. Anyone mentioned can always reply.
        </Typography>
      </Box>

      <List disablePadding>
        {AUDIENCE_OPTIONS.map((option) => (
          <ListItemButton
            key={option.value}
            onClick={() => handleSelect(option.value)}
            sx={{
              py: 1,
              "&:hover": {
                bgcolor: theme.palette.grey[50],
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 50 }}>
              <CircularIconWrapper Icon={option.icon} />
            </ListItemIcon>

            <ListItemText
              primary={option.label}
              primaryTypographyProps={{
                fontWeight: 700,
                color: "text.primary",
              }}
            />

            {selectedAudience === option.value && (
              <ListItemIcon
                sx={{ minWidth: 40, color: theme.palette.primary.main }}
              >
                <CheckIcon />
              </ListItemIcon>
            )}
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}
