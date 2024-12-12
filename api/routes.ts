const server = process.env.EXPO_PUBLIC_SERVER || "http://localhost:8080";
export const resourceURL = server + "/resources"
export const uploadthingUrl = server + "/upload"
export const apiRoutes = {
  login: () => `${server}/auth/login`,
  me: () => `${server}/user/me`,
  checkEmail: () => `${server}/auth/check-email`,
  register: () => `${server}/auth/register`,
  sendReset: () => `${server}/auth/send-reset-email`,
  resetPassword: () => `${server}/auth/reset-password`,
  verifyCode: () => `${server}/auth/verify-reset-code`,
  user: () => `${server}/user`,
  "user/[id]": (id: string) => `${server}/user/${id}`,
  "user/all": () => `${server}/user/all`,
  uploadImages: () => `${server}/photos/upload-images`,
  deleteProfilePic: () => `${server}/photos/delete-profile-pic`,
  addProfilePic: () => `${server}/photos/add-profile-pic`,
  principalProfilePic: () => `${server}/photos/principal-profile-pic`,
  chat: () => `${server}/chat`,
  "chat/[id]": (id: string) => `${server}/chat/${id}`, 
  chatMessages: (chatId: string) => `${server}/chat/${chatId}/messages`,
  "match/request": () => `${server}/match/request`,
  match: () => `${server}/match`,
};


export type ApiRoutes = typeof apiRoutes;
export type ApiRoute = keyof ApiRoutes;


export type ApiRouteParams<T extends ApiRoute> = Parameters<ApiRoutes[T]>;