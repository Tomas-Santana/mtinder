import z from "zod";

export const deleteProfilePic = z.object({
  url: z.string(),
});

export type DeleteProfilePic = z.infer<typeof deleteProfilePic>;

export const deleteProfilePicResponse = z.object({
  success: z.boolean().nullish(),
  error: z.string().nullish(),
});

export type DeleteProfilePicResponse = z.infer<typeof deleteProfilePicResponse>;
