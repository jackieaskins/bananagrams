import Changelog from "./Changelog";
import { renderComponent } from "./testUtils";

describe("<Changelog />", () => {
  it("renders table of changes", () => {
    const { asFragment } = renderComponent(<Changelog />);
    expect(asFragment()).toMatchSnapshot();
  });
});
