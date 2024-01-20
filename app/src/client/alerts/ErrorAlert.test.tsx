import { screen } from "@testing-library/react";
import ErrorAlert from "./ErrorAlert";
import { renderComponent } from "@/client/testUtils";

describe("<ErrorAlert />", () => {
  it("renders Alert when visible", () => {
    const { asFragment } = renderComponent(
      <ErrorAlert title="Title" visible>
        Children
      </ErrorAlert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("returns null when not visible", () => {
    renderComponent(<ErrorAlert visible={false}>Error</ErrorAlert>);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
