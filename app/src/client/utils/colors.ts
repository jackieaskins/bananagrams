import { useColorModeValue } from "@chakra-ui/react";
import { useColorHex } from "./useColorHex";

export function useLineColor(): string {
  return useColorModeValue("gray.400", "gray.700");
}
export function useLineColorHex(): string {
  return useColorHex([useLineColor()])[0];
}

export function useOverlayBackgroundColors(): {
  defaultBgColor: string;
  activeBgColor: string;
} {
  const [defaultBgColor, activeBgColor] = useColorHex([
    useColorModeValue("gray.100", "gray.700"),
    useColorModeValue("gray.300", "gray.600"),
  ]);
  return { defaultBgColor, activeBgColor };
}
