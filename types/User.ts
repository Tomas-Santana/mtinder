import z from 'zod';

export const UserSchema = z.object({
    _id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profileReady: z.boolean().nullish(),
    imageUrls: z.array(z.string()).nullish(),
    favoriteGenres: z.array(z.string()).nullish(),
});


export type User = z.infer<typeof UserSchema>;