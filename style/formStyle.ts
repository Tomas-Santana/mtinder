import { StyleSheet } from "react-native";
import s from "./styleValues";
import mt from "./mtWind";

export const formStyles = StyleSheet.create({
  container: {
    width: s.pixels.full,
    flexDirection: "column",
    gap: s.pixels[4],
    padding: s.pixels[4],
    backgroundColor: "transparent",
    borderRadius: s.borderRadius.base,  
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: s.pixels[2],
  },
  inputLabel: {
    fontSize: s.font.base,
    fontWeight: "500",
    color: "#000",
  },
  input: {
    fontFamily: s.fontFamily.sans
  },
  inputFocus: {
    backgroundColor: s.colors.gray[300]
  },
})

export const mtForm = {
  container: [mt.w("full"), mt.flexCol, mt.gap(4), mt.p(4)],
  sideText: [mt.w("full"), mt.flexRow, mt.justify("flex-end")],
  text: [mt.color("orange", 600), mt.fontSans, mt.fontWeight("black")],
}

export const genericStyles = StyleSheet.create({
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    gap: s.pixels[4],
  }
})