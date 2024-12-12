import {
  PasswordResetRequest,
  VerifyCodeRequestSchema,
} from "../../../types/api/PasswordReset";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import z from "zod";
import { FormTextInput } from "../formUtils/textInputForm";
import { Button, CoolButton } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";
import { ActivityIndicator } from "react-native";
import mt from "@/style/mtWind";

interface VerifyCodeProps {
  setTab: (tab: 0 | 1) => void;
  fullForm: UseFormReturn<PasswordResetRequest>;
}

export default function VerifyCodeForm({ setTab, fullForm }: VerifyCodeProps) {
  const form = useForm<z.infer<typeof VerifyCodeRequestSchema>>({
    resolver: zodResolver(VerifyCodeRequestSchema),
    defaultValues: {
      code: "",
    },
  });

  const VerifyMutation = useMutation({
    mutationFn: AuthController.verifyCode,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: () => {
      fullForm.setValue("code", form.getValues("code"));
      setTab(1);
    },
  });

  const onSubmit = (data: z.infer<typeof VerifyCodeRequestSchema>) => {
    VerifyMutation.mutate(data);
    setTab(1);
  };

  return (
    <Animated.View
      layout={LinearTransition}
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={[mt.w("full"), mt.flexCol, mt.gap(4), mt.p(4)]}
    >
      <FormTextInput
        name="code"
        label="Verification Code"
        control={form.control}
        error={form.formState.errors.code}
        color="yellow"
      />
      <Animated.View layout={LinearTransition}>
        <CoolButton 
          onPress={form.handleSubmit(onSubmit)}
          disabled={VerifyMutation.isPending}
          loading={VerifyMutation.isPending}
          color="yellow"
        >
          <Text style={[mt.color("yellow"), mt.align("center")]}>Verify</Text>
        </CoolButton>
      </Animated.View>
    </Animated.View>
  );
}
