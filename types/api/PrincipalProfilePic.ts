import z from "zod";

export const principalProfilePic = z.object({
  index: z.number(),
});

export type PrincipalProfilePic = z.infer<typeof principalProfilePic>;

export const principalProfilePicResponse = z.object({
  success: z.boolean().nullish(),
  error: z.string().nullish(),
});

export type PrincipalProfilePicResponse = z.infer<
  typeof principalProfilePicResponse
>;
