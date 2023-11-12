import { Center } from "@chakra-ui/react";

type CenteredLayoutProps = {
  children: React.ReactNode;
};

export default function CenteredLayout({
  children,
}: CenteredLayoutProps): JSX.Element {
  return <Center height="100vh">{children}</Center>;
}
