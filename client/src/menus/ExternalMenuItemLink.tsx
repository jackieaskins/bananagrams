import { MenuItem } from "@chakra-ui/react";

export default function ExternalMenuItemLink({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: JSX.Element;
}): JSX.Element {
  return (
    <MenuItem as="a" href={href} icon={icon} target="_blank" rel="noreferrer">
      {children}
    </MenuItem>
  );
}
