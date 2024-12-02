import z from 'zod';

export const UserSchema = z.object({
    _id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profileReady: z.boolean().nullish(),
});


export type User = z.infer<typeof UserSchema>;