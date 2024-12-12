import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormTextInput } from "../formUtils/textInputForm";
import { Text, GlowingText } from "@/components/ui/text";
import { Button, CoolButton } from "@/components/ui/button";
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
import { Toast } from "@/components/ui/toast";
import mt from "@/style/mtWind";

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
      Toast.error(error.message);
    },
    onSuccess: () => {
      Toast.success("Account created successfully. Let's get you started!");
      fullForm.reset();
      form.reset();
      setTab(0);
      router.push("/main/home");
    },
  });

  const onSubmit = (data: PasswordSchema) => {
    fullForm.setValue("password", data);

    const formData = fullForm.getValues();
    console.log(formData);
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
      style={[formStyles.container]}
    >
      <FormTextInput
        name="password"
        control={form.control}
        label="Password"
        error={form.formState.errors.password}
        type="password"
        color="orange"
      />
      <FormTextInput
        name="confirmPassword"
        control={form.control}
        label="Confirm Password"
        error={form.formState.errors.confirmPassword}
        type="password"
        color="orange"
      />
      <Animated.View layout={LinearTransition} style={[mt.mb(2)]}>
        <CoolButton
          onPress={form.handleSubmit(onSubmit)}
          loading={registerMutation.isPending}
          disabled={registerMutation.isPending}
          color="orange"
          style={[mt.p(2)]}
        >
          <Text style={[mt.color("orange"), mt.align("center")]}>Create Account</Text>
        </CoolButton>
      </Animated.View>
      <Animated.View layout={LinearTransition}>
        <CoolButton color="blue" onPress={() => setTab(0)} style={[mt.p(2)]}>
          <Text style={[mt.color("blue"), mt.align("center")]}>Go Back</Text>
        </CoolButton>
      </Animated.View>
    </Animated.View>
  );
}
