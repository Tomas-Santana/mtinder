import { Text } from "../../ui/text";
import mt from "@/style/mtWind";

interface FormLabelProps {
  label?: string;
}

export function FormLabel({ label }: FormLabelProps) {
  return (
    <Text style={[mt.fontSize("base"), mt.fontWeight("bold")]}>{label}</Text>
  );
}
