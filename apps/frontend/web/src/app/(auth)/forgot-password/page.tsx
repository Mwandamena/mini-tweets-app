import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Page() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xs" sx={{ p: 4 }}>
        <Stack alignItems="start" spacing={2}>
          <img
            src={`/twitter-logo.svg`}
            alt="Twitter Logo"
            style={{ width: 80 }}
          />
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ mt: 2 }}
            className="dark:text-white"
          >
            Find your tweet account
          </Typography>
        </Stack>
        <Stack alignItems="start" spacing={2} textAlign={"start"}>
          <Typography variant="body2" color="text.secondary">
            Enter the email, phone number, or username associated with your
            account to change your password.
          </Typography>
        </Stack>
        <Stack component="form" width={"100%"} sx={{ mt: 2 }}>
          <TextField
            placeholder="Enter your email, phone or username"
            type="email"
            fullWidth
            size="medium"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
