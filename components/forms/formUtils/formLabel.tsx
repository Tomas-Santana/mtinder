import { GlowingText, Text } from "../../ui/text";
import mt from "@/style/mtWind";

interface FormLabelProps {
  label?: string;
}

export function FormLabel({ label }: FormLabelProps) {
  return (
    <GlowingText color="white" style={[mt.fontSize("base"), mt.fontWeight("bold"), mt.color("white")]}>{label}</GlowingText>
  );
}
