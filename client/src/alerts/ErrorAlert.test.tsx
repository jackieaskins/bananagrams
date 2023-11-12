import { shallow } from "enzyme";
import ErrorAlert from "./ErrorAlert";

describe("<ErrorAlert />", () => {
  test("renders Alert when visible", () => {
    expect(
      shallow(
        <ErrorAlert title="Title" visible>
          Children
        </ErrorAlert>,
      ),
    ).toMatchSnapshot();
  });

  test("returns null when not visible", () => {
    expect(
      shallow(<ErrorAlert visible={false}>Error</ErrorAlert>),
    ).toMatchSnapshot();
  });
});
