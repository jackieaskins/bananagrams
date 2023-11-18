import { shallow } from "enzyme";
import Changelog from "./Changelog";

describe("<Changelog />", () => {
  it("renders table of changes", () => {
    // NOTE: Snapshot will have dates one day behind...
    expect(shallow(<Changelog />)).toMatchSnapshot();
  });
});
