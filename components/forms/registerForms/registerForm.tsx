import { useState } from "react";
import { InfoForm } from "./personalInfo";
import { PasswordForm } from "./passwordForm";
import Animated from "react-native-reanimated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FullSchema, fullSchema } from "./registerSchemas";
import { StyleSheet } from "react-native";

type TabNumber = 0 | 1 | 2

export default function RegisterForm() {
  const form = useForm<FullSchema>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      info: {
        email: "",
        firstName: "",
        lastName: "", 
      },
      password: {
        password: "",
        confirmPassword: ""
      }
    }
  })

  const [tab, setTab] = useState<TabNumber>(0)
  const tabs = [
    <InfoForm setTab={setTab} fullForm={form}/>,
    <PasswordForm setTab={setTab} fullForm={form}/>,
  ]

  return (
    <Animated.View style={style.container}>
      {
        tabs[tab] ?? <InfoForm setTab={setTab} fullForm={form}/>
      }
    </Animated.View>
  )
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8
  }
})