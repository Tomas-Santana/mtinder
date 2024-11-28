import { z } from "zod";

export type UserDeleteRequest = {
  _id: string;
}

export type UserUpdateRequest = {
  _id: string;
  firstName: string;
  lastName: string;
}

export const UserDeleteSchema = z.object({
  _id: z.string(),
})

export const UserFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export const UserUpdateSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

export type UserDeleteResponse = z.infer<typeof UserDeleteSchema>;

export type UserUpdateResponse = z.infer<typeof UserUpdateSchema>;