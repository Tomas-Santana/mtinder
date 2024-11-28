import z from 'zod';
import { UserSchema } from '../User';

export interface LoginRequest {
    email: string;
    password: string;
}

export const LoginResponseSchema = z.object({
    token: z.string(),
    user: UserSchema,
    error: z.string().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;