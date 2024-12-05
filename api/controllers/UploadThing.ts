import { genUploader } from "uploadthing/client";
import {uploadthingUrl} from "../routes";
import type { UploadRouter } from "@/types/api/UploadRouter";


export const {uploadFiles} = genUploader<UploadRouter>({
  url: uploadthingUrl,
  package: "expo",
});