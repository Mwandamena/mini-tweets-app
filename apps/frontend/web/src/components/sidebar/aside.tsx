import { Box, Stack, TextField } from "@mui/material";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import TrendsWidget from "../aside/trending.widget";
import WhoToFollowWidget from "../aside/follow.widget";
import AsideFooter from "../aside/aside.footer";

function Aside() {
  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        overflowY: "auto",
        width: "100%",
        display: { xs: "none", md: "block" },
        px: 2,
        borderLeft: "1px solid",
        borderLeftColor: "divider",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
          py: 1,
        }}
      >
        <TextField
          slotProps={{
            input: {
              sx: {
                borderRadius: 999,
                px: "8px",
                py: "4px",
                gap: 0.5,
                height: "40px",
              },
              startAdornment: (
                <MagnifyingGlassIcon className="text-gray-600" size={24} />
              ),
            },
          }}
          placeholder="Search"
          fullWidth
          size="small"
        />
      </Stack>

      {/* who to follow */}
      <Box sx={{ maxWidth: "100%", mt: 2 }}>
        <WhoToFollowWidget />
      </Box>

      {/* whats trending */}
      <Box sx={{ maxWidth: "100%", mt: 2 }}>
        <TrendsWidget />
      </Box>

      {/* aside footer */}
      <Box sx={{ maxWidth: "100%", mt: 2 }}>
        <AsideFooter />
      </Box>
    </Box>
  );
}

export default Aside;
