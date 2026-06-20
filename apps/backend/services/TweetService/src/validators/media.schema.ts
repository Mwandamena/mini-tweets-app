import z from "zod";

const mediaTypeEnum = z.enum(["IMAGE", "VIDEO", "GIF", "DOCUMENT", "AUDIO"]);

export const mediaSchema = z.object({
  url: z.url("Media URL must be a valid URL."),
  type: mediaTypeEnum,
  mimeType: z.string().trim().min(1, "Mime type is required."),
  size: z
    .number()
    .int()
    .positive("Size must be a positive integer.")
    .optional(),
  width: z
    .number()
    .int()
    .positive("Width must be a positive integer.")
    .optional(),
  height: z
    .number()
    .int()
    .positive("Height must be a positive integer.")
    .optional(),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive integer.")
    .optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL.").optional(),
  altText: z
    .string()
    .max(250, "Alt text must be under 250 characters.")
    .optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
