import { z } from "zod";
import {
  emailOTP,
  loginSchema,
  OTPSchema,
  phoneOTP,
  registerSchema,
} from "../../validators/auth.schema";

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type OtpCode = z.infer<typeof OTPSchema>;

export type EmailOtpInput = z.infer<typeof emailOTP>;

export type PhoneOtpInput = z.infer<typeof phoneOTP>;

export interface RegisterSchema extends RegisterInput {
  ua: string;
  ip: string;
}

export interface LoginSchema extends LoginInput {
  ua: string;
  ip: string;
}
