import {
  Box,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Td,
  Tooltip,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
  FaCheck,
  FaCrown,
  FaKey,
  FaRegEye,
  FaRegTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import ForwardedTooltip from "../common/ForwardedTooltip";
import { useSocket } from "../socket/SocketContext";
import { Player, PlayerStatus } from "./types";

export type PlayerTableRowProps = {
  isCurrentPlayerAdmin: boolean;
  player: Player;
  playerCount: number;
};

const STATUS_TO_ICON: Record<PlayerStatus, IconType> = {
  [PlayerStatus.NOT_READY]: FaXmark,
  [PlayerStatus.SPECTATING]: FaRegEye,
  [PlayerStatus.READY]: FaCheck,
};

const STATUS_TO_COLOR: Record<PlayerStatus, string> = {
  [PlayerStatus.NOT_READY]: "red.300",
  [PlayerStatus.SPECTATING]: "blue.200",
  [PlayerStatus.READY]: "green.300",
};

const STATUS_TO_DISPLAY_TEXT: Record<PlayerStatus, string> = {
  [PlayerStatus.NOT_READY]: "Not ready",
  [PlayerStatus.SPECTATING]: "Spectating",
  [PlayerStatus.READY]: "Ready",
};

export default function PlayerTableRow({
  isCurrentPlayerAdmin,
  player: { gamesWon, isTopBanana, isAdmin, status, userId, username },
  playerCount,
}: PlayerTableRowProps): JSX.Element {
  const { socket } = useSocket();
  const isCurrentUser = userId === socket.id;
  const currentPlayerBackground = useColorModeValue("gray.100", "gray.700");

  const StatusIcon = useMemo(() => STATUS_TO_ICON[status], [status]);
  const statusColor = useMemo(() => STATUS_TO_COLOR[status], [status]);
  const statusText = useMemo(() => STATUS_TO_DISPLAY_TEXT[status], [status]);

  return (
    <Tr
      background={isCurrentUser ? currentPlayerBackground : undefined}
      opacity={status === PlayerStatus.SPECTATING ? 0.75 : 1}
    >
      <Td textAlign="right">
        {isCurrentUser ? (
          <ButtonGroup size="sm" isAttached variant="outline">
            {Object.values(PlayerStatus).map((buttonStatus) => {
              const Icon = STATUS_TO_ICON[buttonStatus];
              const color =
                status === buttonStatus
                  ? STATUS_TO_COLOR[buttonStatus]
                  : undefined;
              const label = `Set status as ${STATUS_TO_DISPLAY_TEXT[
                buttonStatus
              ].toLowerCase()}`;

              return (
                <Tooltip key={buttonStatus} hasArrow label={label}>
                  <IconButton
                    color={color}
                    borderColor={color}
                    aria-label={label}
                    icon={<Icon />}
                    onClick={() =>
                      socket.emit("setStatus", { status: buttonStatus })
                    }
                  />
                </Tooltip>
              );
            })}
          </ButtonGroup>
        ) : (
          <HStack color={statusColor} display="inline-flex">
            <Icon as={StatusIcon} aria-labelledby={`${username}-status`} />
            <Box id={`${username}-status`}>{statusText}</Box>
          </HStack>
        )}
      </Td>

      <Td>
        <HStack>
          <span>{username}</span>
          {isAdmin && (
            <ForwardedTooltip label="Admin" hasArrow>
              <Icon as={FaKey} boxSize={3} aria-label="Admin" />
            </ForwardedTooltip>
          )}
          {isTopBanana && (
            <ForwardedTooltip label="Previous round winner" hasArrow>
              <Icon
                as={FaCrown}
                boxSize={3}
                aria-label="Previous round winner"
              />
            </ForwardedTooltip>
          )}
        </HStack>
      </Td>

      <Td isNumeric>{gamesWon}</Td>

      {isCurrentPlayerAdmin && playerCount > 1 && (
        <Td>
          {!isCurrentUser && (
            <IconButton
              aria-label={`Kick ${username} from the game`}
              icon={<FaRegTrashCan />}
              size="small"
              onClick={(): void => {
                socket.emit("kickPlayer", { userId });
              }}
            />
          )}
        </Td>
      )}
    </Tr>
  );
}
