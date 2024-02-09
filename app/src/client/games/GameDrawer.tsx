import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import PlayerAccordion from "@/client/players/PlayerAccordion";

export type GameDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GameDrawer({
  isOpen,
  onClose,
}: GameDrawerProps): JSX.Element {
  const borderColor = useColorModeValue("gray.400", "gray.700");

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent backgroundColor="gray.800" paddingY={0}>
        <DrawerCloseButton />
        <DrawerHeader>Players</DrawerHeader>

        <DrawerBody paddingX={2}>
          <PlayerAccordion borderColor={borderColor} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
