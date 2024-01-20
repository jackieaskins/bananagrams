import { Menu, MenuList } from "@chakra-ui/react";
import ExternalMenuItemLink from "./ExternalMenuItemLink";
import { renderComponent } from "@/client/testUtils";

describe("<ExternalMenuItemLink />", () => {
  it("renders a menu item as link", () => {
    const { asFragment } = renderComponent(
      <Menu>
        <MenuList>
          <ExternalMenuItemLink href="href" icon={<div>Icon</div>}>
            Children
          </ExternalMenuItemLink>
        </MenuList>
      </Menu>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
