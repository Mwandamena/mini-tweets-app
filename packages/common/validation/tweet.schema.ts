import { z } from "zod";
import { mediaSchema } from "./media.schema";

// MongoDB ObjectId
export const objectIdSchema = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid MongoDB ObjectId format.",
  });

// Tweet Create Schema
export const tweetCreateSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Tweet content cannot be empty.")
      .max(500, "Tweet content must be under 500 characters."),

    media: z
      .array(mediaSchema)
      .max(4, "Cannot attach more than 4 media items per tweet.")
      .optional(),

    isReply: z.boolean().default(false),
    replyToId: objectIdSchema.optional(),

    isQuote: z.boolean().default(false),
    quoteTweetId: objectIdSchema.optional(),
  })
  // Validate reply logic
  .refine(
    (data) => {
      if (data.isReply && !data.replyToId) return false;
      if (data.replyToId && !data.isReply) return false;
      return true;
    },
    {
      message:
        "If replying, 'replyToId' must be provided. If 'replyToId' is provided, 'isReply' must be true.",
      path: ["replyToId"],
    }
  )
  // Validate quote logic
  .refine(
    (data) => {
      if (data.isQuote && !data.quoteTweetId) return false;
      if (data.quoteTweetId && !data.isQuote) return false;
      return true;
    },
    {
      message:
        "If quoting a tweet, 'quoteTweetId' must be provided. If 'quoteTweetId' is provided, 'isQuote' must be true.",
      path: ["quoteTweetId"],
    }
  );

// Tweet Update Schema
export const tweetUpdateSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Tweet content cannot be empty.")
      .max(500, "Tweet content must be under 500 characters.")
      .optional(),

    media: z
      .array(mediaSchema)
      .max(4, "Cannot attach more than 4 media items per tweet.")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Request body must contain at least one field to update.",
  });

export type TweetCreateInput = z.infer<typeof tweetCreateSchema>;
export type TweetUpdateInput = z.infer<typeof tweetUpdateSchema>;
export type ObjectId = z.infer<typeof objectIdSchema>;
