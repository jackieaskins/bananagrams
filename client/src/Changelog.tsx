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
});

const MAJOR_CHANGES: Change[] = [
  {
    id: "changelog",
    date: "2023-11-17",
    description: "Added changelog",
  },
  {
    id: "dark-mode",
    date: "2023-11-11",
    description: "Added dark mode",
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
                <Td textAlign="right">{date}</Td>
                <Td>{description}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}
