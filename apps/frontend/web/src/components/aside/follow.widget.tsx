import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import { MdVerified } from "react-icons/md";
import { theme } from "@/theme/theme.material";

// Mock Data for the 'Who to follow' section
const FOLLOW_DATA = [
  {
    name: "KDnuggets",
    username: "@kdnuggets",
    verified: true,
    avatar:
      "https://images.pexels.com/photos/8437021/pexels-photo-8437021.jpeg?auto=compress&cs=tinysrgb&h=60&w=60",
  },
  {
    name: "Times of Zambia Newspaper & TV",
    username: "@timesofzambia",
    verified: false,
    avatar:
      "https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&h=60&w=60",
  },
  {
    name: "Christiano Ronaldo",
    username: "@Ronaldo",
    verified: true,
    avatar:
      "https://images.pexels.com/photos/17926131/pexels-photo-17926131.jpeg?auto=compress&cs=tinysrgb&h=60&w=60",
  },
];

interface FollowItemProps {
  name: string;
  username: string;
  verified: boolean;
  avatar: string;
}

const FollowItem: React.FC<FollowItemProps> = ({
  name,
  username,
  verified,
  avatar,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        px: 2,
        cursor: "pointer",
        "&:hover": {
          bgcolor: theme.palette.grey[50],
        },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}
      >
        <Avatar src={avatar} alt={name} sx={{ width: 48, height: 48 }} />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              maxWidth={126}
              variant="body1"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </Typography>
            {verified && (
              <MdVerified
                style={{ color: theme.palette.primary.main }}
                size={16}
              />
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, lineHeight: 1.2 }}
          >
            {username}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={{
          bgcolor: "text.primary",
          color: "background.paper",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 32,
          py: 0.5,
          minWidth: 90,
          ml: 2,
          "&:hover": {
            bgcolor: "text.primary",
            opacity: 0.9,
          },
        }}
      >
        Follow
      </Button>
    </Box>
  );
};

export default function WhoToFollowWidget() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
        border: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "text.primary" }}
        >
          Who to follow
        </Typography>
      </Box>

      <Box>
        {FOLLOW_DATA.map((user, index) => (
          <Box
            key={index}
            sx={{
              borderTop:
                index > 0 ? `1px solid ${theme.palette.grey[200]}` : "none",
            }}
          >
            <FollowItem {...user} />
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, "&:hover": { bgcolor: theme.palette.grey[50] } }}>
        <Link
          href="#"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Show more
        </Link>
      </Box>
    </Box>
  );
}
