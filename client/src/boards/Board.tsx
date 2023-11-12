import { Card, Flex } from "@chakra-ui/react";
import { Board as BoardType } from "../boards/types";
import BoardSquare from "./BoardSquare";

type BoardProps = {
  board: BoardType;
};

export default function Board({ board }: BoardProps): JSX.Element {
  return (
    <Card display="inline-flex" flexDirection="column" variant="outline">
      {board.map((row, x) => (
        <Flex key={x}>
          {row.map((boardSquare, y) => (
            <BoardSquare key={y} x={x} y={y} boardSquare={boardSquare} />
          ))}
        </Flex>
      ))}
    </Card>
  );
}
