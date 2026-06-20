import z from "zod";

const emailSchema = z
  .email({ message: "Email provided is not valid" })
  .min(1, { message: "The provided email is not valid" })
  .max(255, { message: "The provided email is too long" });

const passwordSchema = z
  .string({ message: "The password provided is not a valid input" })
  .trim()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(255, { message: "Password must be less than 255 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter (A–Z)",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter (a–z)",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number (0–9)",
  })
  .regex(/[^A-Za-z0-9]/, {
    message:
      "Password must contain at least one special character (#?!@$%^&*-)",
  });

export const registerSchema = z.object({
  username: z
    .string({ message: "Please input a valid name" })
    .trim()
    .min(2, { message: "Username must be greater than 2 characters long" })
    .max(255, { message: "Username must be less than 255 characters long" }),
  email: emailSchema,
  password: passwordSchema,
});

// change password schema
export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().trim(),
  })
  .refine(({ oldPassword, newPassword }) => newPassword !== oldPassword, {
    message: "The new password must be different from the old password.",
    path: ["newPassword"],
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const OTPSchema = z.object({
  code: z
    .string({ message: "Invalid format. OTP must be a string." })
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
});

export const emailOTP = z.object({
  email: emailSchema,
});

export const phoneOTP = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, {
      message:
        "Invalid phone number format. Use international format, e.g. +260977123456",
    })
    .optional()
    .nullable(),
});

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
  password: passwordSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type OTPSchemaType = z.infer<typeof OTPSchema>;
export type EmailOTPType = z.infer<typeof emailOTP>;
export type PhoneOTPType = z.infer<typeof phoneOTP>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;
