import { Avatar, Box, Icon, Link, Stack, Typography } from "@mui/material";
import { TbRepeat } from "react-icons/tb";

interface UserAvatarProps {
  username: string;
  img?: string;
  variant?: "full" | "repost" | "semi" | "horizontal";
}

function UserAvatar({
  username,
  img = "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
  variant = "repost",
}: UserAvatarProps) {
  switch (variant) {
    case "repost":
      return (
        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Box sx={{ width: "16px", height: "16px" }}>
            <Icon color="primary" sx={{ rotate: "90deg", fontSize: "16px" }}>
              <TbRepeat />
            </Icon>
          </Box>
          <Typography
            variant="caption"
            color="textSecondary"
            component={Link}
            href="/profile"
            sx={{
              "&:hover": { textDecoration: "underline" },
              textDecoration: "none",
            }}
            fontWeight={600}
          >
            {username ? username : "User"} Reposted
          </Typography>
        </Stack>
      );
      break;
    case "semi":
      return (
        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Stack>
            <Typography
              variant="h6"
              color="textPrimary"
              fontSize={16}
              fontWeight={600}
              component={Link}
              href="/profile"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {username ? username : "User"}
            </Typography>
            <Typography
              component={Link}
              href="/profile"
              variant="caption"
              color="textSecondary"
              sx={{
                textDecoration: "none",
              }}
            >
              @{username ? username.split(" ")[1] : "User"}
            </Typography>
          </Stack>
        </Stack>
      );
      break;
    case "full":
      return (
        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Typography variant="caption" color="textSecondary" fontWeight={600}>
            {username ? username : "User"}
          </Typography>
        </Stack>
      );
      break;
    case "horizontal":
      return (
        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Stack direction={"row"} gap={0.5} alignItems={"center"}>
            <Typography
              variant="h6"
              color="textPrimary"
              fontSize={16}
              fontWeight={600}
              component={Link}
              href="/profile"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {username ? username : "User"}
            </Typography>
            <Typography
              component={Link}
              href="/profile"
              variant="caption"
              color="textSecondary"
              sx={{
                textDecoration: "none",
              }}
            >
              @{username ? username.split(" ")[1] : "User"}
            </Typography>
          </Stack>
        </Stack>
      );
      break;
    default:
      break;
  }
}

export default UserAvatar;
