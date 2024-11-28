import { DimensionValue } from "react-native";

export type ColorShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

const s = {
  pixels: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
    100: 400,
    full: "100%" as DimensionValue,
    half: "50%" as DimensionValue,
    sixty: "55%" as DimensionValue,
    twoThirds: "66.666667%" as DimensionValue,
    third: "33.333333%" as DimensionValue,
  },
  negativePixels: {
    "-1": -4,
    "-2": -8,
    "-3": -12,
    "-4": -16,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
    full: 9999,
  },
  borderWidth: {
    1: 1,
    2: 2,
    4: 4,
    8: 8,
  },
  font: {
    xs: 10,
    sm: 12,
    base: 16,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
    "3xl": 40,
    "4xl": 44,
    "5xl": 48,
    "6xl": 52,
    bold: "500" as "500",
    black: "900" as "900",
    normal: "normal",
    italic: "italic",
  },
  fontFamily: {
    sans: "Lexend_500Medium",
    sansBold: "Lexend_700Bold",
    sansBlack: "Lexend_900Black",
  },
  colors: {
    purple: {
      50: "rgba(253, 249, 255, 1)",
      100: "rgba(252, 242, 255, 1)",
      200: "rgba(247, 223, 255, 1)",
      300: "rgba(241, 203, 255, 1)",
      400: "rgba(231, 164, 255, 1)",
      500: "rgba(221, 125, 255, 1)",
      600: "rgba(199, 113, 230, 1)",
      700: "rgba(133, 75, 153, 1)",
      800: "rgba(99, 56, 115, 1)",
      900: "rgba(66, 38, 77, 1)",
    } as const,
    purpleOpacity: {
      50: (opacity = 1) => `rgba(253, 249, 255, ${opacity})`,
      100: (opacity = 1) => `rgba(252, 242, 255, ${opacity})`,
      200: (opacity = 1) => `rgba(247, 223, 255, ${opacity})`,
      300: (opacity = 1) => `rgba(241, 203, 255, ${opacity})`,
      400: (opacity = 1) => `rgba(231, 164, 255, ${opacity})`,
      500: (opacity = 1) => `rgba(221, 125, 255, ${opacity})`,
      600: (opacity = 1) => `rgba(199, 113, 230, ${opacity})`,
      700: (opacity = 1) => `rgba(133, 75, 153, ${opacity})`,
      800: (opacity = 1) => `rgba(99, 56, 115, ${opacity})`,
      900: (opacity = 1) => `rgba(66, 38, 77, ${opacity})`,
    },
    blue: {
      50: "rgba(245, 253, 255, 1)",
      100: "rgba(235, 251, 255, 1)",
      200: "rgba(206, 246, 255, 1)",
      300: "rgba(176, 241, 255, 1)",
      400: "rgba(116, 230, 255, 1)",
      500: "rgba(57, 219, 255, 1)",
      600: "rgba(51, 197, 230, 1)",
      700: "rgba(34, 131, 153, 1)",
      800: "rgba(26, 99, 115, 1)",
      900: "rgba(17, 66, 77, 1)",
    },
    blueOpacity: {
      50: (opacity = 1) => `rgba(245, 253, 255, ${opacity})`,
      100: (opacity = 1) => `rgba(235, 251, 255, ${opacity})`,
      200: (opacity = 1) => `rgba(206, 246, 255, ${opacity})`,
      300: (opacity = 1) => `rgba(176, 241, 255, ${opacity})`,
      400: (opacity = 1) => `rgba(116, 230, 255, ${opacity})`,
      500: (opacity = 1) => `rgba(57, 219, 255, ${opacity})`,
      600: (opacity = 1) => `rgba(51, 197, 230, ${opacity})`,
      700: (opacity = 1) => `rgba(34, 131, 153, ${opacity})`,
      800: (opacity = 1) => `rgba(26, 99, 115, ${opacity})`,
      900: (opacity = 1) => `rgba(17, 66, 77, ${opacity})`,
    },
    red: {
      50: "rgba(255, 247, 247, 1)",
      100: "rgba(255, 239, 239, 1)",
      200: "rgba(255, 215, 215, 1)",
      300: "rgba(255, 190, 190, 1)",
      400: "rgba(255, 142, 142, 1)",
      500: "rgba(255, 93, 93, 1)",
      600: "rgba(230, 84, 84, 1)",
      700: "rgba(153, 56, 56, 1)",
      800: "rgba(115, 42, 42, 1)",
      900: "rgba(77, 28, 28, 1)",
    },
    redOpacity: {
      50: (opacity = 1) => `rgba(255, 247, 247, ${opacity})`,
      100: (opacity = 1) => `rgba(255, 239, 239, ${opacity})`,
      200: (opacity = 1) => `rgba(255, 215, 215, ${opacity})`,
      300: (opacity = 1) => `rgba(255, 190, 190, ${opacity})`,
      400: (opacity = 1) => `rgba(255, 142, 142, ${opacity})`,
      500: (opacity = 1) => `rgba(255, 93, 93, ${opacity})`,
      600: (opacity = 1) => `rgba(230, 84, 84, ${opacity})`,
      700: (opacity = 1) => `rgba(153, 56, 56, ${opacity})`,
      800: (opacity = 1) => `rgba(115, 42, 42, ${opacity})`,
      900: (opacity = 1) => `rgba(77, 28, 28, ${opacity})`,
    },
    green: {
      50: "rgba(242, 255, 248, 1)",
      100: "rgba(230, 255, 241, 1)",
      200: "rgba(191, 255, 221, 1)",
      300: "rgba(153, 255, 200, 1)",
      400: "rgba(77, 255, 158, 1)",
      500: "rgba(0, 255, 117, 1)",
      600: "rgba(0, 230, 105, 1)",
      700: "rgba(0, 153, 70, 1)",
      800: "rgba(0, 115, 53, 1)",
      900: "rgba(0, 77, 35, 1)",
    },

    greenOpacity: {
      50: (opacity = 1) => `rgba(242, 255, 248, ${opacity})`,
      100: (opacity = 1) => `rgba(230, 255, 241, ${opacity})`,
      200: (opacity = 1) => `rgba(191, 255, 221, ${opacity})`,
      300: (opacity = 1) => `rgba(153, 255, 200, ${opacity})`,
      400: (opacity = 1) => `rgba(77, 255, 158, ${opacity})`,
      500: (opacity = 1) => `rgba(0, 255, 117, ${opacity})`,
      600: (opacity = 1) => `rgba(0, 230, 105, ${opacity})`,
      700: (opacity = 1) => `rgba(0, 153, 70, ${opacity})`,
      800: (opacity = 1) => `rgba(0, 115, 53, ${opacity})`,
      900: (opacity = 1) => `rgba(0, 77, 35, ${opacity})`,
    },

    orange: {
      50: "rgba(255, 251, 246, 1)",
      100: "rgba(255, 248, 236, 1)",
      200: "rgba(255, 236, 208, 1)",
      300: "rgba(255, 225, 180, 1)",
      400: "rgba(255, 203, 123, 1)",
      500: "rgba(255, 180, 67, 1)",
      600: "rgba(230, 162, 60, 1)",
      700: "rgba(153, 108, 40, 1)",
      800: "rgba(115, 81, 30, 1)",
      900: "rgba(77, 54, 20, 1)",
    },
    orangeOpacity: {
      50: (opacity = 1) => `rgba(255, 251, 246, ${opacity})`,
      100: (opacity = 1) => `rgba(255, 248, 236, ${opacity})`,
      200: (opacity = 1) => `rgba(255, 236, 208, ${opacity})`,
      300: (opacity = 1) => `rgba(255, 225, 180, ${opacity})`,
      400: (opacity = 1) => `rgba(255, 203, 123, ${opacity})`,
      500: (opacity = 1) => `rgba(255, 180, 67, ${opacity})`,
      600: (opacity = 1) => `rgba(230, 162, 60, ${opacity})`,
      700: (opacity = 1) => `rgba(153, 108, 40, ${opacity})`,
      800: (opacity = 1) => `rgba(115, 81, 30, ${opacity})`,
      900: (opacity = 1) => `rgba(77, 54, 20, ${opacity})`,
    },
    yellow: {
      50: "rgba(255, 253, 246, 1)",
      100: "rgba(255, 252, 237, 1)",
      200: "rgba(255, 247, 209, 1)",
      300: "rgba(254, 243, 181, 1)",
      400: "rgba(254, 233, 126, 1)",
      500: "rgba(253, 224, 71, 1)",
      600: "rgba(228, 202, 64, 1)",
      700: "rgba(152, 134, 43, 1)",
      800: "rgba(114, 101, 32, 1)",
      900: "rgba(76, 67, 21, 1)",
    },
    yellowOpacity: {
      50: (opacity = 1) => `rgba(255, 253, 246, ${opacity})`,
      100: (opacity = 1) => `rgba(255, 252, 237, ${opacity})`,
      200: (opacity = 1) => `rgba(255, 247, 209, ${opacity})`,
      300: (opacity = 1) => `rgba(254, 243, 181, ${opacity})`,
      400: (opacity = 1) => `rgba(254, 233, 126, ${opacity})`,
      500: (opacity = 1) => `rgba(253, 224, 71, ${opacity})`,
      600: (opacity = 1) => `rgba(228, 202, 64, ${opacity})`,
      700: (opacity = 1) => `rgba(152, 134, 43, ${opacity})`,
      800: (opacity = 1) => `rgba(114, 101, 32, ${opacity})`,
      900: (opacity = 1) => `rgba(76, 67, 21, ${opacity})`,
    },
    white: "#fff",
    whiteOpacity: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    black: "#000",
    blackOpacity: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    transparent: "transparent",
    gray: {
      50: "rgba(250, 250, 250, 1)",
      100: "rgba(245, 245, 245, 1)",
      200: "rgba(238, 238, 238, 1)",
      300: "rgba(224, 224, 224, 1)",
      400: "rgba(189, 189, 189, 1)",
      500: "rgba(158, 158, 158, 1)",
      600: "rgba(117, 117, 117, 1)",
      700: "rgba(97, 97, 97, 1)",
      800: "rgba(66, 66, 66, 1)",
      900: "rgba(33, 33, 33, 1)",
    },
    grayOpacity: (opacity = 1) => `rgba(211, 211, 211, ${opacity})`,
    background: "#fee9ce",
  },
  shadow: {
    md: {
      stretch: true,
      startColor: "#000",
      endColor: "#000",
      style: { borderRadius: 8 },
      distance: 1,
      offset: [5, 4] as [number, number],
    },
    mdNoRound: {
      stretch: true,
      startColor: "#000",
      endColor: "#000",
      distance: 1,
      offset: [5, 4] as [number, number],
    },
  },
  timing: {
    fast: 100,
    base: 400,
    slow: 600,
  },
} as const;

export default s;