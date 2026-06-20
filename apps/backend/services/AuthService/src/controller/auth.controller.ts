import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse, asyncHandler, HTTP_STATUS } from "@mta/common";
import { LoginService } from "../services/login.service";
import { OTPLoginService } from "../services/otp.service";
import { TwoFactorAuthService } from "../services/2fa.service";

export class AuthController {
  private authService: AuthService;
  private loginService: LoginService;
  private otpService: OTPLoginService;
  private twoFactorService: TwoFactorAuthService;

  constructor() {
    this.authService = new AuthService();
    this.loginService = new LoginService();
    this.otpService = new OTPLoginService();
    this.twoFactorService = new TwoFactorAuthService(this.loginService);
  }

  /* 
    POST: Register a user(normal twitter user)
  */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = await req.body;
    const ua = req.get("user-agent") || undefined;
    const ip = req.ip;

    const { account, verificationToken } = await this.authService.registerUser({
      username,
      email,
      password,
    });

    return ApiResponse.success(
      res,
      { account: account, verificationToken: verificationToken },
      "User registered successfully",
      201,
      {
        ip: ip,
        userAgent: ua,
      }
    );
  });

  /* 
    LOGIN: Email, phone and password
  */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ip = req.ip ?? "000000";
    const ua = req.headers["user-agent"] ?? "user-agent";
    const device = req.headers["user-agent"] ?? "user-agent";

    const result = await this.loginService.emailLogin(
      res,
      { device: device, ipAddress: ip, userAgent: ua },
      { email, password }
    );

    return ApiResponse.success(res, result, "Login Successful");
  });

  /* 
    LOGIN: Login using OTP
  */
  sendLoginOTP = asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.body;

    const { expiresIn, medium, message } = await this.otpService.loginOTP({
      phone,
      email,
    });

    return ApiResponse.success(
      res,
      { target: medium, expiresIn: expiresIn },
      message
    );
  });

  /* 
    LOGIN: Verify Login OTP
  */
  verifyLoginOTP = asyncHandler(async (req: Request, res: Response) => {
    const { code, email, phone } = req.body;
    const ip = req.ip ?? "000000";
    const ua = req.headers["user-agent"] ?? "user-agent";
    const device = req.headers["user-agent"] ?? "user-agent";

    const { user } = await this.otpService.verifyLoginOTP(
      res,
      { code, email, phone },
      { ipAddress: ip, device: device, userAgent: ua }
    );

    return ApiResponse.success(res, { user }, "Login successful");
  });

  verifyLogin2FA = asyncHandler(async (req: Request, res: Response) => {
    const { code, tempToken } = req.body;
    const { accessToken, refreshToken, user, sessionId } =
      await this.twoFactorService.verify2FALogin(res, tempToken, code);

    return ApiResponse.success(
      res,
      {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        sessionId: sessionId,
      },
      `Two factor authentication login successfull`
    );
  });

  /* 
    Logout
  */
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const existingSession = req.cookies?.sessionId;
    const { message } = await this.loginService.logout(
      res,
      userId,
      existingSession
    );
    ApiResponse.success(res, null, message);
  });

  /* 
    Revoke Refresh Token
  */
  revokeRefreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      await this.loginService.revokeRefreshToken(res, req);
    }
  );

  /* 
    Request Refresh Token
  */
  requestRefreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      await this.loginService.requestRefreshToken(res, req);
    }
  );

  /* 
    Enable Two Factor Authentication
  */
  enableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { backupCodes, qrCode, secret } =
      await this.twoFactorService.setup2FA(userId);

    return ApiResponse.success(
      res,
      {
        base32: secret,
        qrcode: qrCode,
      },
      "Two factor authentication enabled successfully. Continue by verifying your 2FA setup."
    );
  });

  /* 
    Verify Two Factor Authentication
  */
  verify2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { token } = req.body;

    const { updatedUser } = await this.twoFactorService.verify2FASetup(
      userId,
      token
    );

    return ApiResponse.success(
      res,
      {
        updatedUser,
      },
      "2FA setup verified successfully."
    );
  });

  disable2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { token } = req.body;
    await this.twoFactorService.disable2FA(userId, token);

    return ApiResponse.success(
      res,
      null,
      "2FA has been disabled successfullly"
    );
  });

  /* 
    Verify Email
  */
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;

    const user = await this.authService.verifyEmail(res, token);

    return ApiResponse.success(
      res,
      user,
      "Email verified successfully. You can now login to your account."
    );
  });

  /* 
    Resend verification link to Email
  */
  resendVerificationLink = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const verificationToken = await this.authService.resendVerificationEmail(
      res,
      email
    );
    return ApiResponse.success(
      res,
      { verificationToken: verificationToken },
      "New verification token has been sent to your email"
    );
  });

  /* 
    Change Password
  */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    await this.authService.requestPasswordChange(
      oldPassword,
      newPassword,
      userId,
      res
    );

    return ApiResponse.success(
      res,
      null,
      "Password changed successfully. Other sessions have been logged out."
    );
  });

  /* 
    Request email change
  */
  changeEmail = asyncHandler(async (req: Request, res: Response) => {
    const { password, newEmail } = req.body;
    const userId = req.user.id;

    const { verificationLink } = await this.authService.requestEmailChange(
      password,
      newEmail,
      userId,
      req
    );

    return ApiResponse.success(
      res,
      { verificationRequired: true, verificationLink: verificationLink },
      `Verification email sent to ${newEmail}. Please check your inbox.`
    );
  });

  /* 
    Verify email change
  */
  verifyEmailChange = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    await this.authService.verifyEmailChangeRequest(token, res);

    return ApiResponse.success(
      res,
      null,
      "Email changed successfully. Please log in with your new email."
    );
  });

  /* 
    Send email or phone using otp
  */
  sendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.body;
    const { expiresIn, medium, identifier, message } =
      await this.otpService.sendVerificationOTP(res, phone, email);

    return ApiResponse.success(
      res,
      { medium: medium, expiresIn: expiresIn, sentTo: identifier },
      message
    );
  });

  /* 
    Verify email or phone using otp
  */
  verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { code, phone, email } = req.body;
    const { identifier, message, medium } =
      await this.otpService.validateVerificationOTP(res, code, phone, email);

    return ApiResponse.success(
      res,
      { target: medium, verified: identifier },
      message
    );
  });
}
