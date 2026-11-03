import { createTheme, rem } from "@mantine/core";

const theme = createTheme({
  primaryColor: "forest",
  primaryShade: 6,
  fontFamily: '"Figtree", sans-serif',
  headings: {
    fontFamily: '"Figtree", sans-serif',
    fontWeight: "600",
  },
  colors: {
    forest: [
      "#edf4ee",
      "#d9e8dc",
      "#b5d1bc",
      "#8cb99a",
      "#629e76",
      "#43845b",
      "#1f5132",
      "#1b472c",
      "#163b24",
      "#102d1b",
    ],
  },
  defaultRadius: "sm",
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(20),
    lg: rem(32),
    xl: rem(48),
  },
});

export default theme;
