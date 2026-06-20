import { z } from "zod";

const ruleSchema = z
  .string()
  .trim()
  .min(5, "Rule must be at least 5 characters long.");

export const communityCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Community name must be at least 3 characters.")
    .max(30, "Community name cannot exceed 30 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Name can only contain lowercase letters, numbers, and underscores."
    )
    .toLowerCase()
    .describe("Unique name for the community, used in URLs."),
  displayName: z
    .string()
    .trim()
    .min(3, "Display name must be at least 3 characters.")
    .max(50, "Display name cannot exceed 50 characters.")
    .describe("Human-readable name for the community."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters.")
    .describe("A brief description of the community's purpose."),
  rules: z.array(ruleSchema).optional().default([]),
  bannerImage: z.string().url("Banner image must be a valid URL.").optional(),
  profileImage: z.string().url("Profile image must be a valid URL.").optional(),
  isPrivate: z
    .boolean()
    .optional()
    .describe("If true, membership is required to view."),
  allowPosts: z
    .boolean()
    .optional()
    .describe("If false, only admins/mods can post."),
  requireApproval: z
    .boolean()
    .optional()
    .describe("If true, joining requires moderator approval."),
});

const communityUpdateBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Community name must be at least 3 characters.")
    .max(30, "Community name cannot exceed 30 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Name can only contain lowercase letters, numbers, and underscores."
    )
    .toLowerCase()
    .describe("Unique name for the community."),

  displayName: z
    .string()
    .trim()
    .min(3, "Display name must be at least 3 characters.")
    .max(50, "Display name cannot exceed 50 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
  rules: z.array(ruleSchema),
  bannerImage: z
    .string()
    .url("Banner image must be a valid URL.")
    .nullable()
    .optional(),
  profileImage: z
    .string()
    .url("Profile image must be a valid URL.")
    .nullable()
    .optional(),
  isPrivate: z.boolean(),
  allowPosts: z.boolean(),
  requireApproval: z.boolean(),
});

export const communityUpdateSchema = communityUpdateBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Request body must contain at least one field to update.",
    path: ["_root"],
  });

export type CommunityUpdateInput = z.infer<typeof communityUpdateSchema>;

export type CommunityCreateInput = z.infer<typeof communityCreateSchema>;
