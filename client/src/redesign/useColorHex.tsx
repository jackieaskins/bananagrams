import { useColorModeValue, useToken } from "@chakra-ui/react";

export function useColorHex(colors: string[]): string[] {
  return useToken("colors", colors);
}

export function useColorModeHex(light: string, dark: string): string {
  const value = useColorModeValue(light, dark);
  return useToken("colors", [value])[0];
}
