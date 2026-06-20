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
  ListSubheader,
  ListItemAvatar,
  Avatar,
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

export enum CommunityAudience {
  NEXTJS = "Next.js",
  REACTJS = "React.js",
}

export interface AudienceOption {
  value: ReplyAudience;
  label: string;
  icon: React.ElementType;
}

export interface CommunityOption {
  value: CommunityAudience;
  label: string;
  avatar?: string;
  members?: number;
  icon: React.ElementType;
}

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    value: ReplyAudience.EVERYONE,
    label: "Everyone",
    icon: PublicIcon,
  },
];

const COMMUNITY_OPTIONS: CommunityOption[] = [
  {
    value: CommunityAudience.NEXTJS,
    label: "Next.js",
    icon: PublicIcon,
    avatar:
      "https://pbs.twimg.com/community_banner_img/1863387589417279489/MCRqageT?format=jpg&name=120x120",
    members: 100,
  },
  {
    value: CommunityAudience.REACTJS,
    label: "React.js",
    icon: PublicIcon,
    avatar:
      "https://pbs.twimg.com/community_banner_img/1863387589417279489/MCRqageT?format=jpg&name=120x120",
    members: 100,
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

export default function AudienceMenu({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [selectedAudience, setSelectedAudience] = React.useState<ReplyAudience>(
    ReplyAudience.EVERYONE
  );
  const [selectedCommunity, setSelectedCommunity] =
    React.useState<CommunityAudience>();

  const handleSelect = (audience: ReplyAudience) => {
    setSelectedAudience(audience);
    onClose();
  };

  return (
    <Stack
      maxWidth="xs"
      sx={{
        width: "100%",
        maxWidth: 350,
        borderRadius: 1,
        py: 2,
      }}
    >
      <Box sx={{ mb: 2, px: 2 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "text.primary", mb: 0.5 }}
        >
          Who can see this post?{" "}
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
        {/* communities */}
        <ListSubheader sx={{ py: 1 }}>Communities</ListSubheader>

        {COMMUNITY_OPTIONS.map((option) => (
          <ListItemButton
            key={option.value}
            sx={{
              py: 1,
              "&:hover": {
                bgcolor: theme.palette.grey[50],
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 50 }}>
              <Avatar
                variant="rounded"
                slotProps={{
                  root: {
                    style: {
                      borderRadius: 8,
                    },
                  },
                }}
                src={option.avatar}
              />
            </ListItemAvatar>

            <Box sx={{ ml: 1 }} width={"100%"}>
              <ListItemText
                primary={option.label}
                slotProps={{
                  primary: {
                    fontWeight: 700,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    maxWidth: 150,
                    width: "100%",
                  },
                }}
              />

              <Stack
                direction="row"
                alignItems="center"
                sx={{ color: "text.secondary" }}
                spacing={0.2}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "text.secondary" }}
                >
                  {option.members}
                </Typography>
                <Typography variant="body2">members</Typography>
              </Stack>
            </Box>

            {selectedCommunity === option.value && (
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
