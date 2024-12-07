import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormTextInput } from "../formUtils/textInputForm";
import { Text, GlowingText } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { PasswordSchema, passwordSchema, FullSchema } from "./registerSchemas";
import AuthController from "@/api/controllers/AuthController";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { RegisterRequest } from "@/types/api/Register";
import { mtForm, formStyles } from "@/style/formStyle";

interface PasswordFormProps {
  setTab: (tabs: 0 | 1 | 2) => void;
  fullForm: UseFormReturn<FullSchema>;
}

export function PasswordForm({ setTab, fullForm }: PasswordFormProps) {
  const router = useRouter();

  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: AuthController.register,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: () => {
      fullForm.reset();
      form.reset();
      setTab(0);
      router.push("/main/home");
    },
  });

  const onSubmit = (data: PasswordSchema) => {
    fullForm.setValue("password", data);
    const formData = fullForm.getValues();
    const registerData: RegisterRequest = {
      email: formData.info.email,
      password: formData.password.password,
      firstName: formData.info.firstName,
      lastName: formData.info.lastName,
    };
    registerMutation.mutate(registerData);
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      layout={LinearTransition}
      style={formStyles.container}
    >
      <FormTextInput
        name="password"
        control={form.control}
        label="Contraseña"
        error={form.formState.errors.password}
        type="password"
      />
      <FormTextInput
        name="confirmPassword"
        control={form.control}
        label="Confirmar contraseña"
        error={form.formState.errors.confirmPassword}
        type="password"
      />
      <Animated.View layout={LinearTransition}>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          loading={registerMutation.isPending}
          disabled={registerMutation.isPending}
        >
          <Text>Crear Cuenta</Text>
        </Button>
      </Animated.View>
      <Animated.View layout={LinearTransition}>
        <Button variant="secondary" onPress={() => setTab(0)} >
          <Text>Volver</Text>
        </Button>
      </Animated.View>
    </Animated.View>
  )
}