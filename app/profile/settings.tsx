import { View } from "react-native";
import mt from "@/style/mtWind";
import { SimpleNavbar } from "@/components/app/simpleNavbar";
import { UpdateModal } from "@/components/updateUserModal";

export default function Settings(){
  return (
    <View style={[mt.flex]}>
      <View style={[mt.position("absolute"), mt.top(0), mt.left(0), mt.z(2)]}>
        <SimpleNavbar />
      </View>
      <View style={[mt.items("center"), mt.justify("center")]}>
        <UpdateModal />
      </View>
    </View>
  )
}