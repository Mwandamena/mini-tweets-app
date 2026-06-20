import {
  Avatar,
  Button,
  Card,
  Chip,
  Icon,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ImageIcon,
  MapPinIcon,
  SmileyIcon,
} from "@phosphor-icons/react/dist/ssr";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PiGifFill } from "react-icons/pi";
import { AudienceButton } from "../post/post.modal";
import AppMenu from "../global/menu";
import AudienceMenu from "../post/audience.menu";
import { theme } from "@/theme/theme.material";
import React from "react";

function HomePost() {
  // form state
  const [postContent, setPostContent] = React.useState("");
  const isPostDisabled = postContent.trim().length === 0;

  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: "0",
      }}
      elevation={0}
    >
      <Stack width={"100%"} direction={"row"}>
        <Stack minWidth={"60px"}>
          <Avatar
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            component={"a"}
            href="/profile"
          />
        </Stack>
        <Stack sx={{ flexGrow: 1 }} direction={"column"} spacing={1}>
          <Stack display={"block"}>
            <AppMenu
              trigger={(onOpen) => (
                <AudienceButton
                  variant="outlined"
                  size="small"
                  onClick={onOpen}
                  endIcon={
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: "1rem !important" }}
                    />
                  }
                >
                  Everyone
                </AudienceButton>
              )}
            >
              {(close) => <AudienceMenu onClose={close} />}
            </AppMenu>
          </Stack>

          <TextField
            fullWidth
            multiline
            variant="standard"
            placeholder="What's happening?"
            rows={1}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "1.25rem",
                fontWeight: 400,
                color: theme.palette.text.primary,
                mt: 1,
              },
            }}
            sx={{
              mt: 1,
              "& .MuiInputBase-root": {
                paddingTop: 0,
              },
            }}
          />

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack direction={"row"}>
              <Tooltip
                title="Image"
                placement="bottom"
                slotProps={{
                  tooltip: { sx: { fontSize: "10px" } },
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
              >
                <IconButton>
                  <ImageIcon size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Gif"
                placement="bottom"
                slotProps={{
                  tooltip: { sx: { fontSize: "10px" } },
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
              >
                <IconButton>
                  <PiGifFill />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Emoji"
                placement="bottom"
                slotProps={{
                  tooltip: { sx: { fontSize: "10px" } },
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
              >
                <IconButton>
                  <SmileyIcon size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Location"
                placement="bottom"
                slotProps={{
                  tooltip: { sx: { fontSize: "10px" } },
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
              >
                <IconButton>
                  <MapPinIcon size={24} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Button variant="contained" size="small">
              Post
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

export default HomePost;
