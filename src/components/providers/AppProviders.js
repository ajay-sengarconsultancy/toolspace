"use client";

import { MantineProvider } from "@mantine/core";
import { RequestsProvider } from "./RequestsProvider";
import theme from "../../theme";

export default function AppProviders({ children }) {
  return (
    <MantineProvider theme={theme}>
      <RequestsProvider>{children}</RequestsProvider>
    </MantineProvider>
  );
}
