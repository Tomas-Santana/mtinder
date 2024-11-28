import {
  LoginRequest,
  LoginResponse,
  LoginResponseSchema,
} from "../../types/api/Login";
import {
  RegisterRequest,
  RegisterResponse,
  RegisterResponseSchema,
  VerifyEmailAvailability,
  VerifyEmailAvailabilityResponse,
  VerifyEmailAvailabilityResponseSchema,
} from "@/types/api/Register";
import {
  SendEmailResetRequest,
  SendEmailResetResponseSchema,
  SendEmailResetResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetResponseSchema,
  VerifyCodeRequest,
  VerifyCodeResponse,
  VerifyCodeResponseSchema,
} from "@/types/api/PasswordReset";
import { superFetch, SuperFetchError } from "./superFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDefaultStore } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";

const store = getDefaultStore();
store.sub(userAtom, () => {
  console.log("userAtom changed");
});

export default class AuthController {
  static async login(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const result = await superFetch<LoginRequest, LoginResponse, "login">({
        options: {
          method: "POST",
        },
        route: "login",
        routeParams: [],
        responseSchema: LoginResponseSchema,
        payload: payload,
      });

      // save token to async storage
      await AsyncStorage.setItem("token", result.token);

      store.set(userAtom, result.user);

      return result;
    } catch (error) {
      const sfError = error as SuperFetchError;
      console.log(sfError.code);
      if (sfError.code === 401 || sfError.code === 400) {
        throw new Error("Email o contraseña incorrectos");
      }
      throw new Error("Falló el inicio de sesión");
    }
  }

  static async verifyEmailAvailability(
    payload: VerifyEmailAvailability
  ): Promise<VerifyEmailAvailabilityResponse> {
    try {
      const res = await superFetch<
        VerifyEmailAvailability,
        VerifyEmailAvailabilityResponse,
        "checkEmail"
      >({
        options: {
          method: "POST",
        },
        route: "checkEmail",
        routeParams: [],
        responseSchema: VerifyEmailAvailabilityResponseSchema,
        payload: payload,
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new Error("Falló la verificación de email");
    }
  }

  static async register(payload: RegisterRequest): Promise<RegisterResponse> {
    try {
      const res = await superFetch<
        RegisterRequest,
        RegisterResponse,
        "register"
      >({
        options: {
          method: "POST",
        },
        route: "register",
        routeParams: [],
        responseSchema: RegisterResponseSchema,
        payload: payload,
      });

      // save token to async storage
      await AsyncStorage.setItem("token", res.token);

      store.set(userAtom, res.user);

      return res;
    } catch (error) {
      console.log(error);
      throw new Error("Falló el registro");
    }
  }

  static async sendResetEmail(payload: SendEmailResetRequest) {
    try {
      const res = await superFetch<
        SendEmailResetRequest,
        SendEmailResetResponse,
        "sendReset"
      >({
        options: {
          method: "POST",
        },
        route: "sendReset",
        routeParams: [],
        responseSchema: SendEmailResetResponseSchema,
        payload: payload,
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new Error("No se pudo enviar el email de restablecimiento");
    }
  }

  static async resetPassword(payload: PasswordResetRequest) {
    console.log(payload)
    try {
      const res = await superFetch<
        PasswordResetRequest,
        PasswordResetResponse,
        "resetPassword"
      >({
        options: {
          method: "POST",
        },
        route: "resetPassword",
        routeParams: [],
        responseSchema: PasswordResetResponseSchema,
        payload: payload,
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new Error("Falló el restablecimiento de la contraseña");
    }
  }

  static async verifyCode(payload: VerifyCodeRequest) {
    try {
      const res = await superFetch<
        VerifyCodeRequest,
        VerifyCodeResponse,
        "verifyCode"
      >({
        options: {
          method: "POST",
        },
        route: "verifyCode",
        routeParams: [],
        responseSchema: VerifyCodeResponseSchema,
        payload: payload,
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new Error("No se pudo verificar el código");
    }
  }

  static async logout() {
    await AsyncStorage.removeItem("token");
    store.set(userAtom, null);
  }
}
