import { shallow } from "enzyme";
import { boardSquareFixture } from "../fixtures/board";
import Board from "./Board";

describe("<Board />", () => {
  it("renders properly", () => {
    const board = { "0,0": boardSquareFixture() };

    expect(shallow(<Board board={board} />)).toMatchSnapshot();
  });
});
