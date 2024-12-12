import { View } from "react-native";
import { FormTextInput } from "./formUtils/textInputForm";
import Animated, { LinearTransition } from "react-native-reanimated";
import z from "zod"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";
import { mtForm } from "@/style/formStyle";
import { Text } from "../ui/text";
import mt from "@/style/mtWind";
import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, CoolButton } from "../ui/button";
import { Toast } from "../ui/toast";

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Se debe ingresar un email.")
    .max(50, "El email es muy largo.")
    .email("Email invalido.")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(50, "La contraseña es muy larga."),
});

export default function LoginForm(){
  const router = useRouter()

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const loginMutation = useMutation({
    mutationFn: AuthController.login,
    onError: (error) => {
      console.log(error.message)
      Toast.error(error.message)
    },
    onSuccess: (data) => {
      form.reset()
      router.push("/main/home")
    }
  })

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(data)
  }

  return (
    <Animated.View style={[mtForm.container]}>
      <FormTextInput 
        name="email"
        control={form.control}
        label="Email"
        placeholder="Linker@gmail.com"
        error={form.formState.errors.email}
      />
      <FormTextInput 
        name="password"
        control={form.control}
        label="Password"
        error={form.formState.errors.password}
      />
      <Animated.View layout={LinearTransition} style={mtForm.sideText}>
      
          <Link
            href={"/auth/sendResetPage"}
            style={[mtForm.text]}
          >
            <Text>
              Forgot password
            </Text>
          </Link>
      </Animated.View>
      <Animated.View layout={LinearTransition}>
        <CoolButton
          onPress={form.handleSubmit(onSubmit)}
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
          color="blue"
          style={[mt.p(2)]}
        >
          <Text style={[mt.color("blue"), mt.align("center")]}>
            Log In
          </Text>
        </CoolButton>
      </Animated.View>
      <Animated.View layout={LinearTransition} style={[mtForm.sideText]}>
        <Link
          href={"/auth/registerPage"}
          style={[mtForm.text, mt.mt(5)]}
        >
          <Text>
            Create Account
          </Text>
        </Link>
      </Animated.View>
    </Animated.View>
  )
}