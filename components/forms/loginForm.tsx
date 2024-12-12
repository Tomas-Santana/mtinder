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
import { Button } from "../ui/button";
import { Toast } from "../ui/toast";

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "You must enter an email.")
    .max(50, "El email es muy largo.")
    .email("Invalid Email.")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password is too long."),
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
              Forgot your password?
            </Text>
          </Link>
      </Animated.View>
      <Animated.View layout={LinearTransition}>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
        >
          <Text>
            Log in
          </Text>
        </Button>
      </Animated.View>
      <Animated.View layout={LinearTransition} style={mtForm.sideText}>
        <Link
          href={"/auth/registerPage"}
          style={[mtForm.text]}
        >
          <Text>
            Create an account
          </Text>
        </Link>
      </Animated.View>
    </Animated.View>
  )
}