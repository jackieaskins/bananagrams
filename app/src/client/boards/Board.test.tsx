import { shallow } from "enzyme";
import Board from "./Board";
import { boardSquareFixture } from "@/client/fixtures/board";

describe("<Board />", () => {
  it("renders properly", () => {
    const board = { "0,0": boardSquareFixture() };

    expect(shallow(<Board board={board} />)).toMatchSnapshot();
  });
});
