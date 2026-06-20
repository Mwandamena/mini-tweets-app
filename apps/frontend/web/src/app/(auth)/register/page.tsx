"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Typography,
  TextField,
  Link as MuiLink,
  Stack,
  Alert,
  AlertTitle,
  Button,
  Divider,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { MdError } from "react-icons/md";

const useSignUp = () => ({
  signUp: async (data: any) => {
    console.log("Attempting sign up with:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500)); //
    if (data.username === "taken") {
      return { success: false, message: "Username is already taken." };
    }
    return { success: true };
  },
  loading: false,
  error: "",
  disabled: false,
  setError: (msg: string) => console.log("Setting error:", msg),
});

export default function SignUpMui() {
  const { signUp } = useSignUp();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
  } = useForm({
    mode: "onBlur",
  });

  // 2. Form Submission Handler
  const onSubmit = async (data: any) => {
    setApiError(null);
    clearErrors("root"); // Clear previous non-field errors

    const result = await signUp(data); // Await the API call

    if (!result.success) {
      // Set the error message based on the API response
      setApiError(
        result.message || "An unknown error occurred during registration."
      );
      // Optionally, set a non-field error for RHF:
      setError("root", { message: result.message || "Sign Up failed" });
    }
    // Handle successful sign-up (e.g., redirect or show confirmation)
    console.log("Sign Up successful, ready to redirect.");
  };

  const isFormValid = isValid && !isSubmitting; // Condition for enabling the button

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
        <Stack alignItems="center" spacing={2}>
          <Stack alignItems="center" spacing={2}>
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
              Create your account
            </Typography>
          </Stack>
          <Stack spacing={2} width="100%">
            <Button
              variant="outlined"
              size="medium"
              startIcon={<FcGoogle size={20} />}
              fullWidth
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<BsApple size={20} />}
              fullWidth
            >
              Continue with Apple
            </Button>
          </Stack>

          {/* divider */}
          <Divider orientation="horizontal" flexItem>
            OR
          </Divider>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            width="100%"
          >
            <Stack spacing={2}>
              {(apiError || errors.root) && (
                <Alert
                  severity="error"
                  icon={<MdError />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                  }}
                >
                  <AlertTitle sx={{ m: 0 }}>
                    {apiError || errors.root?.message}
                  </AlertTitle>
                </Alert>
              )}

              {/* Username Input */}
              <TextField
                placeholder="Username"
                type="text"
                fullWidth
                size="medium"
                {...register("username")}
                error={!!errors.username}
                // helperText={errors.username?.message}
              />

              {/* Email Input */}
              <TextField
                placeholder="Email"
                type="email"
                fullWidth
                size="medium"
                {...register("email")} // RHF registration
                error={!!errors.email}
                // helperText={errors.email?.message}
              />

              {/* Password Input */}
              <TextField
                placeholder="Password"
                type="password"
                fullWidth
                size="medium"
                {...register("password")}
                error={!!errors.password}
                // helperText={errors.password?.message}
              />

              {/* Sign Up Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={isSubmitting} // RHF state for loading
                disabled={!isFormValid} // Disable if invalid or submitting
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <MuiLink href="/login" underline="none" color="primary.main">
              Sign In
            </MuiLink>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
