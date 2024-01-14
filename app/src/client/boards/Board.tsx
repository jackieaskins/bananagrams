import { Card, Flex } from "@chakra-ui/react";
import BoardSquare from "./BoardSquare";
import { convertToArray } from "./convert";
import { Board as BoardType } from "@/types/board";

type BoardProps = {
  board: BoardType;
};

export default function Board({ board }: BoardProps): JSX.Element {
  return (
    <Card display="inline-flex" flexDirection="column" variant="outline">
      {convertToArray(board).map((row, y) => (
        <Flex key={y}>
          {row.map((boardSquare, x) => (
            <BoardSquare key={x} x={x} y={y} boardSquare={boardSquare} />
          ))}
        </Flex>
      ))}
    </Card>
  );
}
