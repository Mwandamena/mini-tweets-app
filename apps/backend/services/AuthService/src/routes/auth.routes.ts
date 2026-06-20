import express from "express";
import { AuthController } from "../controller/auth.controller";
import { authenticate } from "@mta/common";

// Initialize
const authRouter = express.Router();
const authController = new AuthController();

// ROUTES
// login & log out
authRouter.route("/login").post(authController.login); // ✅
authRouter.route("/logout").post(authenticate, authController.logout); // ✅

// login with OTP
authRouter.post("/login/otp/send", authController.sendLoginOTP); // ✅
authRouter.post("/login/otp/verify", authController.verifyLoginOTP); // ✅

// register
authRouter.route("/register").post(authController.register); // ✅

// refresh tokens
authRouter.route("/refresh").post(authController.requestRefreshToken); // ✅
authRouter.route("/refresh/revoke").post(authController.revokeRefreshToken); // ✅

// verify email using token
authRouter.get("/verify-email/", authController.verifyEmail);
authRouter.get(
  "/resend-verification-email",
  authController.resendVerificationLink
);

// email and password
authRouter.post(
  "/change-password",
  authenticate,
  authController.changePassword
);

authRouter.post(
  "/request-email-change",
  authenticate,
  authController.changeEmail
);

authRouter.post("/verify-email-change", authController.verifyEmailChange);

// verify phone or email using OTP
authRouter.post("/otp/send/", authController.sendOTP); // ✅
authRouter.post("/otp/verify/", authController.verifyOTP); // ✅

// 2FA
authRouter.post("/2fa/setup", authenticate, authController.enableTwoFactor); // ✅
authRouter.post("/2fa/disable", authenticate, authController.disable2FA); // ✅
authRouter.post("/2fa/verify", authenticate, authController.verify2FA); // ✅

authRouter.post("/2fa/login", authController.verifyLogin2FA);

export { authRouter };
