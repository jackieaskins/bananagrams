import App from "./App";
import { renderComponent } from "./testUtils";

describe("<App />", () => {
  it("renders properly", () => {
    const { asFragment } = renderComponent(<App />);

    expect(asFragment()).toMatchSnapshot();
  });
});
