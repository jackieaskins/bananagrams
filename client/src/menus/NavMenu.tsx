import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FaBars,
  FaBookOpen,
  FaBug,
  FaHouse,
  FaLightbulb,
} from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import ExternalMenuItemLink from "./ExternalMenuItemLink";

export default function NavMenu(): JSX.Element {
  const { pathname } = useLocation();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<FaBars />}
        isRound
        position="fixed"
        top={4}
        right={4}
      />
      <MenuList>
        {pathname === "/" ? null : (
          <>
            <MenuItem as={Link} to="/" icon={<FaHouse />}>
              Return home
            </MenuItem>

            <MenuDivider />
          </>
        )}

        <ExternalMenuItemLink
          href="https://bananagrams.com/blogs/news/how-to-play-bananagrams-instructions-for-getting-started"
          icon={<FaBookOpen />}
        >
          Read official instructions
        </ExternalMenuItemLink>

        <MenuDivider />

        <ExternalMenuItemLink
          href="https://github.com/jackieaskins/bananagrams/issues/new?template=bug_report.md"
          icon={<FaBug />}
        >
          Report bug
        </ExternalMenuItemLink>

        <ExternalMenuItemLink
          href="https://github.com/jackieaskins/bananagrams/issues/new?template=feature_request.md"
          icon={<FaLightbulb />}
        >
          Suggest new feature
        </ExternalMenuItemLink>
      </MenuList>
    </Menu>
  );
}