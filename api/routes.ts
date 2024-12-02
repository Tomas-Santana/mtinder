const server = process.env.EXPO_PUBLIC_SERVER || "http://localhost:8080";
export const resourceURL = server + "/resources"
export const apiRoutes = {
  login: () => `${server}/auth/login`,
  checkEmail: () => `${server}/auth/check-email`,
  register: () => `${server}/auth/register`,
  sendReset: () => `${server}/auth/send-reset-email`,
  resetPassword: () => `${server}/auth/reset-password`,
  verifyCode: () => `${server}/auth/verify-reset-code`,
  user: () => `${server}/user`,
  "user/[id]": (id: string) => `${server}/user/${id}`,
  uploadImages: () => `${server}/photos/upload-images`,
};


export type ApiRoutes = typeof apiRoutes;
export type ApiRoute = keyof ApiRoutes;


export type ApiRouteParams<T extends ApiRoute> = Parameters<ApiRoutes[T]>;