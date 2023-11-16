import { Input } from "@chakra-ui/react";
import { shallow } from "enzyme";
import TextField from "./TextField";

describe("<TextField />", () => {
  const mockSetValue = jest.fn();

  const renderComponent = (propOverrides = {}) =>
    shallow(
      <TextField
        setValue={mockSetValue}
        value="value"
        isRequired
        label="Label"
        name="name"
        type="text"
        {...propOverrides}
      />,
    );

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test("defaults isRequired to false", () => {
    expect(renderComponent({ isRequired: undefined }).props().isRequired).toBe(
      false,
    );
  });

  test("onChange calls setValue", () => {
    renderComponent()
      .find(Input)
      .props()
      .onChange({ target: { value: "newValue" } });

    expect(mockSetValue).toHaveBeenCalledWith("newValue");
  });
});
