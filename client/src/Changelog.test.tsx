import { shallow } from "enzyme";
import Changelog from "./Changelog";

describe("<Changelog />", () => {
  it("renders table of changes", () => {
    expect(shallow(<Changelog />)).toMatchSnapshot();
  });
});
