import z from "zod";
import type { FileUpload } from "@/types/api/FileUpload";

export const completeProfileResponse = z.object({
  imageUrls: z.array(z.string()).nullish(),
  error: z.string().nullish(),
});

export type CompleteProfileResponse = z.infer<typeof completeProfileResponse>;

export interface CompleteProfileRequest {
  images: FileUpload[];
  genres: string[];
}
