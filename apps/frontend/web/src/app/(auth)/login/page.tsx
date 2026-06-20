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

// schema
import { loginSchema, LoginSchema } from "@mta/constants";
import ModeSwitch from "@/components/global/mode-switch";
import { LoginFooterMui } from "@/components/auth/footer.login";
import { useUIStore } from "@/store/ui.store";

export default function page() {
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
  } = useForm<LoginSchema>({
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    console.log("Login successful, ready to redirect.");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        color: "text.primary",
        mt: 8,
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
              Sign in to Twitter
            </Typography>
            <ModeSwitch />
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
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

              <TextField
                type="email"
                placeholder="Email"
                fullWidth
                size="medium"
                required
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                placeholder="Password"
                type="password"
                fullWidth
                size="medium"
                required
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={isSubmitting}
                fullWidth
                loading={isSubmitting}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Stack>

            {/* create account or forgot password */}
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ mt: 2, width: "100%" }}
              justifyContent={"center"}
            >
              <Typography
                component={"a"}
                variant="button"
                fontWeight={600}
                href="/forgot-password"
              >
                Forgot Password
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Typography
                component={"a"}
                variant="button"
                fontWeight={600}
                href="/register"
              >
                Create an account
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* footer */}
        <LoginFooterMui />
      </Container>
    </Box>
  );
}
