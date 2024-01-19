import {
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type Change = {
  id: string;
  date: string;
  description: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-us", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const MAJOR_CHANGES: Change[] = [
  {
    id: "redesign",
    date: "2024-01-18",
    description:
      "Gameplay has been completely redesigned! Give it a try, report bugs, and provide feedback.",
  },
  {
    id: "swap-tiles",
    date: "2023-12-02",
    description:
      "Added the ability to swap tiles on the board by placing one tile on top of another.",
  },
  {
    id: "leave-game-tiles",
    date: "2023-11-30",
    description:
      "Tiles will no longer return to the bunch when a player leaves the game.",
  },
  {
    id: "game-start",
    date: "2023-11-25",
    description:
      "Added start game button. The game will no longer automatically start when all players are ready.",
  },
  {
    id: "spectator-view",
    date: "2023-11-24",
    description:
      "Added spectator mode. Players can now join in-progress games as spectators!",
  },
  {
    id: "changelog",
    date: "2023-11-17",
    description: "Added changelog.",
  },
  {
    id: "dark-mode",
    date: "2023-11-11",
    description: "Added dark mode.",
  },
  {
    id: "and-we-back",
    date: "2023-11-10",
    description: "We're back!",
  },
].map(({ date, ...rest }) => ({
  date: DATE_FORMATTER.format(new Date(date)),
  ...rest,
}));

export default function Changelog(): JSX.Element {
  return (
    <Container>
      <Heading as="h1" textAlign="center" marginY="35px">
        Changelog
      </Heading>

      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th textAlign="right">Date</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>

          <Tbody>
            {MAJOR_CHANGES.map(({ id, date, description }) => (
              <Tr key={id}>
                <Td
                  textAlign="right"
                  overflowWrap="break-word"
                  verticalAlign="top"
                >
                  {date}
                </Td>
                <Td whiteSpace="normal">{description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
