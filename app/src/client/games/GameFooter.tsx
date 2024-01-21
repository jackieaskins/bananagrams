import { ButtonGroup, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useGame } from "./GameContext";
import PeelButton from "./PeelButton";
import SpectateButton from "./SpectateButton";
import ShuffleHandButton from "@/client/hands/ShuffleHandButton";
import { useLineColor } from "@/client/utils/colors";

export type GameFooterProps = {
  sidebarExpanded: boolean;
};

export default function GameFooter({
  sidebarExpanded,
}: GameFooterProps): JSX.Element {
  const hideText = useBreakpointValue(
    { base: true, sm: sidebarExpanded, md: sidebarExpanded, lg: false },
    { fallback: "sm" },
  );

  const borderColor = useLineColor();
  const {
    gameInfo: { bunch },
  } = useGame();

  return (
    <Flex
      borderTop="solid"
      borderTopColor={borderColor}
      borderTopWidth={1}
      justifyContent="space-around"
      alignItems="center"
    >
      <ButtonGroup size="sm" padding={3}>
        <PeelButton hideText={hideText} />
        <ShuffleHandButton hideText={hideText} />
        <SpectateButton hideText={hideText} />
      </ButtonGroup>

      <Text fontWeight="bold">Bunch: {bunch.length} tiles</Text>
    </Flex>
  );
}
