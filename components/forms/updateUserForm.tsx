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
  onClose: () => void;
}

export default function UserForm({ onClose }: UserFormProps) {
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
    onClose()
    if(
      currentUser?.firstName === data.firstName &&
      currentUser?.lastName === data.lastName
    ){
      return
    }

    if (currentUser?._id) updateUser(data)
  }

  return (
    <Animated.View style={[mt.flexCol, mt.gap(4), mt.p(4), mt.w("full")]} layout={LinearTransition}>
      <Text size="lg" weight="bold" style={[mt.align("center")]}>
        Actualiza tus datos
      </Text>
      <FormTextInput 
        name="firstName"
        control={form.control}
        placeholder="John"
        label="nombre"
        error={form.formState.errors.firstName}
      />
      <FormTextInput 
        name="lastName"
        control={form.control}
        placeholder="Holmes"
        label="Apellido"
        error={form.formState.errors.lastName}
      />
      <Animated.View layout={LinearTransition}>
        <Button variant="success" onPress={form.handleSubmit(onSubmit)}>
          <Text>
            Actualizar datos
          </Text>
        </Button>
      </Animated.View>
    </Animated.View>
  )
}