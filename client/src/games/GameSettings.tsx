import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Switch,
} from "@chakra-ui/react";
import { FaCircleInfo } from "react-icons/fa6";
import { useEnableTileSwap } from "../LocalStorageContext";
import ForwardedTooltip from "../common/ForwardedTooltip";

export default function GameSettings(): JSX.Element {
  const [enableTileSwap, setEnableTileSwap] = useEnableTileSwap();

  return (
    <Card variant="outline" colorScheme="blue">
      <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
          <Heading size="sm">Game settings</Heading>

          <FormControl as={HStack} spacing={2}>
            <Switch
              id="swap-tiles"
              isChecked={enableTileSwap}
              onChange={(event) => {
                setEnableTileSwap(event.target.checked);
              }}
            />

            <FormLabel htmlFor="swap-tiles" mb={0} mr={0}>
              Enable tile swap
            </FormLabel>

            <ForwardedTooltip
              label="When enabled, dropping a tile on top of another tile on the board will result in the two tiles swapping places"
              shouldWrapChildren
              hasArrow
            >
              <FaCircleInfo />
            </ForwardedTooltip>
          </FormControl>
        </Stack>
      </CardBody>
    </Card>
  );
}
