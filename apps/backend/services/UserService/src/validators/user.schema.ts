import { z } from "zod";

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

export const objectIdSchema = z
  .string({ error: "You provided an invalid database id" })
  .regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid ObjectId format",
  });

export const userUpdateSchema = z.object({
  displayName: z
    .string({ message: "Please input a valid name" })
    .trim()
    .min(2, { message: "Display name must be at least 2 characters long" })
    .max(255, { message: "Display name must be less than 255 characters long" })
    .optional()
    .nullable(),

  username: z
    .string({ message: "Please input a valid username" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be less than 50 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    })
    .optional()
    .nullable(),

  bio: z
    .string({ message: "Bio must be a valid string" })
    .max(160, { message: "Bio must be less than 160 characters long" })
    .optional()
    .nullable(),

  location: z
    .string({ message: "Location must be a valid string" })
    .max(30, { message: "Location must be less than 30 characters long" })
    .optional()
    .nullable(),

  website: z
    .url({ message: "Website must be a valid URL" })
    .optional()
    .nullable(),

  profileImage: z
    .url({ message: "Profile image must be a valid URL" })
    .optional()
    .nullable(),

  bannerImage: z
    .url({ message: "Banner image must be a valid URL" })
    .optional()
    .nullable(),

  dateOfBirth: z
    .string({ message: "Date of Birth must be a string" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of Birth must be in YYYY-MM-DD format (e.g., 1990-05-15)",
    })
    .optional()
    .nullable(),

  isPrivate: z
    .boolean({ message: "isPrivate must be a boolean value" })
    .optional(),
});

export const deleteUserSchema = z.object({
  password: passwordSchema,
});
