import { FileRoute } from "uploadthing/types";

export type UploadRouter = {
  profilePictures: FileRoute<{
    input: undefined;
    output: null;
    errorShape: JSON;
  }>;
};
