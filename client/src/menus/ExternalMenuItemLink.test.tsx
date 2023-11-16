import { shallow } from "enzyme";
import ExternalMenuItemLink from "./ExternalMenuItemLink";

describe("<ExternalMenuItemLink />", () => {
  it("renders a menu item as link", () => {
    expect(
      shallow(
        <ExternalMenuItemLink href="href" icon={<div>Icon</div>}>
          Children
        </ExternalMenuItemLink>,
      ),
    ).toMatchSnapshot();
  });
});
