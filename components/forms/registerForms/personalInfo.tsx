import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormTextInput } from "../formUtils/textInputForm"; 
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { Text, GlowingText } from "@/components/ui/text";
import { InfoSchema, infoSchema, FullSchema } from "./registerSchemas";
import { useMutation } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";
import { Link } from "expo-router";
import { mtForm } from "@/style/formStyle";
import mt from "@/style/mtWind";
import DropDown from "@/components/ui/dropDown";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface InfoFormProps {
  setTab: (tab: 0 | 1) => void;
  fullForm: UseFormReturn<FullSchema>;
}

export function InfoForm({ setTab, fullForm }: InfoFormProps){

  const form = useForm<InfoSchema>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      email: fullForm.getValues("info").email,
      firstName: fullForm.getValues("info").firstName,
      lastName: fullForm.getValues("info").lastName,
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: AuthController.verifyEmailAvailability,
    onError: (_) => {
      console.log("Email could not be verified.")
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data.available) {
        // set an error in form
        form.setError("email", {
          type: "manual",
          message: "Someone is using this email.",
        });
        return;
      }
      fullForm.setValue("info", {
        email: form.getValues("email"),
        firstName: form.getValues("firstName"),
        lastName: form.getValues("lastName"),
      });
      console.log(fullForm.getValues());
      setTab(1);
    },
  });

  const onSubmit = (data: InfoSchema) => {
    verifyEmailMutation.mutate(data);
  }

  return (
    <Animated.View style={mtForm.container} layout={LinearTransition} entering={SlideInRight} exiting={SlideOutLeft}>
      <FormTextInput 
        name="email"
        label="Email"
        placeholder="Linker@gmail.com"
        control={form.control}
        error={form.formState.errors.email}
      />

      <Animated.View layout={LinearTransition} style={[mt.flexRow, mt.gap(4), mt.w("full")]}>
        <FormTextInput 
          name="firstName"
          label="Name"
          placeholder="Sam"
          control={form.control}
          error={form.formState.errors.firstName}
          viewStyle={[mt.flex1]}
        />

        <FormTextInput 
          name="lastName"
          label="Last name"
          placeholder="Witwiki"
          control={form.control}
          error={form.formState.errors.lastName}
          viewStyle={[mt.flex1]}
        />
      </Animated.View>
      
      <Animated.View layout={LinearTransition}>
        <Button 
          onPress={form.handleSubmit(onSubmit)}
          loading={verifyEmailMutation.isPending}
          disabled={verifyEmailMutation.isPending}
        >
          <Text>Next</Text>
        </Button>
      </Animated.View>
      <Animated.View style={mtForm.sideText}>
        <Link href="/" style={mtForm.text}>
          <Text>
            Back to Log In
          </Text>
        </Link>
      </Animated.View>
    </Animated.View>
  )
}