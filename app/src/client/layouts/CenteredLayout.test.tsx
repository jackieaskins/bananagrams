import { shallow } from "enzyme";
import CenteredLayout from "./CenteredLayout";

describe("<CeneteredLayout />", () => {
  test("renders properly with default width", () => {
    expect(
      shallow(<CenteredLayout>Children</CenteredLayout>),
    ).toMatchSnapshot();
  });

  test("renders properly with passed in width", () => {
    expect(
      shallow(<CenteredLayout width={2}>Children</CenteredLayout>),
    ).toMatchSnapshot();
  });
});
