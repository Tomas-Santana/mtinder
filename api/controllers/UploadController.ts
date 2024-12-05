import { ref, uploadBytesResumable, getDownloadURL, type FullMetadata } from "firebase/storage";
import { storage } from "@/utils/firebase/firebase";

export default class FirebaseUploadController {
  private static async uploadToFirebase({
    uri,
    name,
    path,
    onProgress,
  }: {
    uri: string;
    name: string;
    path: string;
    onProgress?: ((progress: number) => void) ;
  }) {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    
    const imageRef = ref(storage, `${path}/${name}`);
    
    const uploadTask = uploadBytesResumable(imageRef, theBlob);
    
    return new Promise<{ downloadUrl: string; metadata: FullMetadata }>((resolve, reject) => {
      uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
        downloadUrl,
        metadata: uploadTask.snapshot.metadata,
        });
      }
      );
    });
  };

  private static uploadMultipleToFirebase({
    uris,
    names,
    paths
  }: {
    uris: string[];
    names: string[];
    paths: string[];
  }) {
    return Promise.all(
      uris.map((uri, index) =>
        FirebaseUploadController.uploadToFirebase({
          uri,
          name: names[index],
          path: paths[index],
        })
      )
    );
  }

  static async uploadProfilePictures({
    uris,
    userId,
  }: 
  {
    uris: string[];
    userId: string;
  }) {
    return FirebaseUploadController.uploadMultipleToFirebase({
      uris,
      names: uris.map((index) => index.toString()),
      paths: uris.map(() => `public/profilePictures/${userId}`),
    });
  }
}

