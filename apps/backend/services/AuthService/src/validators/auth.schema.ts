import z from "zod";

const emailSchema = z
  .email({ error: "Email provided is not valid" })
  .trim()
  .min(1, { error: "The provided email is not valid" })
  .max(255, { error: "The provided email is not valid" });

const passwordSchema = z
  .string({ error: "The password provided is not a valid input" })
  .trim()
  .min(5, { error: "Password must be more than 5 characters long" })
  .max(15, { error: "Password must be less than 255 characters long" });

export const registerSchema = z.object({
  username: z
    .string({ error: "Please input a valid name" })
    .trim()
    .min(1, { error: "Username must be greater than 2 characters long" })
    .max(255, {
      error: "Username must be less greater than 255 characters long",
    }),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const OTPSchema = z.object({
  code: z
    .string({ error: "Invalid format. OTP must be a string." })
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
});

export const emailOTP = z.object({
  email: emailSchema,
});

export const phoneOTP = z.object({
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{7,14}$/,
      "Invalid phone number format. Use international format, e.g. +260977123456"
    )
    .optional()
    .nullable(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string() // Clean z.string() declaration
      .trim()
      .min(5, { message: "Password must be more than 5 characters long" }) // Use 'message' for custom errors
      .max(255, { message: "Password must be less than 255 characters long" }),
    newPassword: z
      .string() // Clean z.string() declaration
      .trim()
      .min(5, { message: "Password must be more than 5 characters long" }) // Use 'message' for custom errors
      .max(255, { message: "Password must be less than 255 characters long" }),
  })
  .refine(({ oldPassword, newPassword }) => newPassword !== oldPassword, {
    message: "The new password must be different from the old password.",
    path: ["newPassword"],
  });

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
  password: passwordSchema,
});
