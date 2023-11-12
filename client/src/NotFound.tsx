import { Heading } from "@chakra-ui/react";
import CenteredLayout from "./layouts/CenteredLayout";

export default function NotFound(): JSX.Element {
  return (
    <CenteredLayout>
      <Heading as="h1">404: Page Not Found</Heading>
    </CenteredLayout>
  );
}
