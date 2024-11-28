import z from 'zod'
import { UserSchema } from '../User'

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const RegisterResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
})

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>

export const VerifyEmailAvailabilitySchema = z.object({
  email: z.string().email(),
});

export type VerifyEmailAvailability = z.infer<typeof VerifyEmailAvailabilitySchema>;

export const VerifyEmailAvailabilityResponseSchema = z.object({
  available: z.boolean(),
});

export type VerifyEmailAvailabilityResponse = z.infer<typeof VerifyEmailAvailabilityResponseSchema>;