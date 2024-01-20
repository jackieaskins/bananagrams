import CenteredLayout from "./CenteredLayout";
import { renderComponent } from "@/client/testUtils";

describe("<CeneteredLayout />", () => {
  it("renders properly", () => {
    const { asFragment } = renderComponent(
      <CenteredLayout>Children</CenteredLayout>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
