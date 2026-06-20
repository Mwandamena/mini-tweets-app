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

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid ObjectId format",
});

export const userUpdateSchema = z.object({
  name: z
    .string({ error: "Please input a valid name" })
    .trim()
    .min(1, { error: "Name must be greater than 2 characters long" })
    .max(255, {
      error: "Name must be less than or greater than 255 characters long",
    }),
  email: emailSchema,
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  image: z
    .string({ error: "Image must be a valid URL" })
    .url({ error: "Image must be a valid URL" })
    .optional()
    .nullable(),
});

export const deleteUserSchema = z.object({
  password: passwordSchema,
});
