import { shallow } from "enzyme";
import PreviewBoard from "./PreviewBoard";
import { boardSquareFixture } from "@/client/fixtures/board";

describe("<PreviewBoard />", () => {
  it("renders properly", () => {
    expect(
      shallow(
        <PreviewBoard board={{ "0,0": boardSquareFixture() }} tileSize={23} />,
      ),
    ).toMatchSnapshot();
  });
});
