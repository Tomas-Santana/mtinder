import z from "zod";

export const addProfilePic = z.object({
  encodedImage: z.string(),
});

export type AddProfilePic = z.infer<typeof addProfilePic>;

export const addProfilePicResponse = z.object({
  url: z.string().nullish(),
  error: z.string().nullish(),
});

export type AddProfilePicResponse = z.infer<typeof addProfilePicResponse>;
