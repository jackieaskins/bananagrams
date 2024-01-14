import { ButtonGroup, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { useLineColor } from "./colors";
import { useGame } from "@/client/games/GameContext";
import PeelButton from "@/client/games/PeelButton";
import SpectateButton from "@/client/games/SpectateButton";
import ShuffleHandButton from "@/client/hands/ShuffleHandButton";

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
