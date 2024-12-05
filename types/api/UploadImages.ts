import z from "zod";

export const uploadImagesResponse = z.object({
  imageUrls: z.array(z.string()).nullable(),
  error: z.string().nullish(),
});

export type UploadImagesResponse = z.infer<typeof uploadImagesResponse>;

export interface UploadImagesRequest {
  images: File[];
}
