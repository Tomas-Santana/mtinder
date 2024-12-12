import { Text } from "../ui/text";
import { Button } from "../ui/button";
import mt from "@/style/mtWind";
import Animated, { LinearTransition } from "react-native-reanimated";
import z from "zod"
import { UserFormSchema } from "@/types/api/UserRequest";
import { FormTextInput } from "./formUtils/textInputForm"; 
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { useUser } from "@/hooks/app/useUser";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserFormProps {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

export default function UserForm({ setFirstName, setLastName }: UserFormProps) {
  const [currentUser, setCurrentUser] = useAtom(userAtom)
  const { updateUser } = useUser(currentUser || undefined, setCurrentUser)
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "", 
    }
  })

  const onSubmit = (data: z.infer<typeof UserFormSchema>) => {
    if(
      currentUser?.firstName === data.firstName &&
      currentUser?.lastName === data.lastName
    ){
      return
    }

    setFirstName(data.firstName)
    setLastName(data.lastName)
  }

  return (

      <Animated.View style={[mt.flexCol, mt.gap(4), mt.w("full")]} layout={LinearTransition}>
      <FormTextInput 
        name="firstName"
        control={form.control}
        placeholder="John"
        label="Tu nombre"
        error={form.formState.errors.firstName}
        inputStyle={[mt.bg("gray", 800)]}
      />
      <FormTextInput 
        name="lastName"
        control={form.control}
        placeholder="Holmes"
        label="Tu apellido"
        error={form.formState.errors.lastName}
        inputStyle={[mt.bg("gray", 800)]}
      />
      <Animated.View layout={LinearTransition} style={[mt.mt(5)]}>
        <Button variant="success" onPress={form.handleSubmit(onSubmit)}>
        <Text>
          Save
        </Text>
        </Button>
      </Animated.View>
      </Animated.View>
  )
}