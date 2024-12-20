import { z } from "zod";
import { userSchema } from "../User";

export type UserDeleteRequest = {
  _id: string;
};

export const getUserSchema = z.array(userSchema).optional();

export type UserUpdateRequest = {
  _id: string;
  firstName: string;
  lastName: string;
  favoriteGenres: string[]
};

export const UserDeleteSchema = z.object({
  _id: z.string(),
});

export const UserFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const UserUpdateSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  favoriteGenres: z.array(z.string())
});

export type UserDeleteResponse = z.infer<typeof UserDeleteSchema>;

export type UserUpdateResponse = z.infer<typeof UserUpdateSchema>;
export type getUserResponse = z.infer<typeof getUserSchema>;
