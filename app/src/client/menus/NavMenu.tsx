import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useMemo } from "react";
import {
  FaBars,
  FaBookOpen,
  FaBug,
  FaGraduationCap,
  FaHouse,
  FaLightbulb,
  FaList,
} from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import ExternalMenuItemLink from "./ExternalMenuItemLink";

export default function NavMenu(): JSX.Element {
  const { pathname } = useLocation();

  const homeRoute = useMemo(
    () => (pathname.startsWith("/redesign") ? "/redesign" : "/"),
    [pathname],
  );

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
        {pathname === homeRoute ? null : (
          <MenuItem as={Link} to={homeRoute} icon={<FaHouse />}>
            Return home
          </MenuItem>
        )}

        <MenuItem as={Link} to="/changelog" icon={<FaList />}>
          View changelog
        </MenuItem>

        <MenuDivider />

        <MenuItem as={Link} to="/tutorial" icon={<FaGraduationCap />}>
          Play tutorial
        </MenuItem>

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
