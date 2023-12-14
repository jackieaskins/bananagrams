import { Card, Flex } from "@chakra-ui/react";
import { Board as BoardType } from "../../types/board";
import BoardSquare from "./BoardSquare";
import { convertToArray } from "./convert";

type BoardProps = {
  board: BoardType;
};

export default function Board({ board }: BoardProps): JSX.Element {
  return (
    <Card display="inline-flex" flexDirection="column" variant="outline">
      {convertToArray(board).map((row, x) => (
        <Flex key={x}>
          {row.map((boardSquare, y) => (
            <BoardSquare key={y} x={x} y={y} boardSquare={boardSquare} />
          ))}
        </Flex>
      ))}
    </Card>
  );
}
