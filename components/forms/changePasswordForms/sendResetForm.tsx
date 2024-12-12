import { View, SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";
import Animated, {
  SlideInRight,
  SlideOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { useRouter, Link } from "expo-router";
import { ActivityIndicator } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import mt from "@/style/mtWind";
import { FormTextInput } from "../formUtils/textInputForm";

const sendResetFormSchema = z.object({
  email: z
    .string()
    .min(1, "Ingrese un email valido.")
    .max(50, "El email es muy largo")
    .email("Email invalido.")
    .toLowerCase()
    .trim(),
});

export default function SendResetForm() {
  const form = useForm<z.infer<typeof sendResetFormSchema>>({
    resolver: zodResolver(sendResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const SendResetMutation = useMutation({
    mutationFn: AuthController.sendResetEmail,
    onSuccess: () => {
      console.log("Email sent!");
      router.push("/auth/changePasswordPage");
    },
    onError: (error) => {
      console.log("Error sending email", error);
    },
  });

  const onSubmit = (data: z.infer<typeof sendResetFormSchema>) => {
    SendResetMutation.mutate(data)
    console.log("Data sent", data);
  };

  return (
    <Animated.View
      layout={LinearTransition}
      style={[mt.w("full"), mt.p(4), mt.flexCol, mt.gap(4)]}
    >
      <FormTextInput
        name="email"
        label="Email"
        control={form.control}
        placeholder="Linker@gmail.com"
        error={form.formState.errors.email}
      />

      <Animated.View layout={LinearTransition}>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          loading={SendResetMutation.isPending}
          disabled={SendResetMutation.isPending}
        >
          <Text style={[mt.align("center")]}>Enviar Email</Text>
        </Button>
      </Animated.View>

      <Animated.View
        style={[mt.w("full"), mt.justify("center")]}
        layout={LinearTransition}
      >
        <Text style={[mt.align("center"), mt.color("white")]}>
          Remember your password?{" "}
          <Link href={"/"} style={[mt.color("orange"), mt.align("center")]}>
            Log in.
          </Link>
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
