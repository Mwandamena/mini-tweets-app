import { Stack, Avatar, Box } from "@mui/material";

function HomeStories() {
  const seen = true;
  return (
    <Stack direction={"column"} gap={1} sx={{ p: 2 }}>
      <Stack direction={"row"} gap={1}>
        <Box
          sx={{
            borderRadius: "50%",
            padding: "3px",
            background: seen
              ? "linear-gradient(45deg, #f09433, #bc1888)"
              : "lightgrey",
          }}
        >
          <Avatar
            component={"button"}
            src="https://unsplash.com/photos/young-girl-smiles-in-front-of-a-lake-and-mountains-nw4QR3mB1qI0"
            sx={{ width: 56, height: 56, cursor: "pointer" }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default HomeStories;
