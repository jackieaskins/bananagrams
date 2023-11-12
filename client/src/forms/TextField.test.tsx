import { Input } from "@chakra-ui/react";
import { shallow } from "enzyme";
import TextField from "./TextField";

describe("<TextField />", () => {
  const mockSetValue = jest.fn();

  const renderComponent = () =>
    shallow(
      <TextField
        setValue={mockSetValue}
        value="value"
        isRequired
        label="Label"
        name="name"
        type="text"
      />,
    );

  test("renders properly", () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test("onChange calls setValue", () => {
    renderComponent()
      .find(Input)
      .props()
      .onChange({ target: { value: "newValue" } });

    expect(mockSetValue).toHaveBeenCalledWith("newValue");
  });
});
