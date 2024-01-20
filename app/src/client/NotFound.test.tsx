import NotFound from "./NotFound";
import { renderComponent } from "./testUtils";

describe("<NotFound />", () => {
  it("renders not found header", () => {
    const { asFragment } = renderComponent(<NotFound />);

    expect(asFragment()).toMatchSnapshot();
  });
});
