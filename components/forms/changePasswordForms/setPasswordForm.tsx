import { PasswordResetRequest } from "@/types/api/PasswordReset";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import z from "zod";
import { FormTextInput } from "../formUtils/textInputForm";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import mt from "@/style/mtWind";

interface SetPasswordProps {
  setTab: (tab: 0 | 1) => void;
  fullForm: UseFormReturn<PasswordResetRequest>;
}

const setPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function SetPasswordForm({
  setTab,
  fullForm,
}: SetPasswordProps) {
  const form = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const SetPasswordMutation = useMutation({
    mutationFn: AuthController.resetPassword,
    onSuccess: () => {
      console.log("Password changed");
      router.push("/");
    },
    onError: (error) => {
      console.log("Error changing your password", error);
      setTab(0);
    },
  });

  const onSubmit = (data: z.infer<typeof setPasswordFormSchema>) => {
    fullForm.setValue("password", form.getValues("password"));
    SetPasswordMutation.mutate({
      code: fullForm.getValues("code"),
      password: data.password,
    })
  };

  return (
    <Animated.View
      style={[mt.w("full"), mt.p(4), mt.flexCol, mt.gap(4)]}
      entering={SlideInRight}
      exiting={SlideOutLeft}
      layout={LinearTransition}
    >
      <FormTextInput
        name="password"
        label="Password"
        control={form.control}
        error={form.formState.errors.password}
        type="password"
      />
      <FormTextInput
        name="confirmPassword"
        label="Confirm Password"
        control={form.control}
        error={form.formState.errors.confirmPassword}
        type="password"
      />
      <Animated.View layout={LinearTransition}>
        <Button onPress={form.handleSubmit(onSubmit)}>
          {SetPasswordMutation.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text>Change Password</Text>
          )}
        </Button>
      </Animated.View>
    </Animated.View>
  );
}
