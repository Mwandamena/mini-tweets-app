import { z } from "zod";
import { mediaSchema } from "./media.schema";

export const objectIdSchema = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid MongoDB ObjectId format.",
  })
  .describe(
    "A 24-character hexadecimal string representing a MongoDB ObjectId."
  );

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

    isReply: z
      .boolean()
      .optional()
      .default(false)
      .describe("Indicates if this is a reply."),

    replyToId: objectIdSchema
      .optional()
      .describe("ID of the tweet being replied to."),

    isQuote: z.boolean().optional().default(false),
  })

  .refine((data) => data.isReply === !!data.replyToId, {
    message:
      "If 'isReply' is true, 'replyToId' must be provided, and vice-versa.",
    path: ["isReply", "replyToId"],
  });

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
    path: ["_root"],
  });

export type TweetUpdateInput = z.infer<typeof tweetUpdateSchema>;

export type TweetCreateInput = z.infer<typeof tweetCreateSchema>;

export type ObjectId = z.infer<typeof objectIdSchema>;
